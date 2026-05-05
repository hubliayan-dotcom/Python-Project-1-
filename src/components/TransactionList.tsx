import React from 'react';
import { Transaction } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { expenseService } from '../services/expenseService';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await expenseService.deleteTransaction(id);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-bottom border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
        <span className="text-xs font-mono text-gray-500 uppercase">{transactions.length} total</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] font-semibold text-gray-500 uppercase tracking-widest border-b border-gray-100">
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3 text-right">Amount</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                  {format(new Date(tx.date), 'dd MMM')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      tx.type === 'income' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                    )}>
                      {tx.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{tx.description}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-full tracking-wider">
                    {tx.category}
                  </span>
                </td>
                <td className={cn(
                  "px-6 py-4 text-sm font-semibold text-right text-mono",
                  tx.type === 'income' ? "text-green-600" : "text-gray-900"
                )}>
                  {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(tx.id)}
                    className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No transactions yet. Add your first one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
