def auto_categorize(description, amount):
    rules = {
        'Food & Dining': ['swiggy', 'zomato', 'restaurant', 'cafe', 'coffee', 'dmart', 'grocery', 'blinkit'],
        'Transport': ['uber', 'ola', 'metro', 'petrol', 'fuel', 'diesel', 'bus', 'rapido'],
        'Bills': ['electric', 'water', 'wifi', 'broadband', 'mobile recharge', 'dth', 'airtel', 'jio'],
        'Shopping': ['amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'nykaa'],
        'Entertainment': ['netflix', 'prime', 'spotify', 'cinema', 'bookmyshow', 'hotstar'],
        'Health': ['pharmacy', 'doctor', 'hospital', 'medic', 'apollo'],
        'Education': ['udemy', 'coursera', 'books', 'course', 'tutorial'],
        'Income': ['salary', 'payout', 'refund', 'reimbursement', 'freelance'],
    }
    
    desc_lower = description.lower()
    
    for category, keywords in rules.items():
        if any(keyword in desc_lower for keyword in keywords):
            return category
    
    if amount > 0:
        return 'Income'
    
    return 'Uncategorized'
