from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import yfinance as yf
import pandas as pd
import json
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                pass

manager = ConnectionManager()

def fetch_stock_data(tickers=["AAPL", "TSLA", "MSFT", "GOOGL", "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ZOMATO.NS"]):
    data = {}
    for ticker in tickers:
        try:
            stock = yf.Ticker(ticker)
            # Use a slightly longer window for more reliable data during market off-hours
            hist = stock.history(period="5d", interval="1m")
            if not hist.empty:
                latest = hist.iloc[-1]
                data[ticker] = {
                    "price": round(latest["Close"], 2),
                    "volume": int(latest["Volume"]),
                    "high": round(latest["High"], 2),
                    "low": round(latest["Low"], 2),
                    "timestamp": str(latest.name),
                    "currency": "INR" if ticker.endswith(".NS") else "USD"
                }
            else:
                data[ticker] = {"error": "No data"}
        except Exception:
            pass
    return data

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(price_streamer())

async def price_streamer():
    while True:
        try:
            data = fetch_stock_data()
            if data:
                await manager.broadcast(json.dumps({"type": "MARKET_DATA", "data": data}))
        except Exception as e:
            print(f"Error fetching streaming data: {e}")
        
        # Poll every 10 seconds to avoid strict rate limits
        await asyncio.sleep(10)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # wait for messages from client (e.g., subscribe to specific ticker)
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

from pydantic import BaseModel
from datetime import datetime

class SalesRecord(BaseModel):
    product: str
    amount: float
    date: str

class TradeRecord(BaseModel):
    ticker: str
    quantity: int
    price: float
    type: str  # "BUY" or "SELL"
    date: str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# In-memory storage for manual trades
manual_trades = []

# In-memory storage for retail sales
retail_sales = [
    {"product": "Laptop", "amount": 1200, "date": "2024-03-20"},
    {"product": "Mouse", "amount": 25, "date": "2024-03-21"},
    {"product": "Keyboard", "amount": 75, "date": "2024-03-22"},
    {"product": "Monitor", "amount": 300, "date": "2024-03-23"},
]

@app.get("/api/sales")
def get_sales():
    return retail_sales

@app.post("/api/sales")
def add_sale(record: SalesRecord):
    retail_sales.append(record.dict())
    return {"status": "success", "record": record}

@app.get("/")
def read_root():
    return {"status": "Backend is running", "features": ["Stock Streaming", "Retail Sales", "Manual Trading"]}

@app.get("/api/trades")
def get_trades():
    return manual_trades

@app.post("/api/trades")
def add_trade(trade: TradeRecord):
    manual_trades.append(trade.dict())
    return {"status": "success", "trade": trade}

@app.get("/api/stock/{ticker}")
def get_stock_details(ticker: str):
    stock = yf.Ticker(ticker)
    info = stock.info
    hist = stock.history(period="1y")
    
    if not hist.empty:
        hist['MA20'] = hist['Close'].rolling(window=20).mean()
        delta = hist['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        hist['RSI'] = 100 - (100 / (1 + rs))
        
        # Reset index to get Date into columns, convert to string
        hist = hist.reset_index()
        hist_data = hist.to_dict('records')
        for row in hist_data:
            row['Date'] = str(row['Date'])
            row['MA20'] = None if pd.isna(row['MA20']) else float(row['MA20'])
            row['RSI'] = None if pd.isna(row['RSI']) else float(row['RSI'])
    else:
        hist_data = []

    return {
        "ticker": ticker,
        "info": {
            "name": info.get("shortName", ticker),
            "marketCap": info.get("marketCap"),
            "volume": info.get("volume"),
            "dayHigh": info.get("dayHigh"),
            "dayLow": info.get("dayLow"),
            "currentPrice": info.get("currentPrice", info.get("regularMarketPrice")),
            "description": info.get("longBusinessSummary", "")
        },
        "history": hist_data
    }
