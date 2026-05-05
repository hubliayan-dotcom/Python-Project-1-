# 💸 PrimeWealth — Full-Stack Personal Finance Analytics System (React + Python + Streamlit)

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Preview-brightgreen?style=for-the-badge&logo=google-cloud)](https://ais-pre-2wihy3e6gigne7t6ylcris-50948685477.asia-southeast1.run.app)
[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange?logo=firebase)](https://firebase.google.com/)
[![Python](https://img.shields.io/badge/Python-Analytics-3776AB?logo=python)](https://www.python.org/)

## ⚡ TL;DR
- Built a full-stack personal finance analytics system (React + Firebase + Python)
- Implemented real-time transaction tracking with secure multi-user architecture
- Designed a Python ETL pipeline (CSV → SQLite → Pandas → Visualization)
- Generated financial insights (KPIs, trends, category analysis, savings rate)
- Deployed interactive dashboards (React + Streamlit) with automated reporting

---

## 📸 Demo Preview

### 1. Dashboard Overview
![Dashboard](images/01_dashboard_overview.png)

### 2. Spending Analysis
![Spending](images/02_spending_analysis.png)

### 3. Transaction Entry & CSV Import
![Transactions](images/03_transaction_entry_import.png)

### 4. Historical Ledger
![Ledger](images/04_transaction_ledger.png)

---

## 💡 Business Impact

- **Optimized Spending**: Enables users to track and optimize spending behavior in real-time.
- **Improved Budgeting**: Identifies high-spending categories for better informed financial decisions.
- **Automation**: Automates expense categorization, reducing manual effort and human error.
- **Actionable Insights**: Provides clear, data-driven financial insights via visual analytics.
- **Easy Migration**: Supports seamless migration from bank statements using robust CSV ingestion.

---

## 🔄 End-to-End Workflow

1. **Ingestion**: User uploads CSV or enters transaction manually via React or Streamlit.
2. **Processing**: Data is cleaned and standardized using Pandas.
3. **Storage**: Persisted in SQLite database (analytics layer) and Firestore (live layer).
4. **Logic**: Categorization logic applied via a modular rule-based engine.
5. **Computation**: Aggregations computed (monthly, category-wise, KPIs).
6. **Visualization**: Professional charts generated via Matplotlib/Seaborn and Recharts.
7. **Discovery**: Insights displayed via interactive Streamlit and React dashboards.
8. **Export**: Monthly reports exported as CSV or Text for external archiving.

---

## 🧩 Challenges & Solutions

- **Challenge**: Handling inconsistent CSV formats from different banks.
  - **Solution**: Built a flexible ingestion pipeline with dynamic column mapping and fallback logic.
- **Challenge**: Accurately auto-categorizing diverse transaction descriptions.
  - **Solution**: Implemented a keyword-based classification engine with support for custom user rules.
- **Challenge**: Maintaining performance between real-time updates and heavy batch analytics.
  - **Solution**: Designed a dual-layer architecture separating Firebase (live) and Python/SQLite (analytical).
- **Challenge**: Ensuring secure multi-user data isolation.
  - **Solution**: Applied rigorous Firebase authentication paired with granular zero-trust security rules.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Tailwind CSS 4.0, Lucide Icons, Framer Motion
- **Backend**: Firebase (Auth + Firestore)
- **Analytics**: Python 3.11, Pandas, NumPy
- **Database**: SQLite (Analytics), Firestore (Real-time)
- **Visualization**: Recharts (Web), Matplotlib, Seaborn (Python)
- **Dashboard**: Streamlit (Internal BI)

---

## 🏗 Directory Structure

```
/src                     # React Frontend Source
/python_analytics        # Python Analytics Pipeline
  ├── data/              # CSV Storage
  ├── db/                # SQLite Database (expenses.db)
  ├── outputs/           # Generated Charts (PNG)
  ├── reports/           # Monthly Text/CSV Reports
  ├── src/               # Python Modules (Analyze, Ingest, etc.)
  └── main.py            # Pipeline Entry Point
/images                  # Documentation Assets
```

---

## 🔮 Future Improvements

- **AI Categorization**: Implement NLP-based transaction categorization using Gemini API.
- **Smart Alerts**: Budget threshold notifications and anomaly detection.
- **Mobile Support**: Expand UI with React Native for cross-platform availability.
- **Banking APIs**: Direct integration with Plaid or Salt Edge for automatic sync.

---

## 💬 Interview Ready

**Q: Explain your project**
> "PrimeWealth is a dual-layer personal finance system combining a real-time React application with a Python analytics pipeline. The frontend handles transaction management and immediate visualization, while the backend pipeline performs deep-dive analysis, SQLite storage, and automated report generation. The system provides actionable insights like spending trends and savings rates, presenting them through modern, interactive dashboards."

---

## 📄 License
SPDX-License-Identifier: Apache-2.0

Developed for the Google AI Studio Build Challenge.
