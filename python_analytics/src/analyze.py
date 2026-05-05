import sqlite3
import pandas as pd

DB_PATH = 'python_analytics/db/expenses.db'

def get_data():
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql_query("SELECT * FROM transactions", conn)
    conn.close()
    df['date'] = pd.to_datetime(df['date'])
    return df

def calculate_kpis(df):
    income = df[df['type'] == 'income']['amount'].sum()
    expense = abs(df[df['type'] == 'expense']['amount'].sum())
    savings = income - expense
    
    # Highest spending category
    cat_spend = df[df['type'] == 'expense'].groupby('category')['amount'].sum().abs()
    top_cat = cat_spend.idxmax() if not cat_spend.empty else "N/A"
    
    # Avg daily spend
    days = (df['date'].max() - df['date'].min()).days + 1
    avg_daily = expense / days if days > 0 else 0

    return {
        "Total Income": income,
        "Total Expense": expense,
        "Savings": savings,
        "Top Category": top_cat,
        "Avg Daily Spend": avg_daily
    }

def get_category_summary(df):
    return df[df['type'] == 'expense'].groupby('category')['amount'].apply(lambda x: abs(x.sum())).sort_values(ascending=False)

def get_monthly_trend(df):
    return df[df['type'] == 'expense'].resample('M', on='date')['amount'].apply(lambda x: abs(x.sum()))

def get_payment_method_distribution(df):
    return df[df['type'] == 'expense'].groupby('payment_method')['amount'].apply(lambda x: abs(x.sum()))
