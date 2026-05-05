from src.ingest import init_db, ingest_csv, DB_PATH
from src.analyze import get_data, calculate_kpis, get_category_summary, get_monthly_trend, get_payment_method_distribution
from src.visualize import plot_all
from src.report import generate_report
import os

def run_pipeline():
    print("🚀 Starting Python Analytics Pipeline...")
    
    # 1. Init DB
    init_db()
    
    # 2. Ingest Sample Data if DB empty
    if os.path.exists(DB_PATH):
        import sqlite3
        conn = sqlite3.connect(DB_PATH)
        count = conn.execute("SELECT count(*) FROM transactions").fetchone()[0]
        conn.close()
        if count == 0:
            ingest_csv('python_analytics/data/sample_transactions.csv')
    
    # 3. Analyze
    df = get_data()
    if df.empty:
        print("❌ No data found to analyze.")
        return

    kpis = calculate_kpis(df)
    cat_summary = get_category_summary(df)
    msg_trend = get_monthly_trend(df)
    pay_dist = get_payment_method_distribution(df)
    
    # 4. Visualize
    plot_all(df, cat_summary, msg_trend, pay_dist)
    
    # 5. Report
    generate_report(kpis, cat_summary)
    
    print("✅ Pipeline Completed Successfully!")

if __name__ == "__main__":
    run_pipeline()
