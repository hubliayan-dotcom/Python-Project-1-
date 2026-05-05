import matplotlib.pyplot as plt
import seaborn as sns
import os

OUTPUT_DIR = 'python_analytics/outputs'
os.makedirs(OUTPUT_DIR, exist_ok=True)

def plot_all(df, cat_sum, msg_trend, pay_dist):
    sns.set_theme(style="whitegrid")
    
    # 1. Category wise spending
    plt.figure(figsize=(10, 6))
    cat_sum.plot(kind='bar', color='skyblue')
    plt.title('Spending by Category')
    plt.ylabel('Amount (₹)')
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/category_wise_spending.png')
    plt.close()

    # 2. Monthly spending trend
    plt.figure(figsize=(10, 6))
    msg_trend.plot(kind='line', marker='o', color='coral')
    plt.title('Monthly Spending Trend')
    plt.ylabel('Amount (₹)')
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/monthly_spending_trend.png')
    plt.close()

    # 3. Payment method distribution
    plt.figure(figsize=(8, 8))
    pay_dist.plot(kind='pie', autopct='%1.1f%%', colors=sns.color_palette('pastel'))
    plt.title('Payment Method Distribution')
    plt.ylabel('')
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/payment_method_distribution.png')
    plt.close()

    # 4. Daily spending trend
    daily_spend = df[df['type'] == 'expense'].groupby('date')['amount'].sum().abs()
    plt.figure(figsize=(12, 6))
    daily_spend.plot(kind='area', alpha=0.4, color='green')
    plt.title('Daily Spending Trend')
    plt.ylabel('Amount (₹)')
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/daily_trend.png')
    plt.close()

    print(f"All charts saved to {OUTPUT_DIR}/")
