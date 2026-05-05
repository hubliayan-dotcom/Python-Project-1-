const CATEGORY_RULES: Record<string, string[]> = {
  'Food & Dining': ['swiggy', 'zomato', 'restaurant', 'cafe', 'coffee', 'dmart', 'grocery', 'blinkit'],
  'Transport': ['uber', 'ola', 'metro', 'petrol', 'fuel', 'diesel', 'bus', 'rapido'],
  'Bills': ['electric', 'water', 'wifi', 'broadband', 'mobile recharge', 'dth', 'airtel', 'jio'],
  'Shopping': ['amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'nykaa'],
  'Entertainment': ['netflix', 'prime', 'spotify', 'cinema', 'bookmyshow', 'hotstar'],
  'Health': ['pharmacy', 'doctor', 'hospital', 'medic', 'apollo'],
  'Education': ['udemy', 'coursera', 'books', 'course', 'tutorial'],
  'Income': ['salary', 'payout', 'refund', 'reimbursement', 'freelance'],
};

export function autoCategorize(description: string, amount: number): string {
  const descLower = description.toLowerCase();
  
  // Check specific rules first (including income sub-types like Salary)
  for (const [category, rules] of Object.entries(CATEGORY_RULES)) {
    if (rules.some(rule => descLower.includes(rule))) {
      return category;
    }
  }
  
  if (amount > 0) return 'Income';
  return 'Uncategorized';
}
