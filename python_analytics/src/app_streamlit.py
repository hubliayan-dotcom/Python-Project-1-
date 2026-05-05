import streamlit as st
import pandas as pd
import sqlite3
import os
import sys

# Add parent dir to path to import local modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.analyze import get_data, calculate_kpis, get_category_summary, get_monthly_trend, get_payment_method_distribution
from src.ingest import add_manual_transaction, ingest_csv

st.set_page_config(page_title="PrimeWealth Analytics", layout="wide")

st.title("🐍 Python Finance Analytics Dashboard")
st.markdown("---")

# Sidebar
with st.sidebar:
    st.header("Data Management")
    uploaded_file = st.file_uploader("Import CSV Statement", type="csv")
    if uploaded_file is not None:
        save_path = os.path.join("python_analytics/data", "uploaded.csv")
        with open(save_path, "wb") as f:
            f.write(uploaded_file.getbuffer())
        ingest_csv(save_path)
        st.success("CSV Imported!")

    st.divider()
    st.header("Manual Entry")
    with st.form("manual_tx"):
        d = st.date_input("Date")
        desc = st.text_input("Description")
        amt = st.number_input("Amount", step=1.0)
        t = st.selectbox("Type", ["expense", "income"])
        cat = st.selectbox("Category", ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Health", "Education", "Income", "Freelance", "Other"])
        pm = st.selectbox("Method", ["UPI", "Credit Card", "Bank Transfer", "Cash", "Debit Card"])
        
        if st.form_submit_button("Save Transaction"):
            add_manual_transaction(str(d), desc, amt if t == "income" else -amt, t, cat, pm)
            st.success("Saved!")

# Data Loading
df = get_data()

if df.empty:
    st.warning("No data found. Please upload a CSV or add a transaction in the sidebar.")
else:
    kpis = calculate_kpis(df)
    
    # KPI Row
    c1, c2, c3, c4, c5 = st.columns(5)
    c1.metric("Total Income", f"₹{kpis['Total Income']:,}")
    c2.metric("Total Expense", f"₹{kpis['Total Expense']:,}")
    c3.metric("Savings", f"₹{kpis['Savings']:,}")
    c4.metric("Daily Avg", f"₹{int(kpis['Avg Daily Spend'])}")
    c5.metric("Top Category", kpis['Top Category'])
    
    st.markdown("---")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Spending by Category")
        cat_sum = get_category_summary(df)
        st.bar_chart(cat_sum)
        
    with col2:
        st.subheader("Monthly Trend")
        trend = get_monthly_trend(df)
        st.line_chart(trend)
        
    col3, col4 = st.columns(2)
    
    with col3:
        st.subheader("Payment Distribution")
        dist = get_payment_method_distribution(df)
        st.write(dist) # Simple table, or use st.plotly_chart if available
        
    with col4:
        st.subheader("Recent Data")
        st.dataframe(df.sort_values('date', ascending=False).head(10), use_container_width=True)
