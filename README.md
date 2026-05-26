<div align="center">

# 📈 PulseMarket — Real-Time Stock Market Analysis & Retail Dashboard

<br/>

![PulseMarket Banner](https://img.shields.io/badge/PulseMarket-Real--Time%20Analytics-00ff88?style=for-the-badge&logo=tradingview&logoColor=white)

<br/>

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--Time-ff3366?style=flat-square&logo=socketdotio&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![License](https://img.shields.io/badge/License-MIT-ffbb33?style=flat-square)](LICENSE)

<br/>

> **A sleek, dark-themed, real-time stock market analytics platform** combining live WebSocket price streaming,  
> interactive technical analysis charts, portfolio management, smart price alerts, and a retail sales dashboard —  
> all in one premium, modern web application.

<br/>

[🚀 Live Demo](#-quick-start) · [📸 Screenshots](#-screenshots) · [🛠️ Setup](#️-installation--setup) · [📖 Docs](#-features-in-detail)

</div>

---

<br/>

## ✨ Highlights

| 🔥 Feature | Description |
|:---|:---|
| **⚡ Real-Time Streaming** | Live stock prices via WebSocket with 10-second polling from Yahoo Finance |
| **📊 Interactive Charts** | Price charts, bar charts, pie charts, area charts powered by Recharts |
| **🤖 AI Trading Signals** | Bullish / Bearish / Neutral signals with technical reasoning |
| **📈 Technical Analysis** | RSI indicators, 20-day Moving Averages, price vs MA overlays |
| **💼 Portfolio Tracker** | Track holdings, P&L, allocation with live price updates |
| **🔔 Smart Alerts** | Set price, volume & RSI-based alerts with real-time monitoring |
| **🛒 Retail Sales Module** | Full CRUD sales management with analytics dashboard |
| **🌙 Premium Dark UI** | Glassmorphism cards, smooth animations, neon accent colors |
| **🌍 Multi-Market** | Supports both **US (NYSE/NASDAQ)** and **Indian (NSE)** markets |

<br/>

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)             │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │Dashboard │ │ Analysis │ │Portfolio │ │  Alerts   │  │
│  │  (Home)  │ │(Tech/AI) │ │ Tracker  │ │  System   │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬─────┘  │
│       │             │            │              │        │
│       └─────────────┴────────────┴──────────────┘        │
│                         │                                │
│              WebSocket + REST API Calls                  │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 BACKEND (FastAPI + Python)               │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  WebSocket   │  │  REST API    │  │  Yahoo Finance│  │
│  │  Broadcast   │  │  /api/sales  │  │  Data Fetcher │  │
│  │  /ws         │  │  /api/trades │  │  (yfinance)   │  │
│  └──────────────┘  │  /api/stock  │  └───────────────┘  │
│                    └──────────────┘                      │
└─────────────────────────────────────────────────────────┘
```

<br/>

---

## 🖼️ Screenshots

<div align="center">

### 📊 Dashboard — Live Market Feed + Sales Analytics
> Real-time stock ticker cards with live prices, KPI summary cards, revenue bar charts, product breakdown pie charts, and recent sales table.

### 📈 Technical Analysis — AI Trading Signals
> AI-powered bullish/bearish/neutral signals, 30-day price vs moving average area chart, and RSI oscillator with overbought/oversold zones.

### 💼 Portfolio Tracker
> Live portfolio valuation, P&L tracking per stock, allocation pie chart, and detailed holdings table with real-time price updates.

### 🔔 Alerts System
> Active alert monitoring, triggered alert history, price/volume/RSI-based conditions with live ticker prices.

### 🛒 Admin — Retail Sales Management
> Add new sales entries, sales performance bar charts, and complete transaction history with status tracking.

</div>

<br/>

---

## 🚀 Features in Detail

### 📡 Real-Time Market Data
- **WebSocket streaming** broadcasts live stock prices to all connected clients
- Tracks **9 major stocks**: `AAPL`, `TSLA`, `MSFT`, `GOOGL`, `RELIANCE.NS`, `TCS.NS`, `INFY.NS`, `HDFCBANK.NS`, `ZOMATO.NS`
- Automatic fallback to **demo data with simulated price fluctuations** when backend is unavailable
- Multi-currency support: **USD ($)** and **INR (₹)**

### 🤖 AI-Powered Trading Signals
- Real-time signal generation: **Bullish**, **Bearish**, **Neutral**
- Technical reasoning based on RSI breakouts, MACD crossovers, golden crosses, and support/resistance levels
- Color-coded signal cards with trend indicators

### 📊 Advanced Charting
- **Area Charts** — Price history with gradient fills
- **Line Charts** — RSI oscillator with overbought/oversold zones (70/30)
- **Bar Charts** — Revenue over time with multi-color bars
- **Pie Charts** — Product breakdown & portfolio allocation (donut style)
- All charts are **fully interactive** with custom-styled tooltips

### 💼 Portfolio Management
- Track **shares owned**, **average cost**, and **current live price**
- Automatic **P&L calculation** with percentage change
- **Allocation breakdown** via interactive donut chart
- Portfolio KPIs: Total Value, Total Invested, Total P&L

### 🔔 Smart Alerts Engine
- Set alerts based on **price thresholds**, **volume spikes**, and **RSI levels**
- Visual status indicators: Active (green pulse) / Triggered (amber)
- Real-time price comparison against alert conditions

### 🛒 Retail Sales Dashboard
- Full **CRUD operations** for sales records
- Sales performance tracking with **daily revenue aggregation**
- Product-level analytics and transaction history
- Immediate **local-first UI updates** with backend sync

### 📄 Individual Stock Pages
- **1-year historical price chart** with moving average overlay
- **Key statistics**: Market Cap, Volume, Day High/Low, 52-week range
- **Company description** and fundamental data
- Live price with bullish/bearish sentiment badge

<br/>

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|:---|:---|
| ⚛️ **React 18** | Component-based UI framework |
| 🔷 **TypeScript 5.2** | Type-safe development |
| ⚡ **Vite 5** | Lightning-fast build tool & HMR |
| 📊 **Recharts** | Interactive data visualization |
| 🧭 **React Router v6** | Client-side routing |
| 🎨 **Lucide React** | Beautiful icon library |
| 🌐 **WebSocket API** | Real-time data streaming |

### Backend
| Technology | Purpose |
|:---|:---|
| 🐍 **FastAPI** | High-performance async Python API |
| 📡 **WebSockets** | Real-time bidirectional communication |
| 📈 **yfinance** | Yahoo Finance market data |
| 🐼 **Pandas** | Data analysis & transformation |
| ✅ **Pydantic** | Data validation & serialization |
| 🦄 **Uvicorn** | ASGI server |

<br/>

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** ≥ 18.x & **npm** ≥ 9.x
- **Python** ≥ 3.9
- **Git**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Dharun-Navamani/Realtime-Stock-market-analysis.git
cd Realtime-Stock-market-analysis
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

> ✅ Backend runs at `http://localhost:8000`  
> 📡 WebSocket endpoint: `ws://localhost:8000/ws`

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

> ✅ Frontend runs at `http://localhost:5173`

### 4️⃣ Environment Variables (Optional)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
```

> 💡 If no environment variable is set, the app automatically connects to the deployed backend on Render or falls back to demo data.

<br/>

---

## 📁 Project Structure

```
Realtime-Stock-market-analysis/
│
├── 📂 backend/
│   ├── main.py              # FastAPI server, WebSocket handler, REST endpoints
│   ├── requirements.txt     # Python dependencies
│   └── Procfile              # Deployment configuration
│
├── 📂 frontend/
│   ├── index.html            # Entry HTML
│   ├── package.json          # Node.js dependencies & scripts
│   ├── vite.config.ts        # Vite configuration
│   └── 📂 src/
│       ├── App.tsx           # Root component, routing, WebSocket connection
│       ├── main.tsx          # React entry point
│       ├── index.css         # Global styles & design system
│       └── 📂 pages/
│           ├── Home.tsx      # Dashboard — KPIs, market feed, charts, sales table
│           ├── Analysis.tsx  # Technical analysis — AI signals, price/MA, RSI
│           ├── Portfolio.tsx # Portfolio tracker — holdings, P&L, allocation
│           ├── Alerts.tsx    # Alert management — price, volume, RSI alerts
│           ├── Admin.tsx     # Retail sales admin — CRUD, charts, history
│           ├── StockDetails.tsx  # Individual stock page — chart, stats, info
│           ├── Login.tsx     # Authentication page
│           └── Register.tsx  # Registration page
│
└── .gitignore
```

<br/>

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/` | Health check — returns status and available features |
| `WS` | `/ws` | WebSocket — streams real-time market data |
| `GET` | `/api/sales` | Fetch all retail sales records |
| `POST` | `/api/sales` | Create a new sales record |
| `GET` | `/api/trades` | Fetch all trade records |
| `POST` | `/api/trades` | Log a new trade (BUY/SELL) |
| `GET` | `/api/stock/{ticker}` | Detailed stock data — info, 1Y history, MA20, RSI |

<br/>

---

## 🎨 Design System

The UI follows a **premium dark theme** with carefully selected design tokens:

| Token | Value | Usage |
|:---|:---|:---|
| `--bg-dark` | Deep Navy | Main background |
| `--bg-panel` | Glass Dark | Card backgrounds with opacity |
| `--accent` | `#00ff88` (Neon Green) | Primary accent, success states |
| `--accent-secondary` | `#00d2ff` (Cyan) | Secondary accent, links |
| `--danger` | `#ff3366` (Hot Pink) | Error states, bearish signals |
| `--text-main` | Near White | Primary text |
| `--text-muted` | Soft Gray | Secondary / caption text |

**Design Features:**
- 🪟 **Glassmorphism** cards with backdrop blur
- ✨ **Smooth fade-in** page transitions
- 🌈 **Gradient buttons** with hover scale effects
- 💫 **Pulsing indicators** for live data status
- 📱 **Responsive grid layouts** that adapt to all screen sizes

<br/>

---

## 🚢 Deployment

### Backend (Render)
The backend is pre-configured for deployment on **Render** with the included `Procfile`:

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend (Vercel / Netlify / GitHub Pages)
```bash
cd frontend
npm run build
# Deploy the `dist/` folder to your preferred hosting
```

<br/>

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

<br/>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br/>

---

<div align="center">

### ⭐ If you found this project useful, please consider giving it a star!

<br/>

**Built with ❤️ by [Dharun Navamani](https://github.com/Dharun-Navamani)**

<br/>

![React](https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/-Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

</div>
