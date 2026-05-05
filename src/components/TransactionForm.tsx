import React, { useState } from 'react';
import { expenseService } from '../services/expenseService';
import { autoCategorize } from '../lib/categorizer';
import { TransactionType } from '../types';
import { Plus, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function TransactionForm() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    setLoading(true);
    try {
      const numAmount = parseFloat(amount);
      const category = autoCategorize(description, type === 'income' ? numAmount : -numAmount);
      
      await expenseService.addTransaction({
        date: new Date().toISOString(),
        description,
        amount: type === 'income' ? numAmount : -numAmount,
        category,
        type,
        account: 'Primary',
        paymentMethod: 'UPI'
      });

      setDescription('');
      setAmount('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
            type === 'expense' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          )}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
            type === 'income' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          )}
        >
          Income
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Swiggy Order, Salary"
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-xl font-medium"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Add Transaction
          </>
        )}
      </button>
    </form>
  );
}
