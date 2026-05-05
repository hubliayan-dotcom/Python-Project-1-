import sqlite3
import pandas as pd
import os
import sys

# Ensure we can import categorize
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
try:
    from categorize import auto_categorize
except ImportError:
    # Handle if run from different dir
    from src.categorize import auto_categorize

DB_PATH = 'python_analytics/db/expenses.db'

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            description TEXT,
            amount REAL,
            type TEXT,
            category TEXT,
            payment_method TEXT
        );
        CREATE TABLE IF NOT EXISTS budgets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            month TEXT,
            category TEXT,
            limit_amount REAL
        );
    """)
    conn.commit()
    conn.close()

def ingest_csv(file_path):
    df = pd.read_csv(file_path)
    
    # Simple cleaning and auto-categorization if needed
    if 'category' not in df.columns or df['category'].isnull().any():
        df['category'] = df.apply(lambda row: auto_categorize(row['description'], row['amount']), axis=1)
    
    if 'type' not in df.columns:
        df['type'] = df['amount'].apply(lambda x: 'income' if x > 0 else 'expense')
    
    conn = sqlite3.connect(DB_PATH)
    df.to_sql('transactions', conn, if_exists='append', index=False)
    conn.close()
    print(f"Successfully ingested {len(df)} transactions from {file_path}")

def add_manual_transaction(date, description, amount, tx_type, category, payment_method):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO transactions (date, description, amount, type, category, payment_method)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (date, description, amount, tx_type, category, payment_method))
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    ingest_csv('python_analytics/data/sample_transactions.csv')
