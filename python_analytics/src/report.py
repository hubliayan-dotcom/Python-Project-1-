import os
from datetime import datetime

REPORT_DIR = 'python_analytics/reports'
os.makedirs(REPORT_DIR, exist_ok=True)

def generate_report(kpis, cat_summary):
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    report_path = f"{REPORT_DIR}/monthly_expense_report_{timestamp}.txt"
    
    with open(report_path, 'w') as f:
        f.write("=== MONTHLY EXPENSE REPORT ===\n")
        f.write(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        f.write("--- KEY METRICS ---\n")
        for key, val in kpis.items():
            f.write(f"{key}: ₹{val:,.2f}\n")
            
        f.write("\n--- CATEGORY BREAKDOWN ---\n")
        for cat, amt in cat_summary.items():
            f.write(f"{cat}: ₹{amt:,.2f}\n")
            
        f.write("\n--- END OF REPORT ---\n")
        
    print(f"Report generated at {report_path}")
    return report_path
