import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { expenseService } from '../services/expenseService';
import { autoCategorize } from '../lib/categorizer';
import { FileUp, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function CSVUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ count: number; error?: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          let count = 0;
          for (const row of results.data as any[]) {
            const description = row.description || row.Description || row.memo;
            const amount = parseFloat(row.amount || row.Amount || row.value);
            const dateStr = row.date || row.Date || row.time;

            if (description && !isNaN(amount) && dateStr) {
              const category = autoCategorize(description, amount);
              await expenseService.addTransaction({
                date: new Date(dateStr).toISOString(),
                description,
                amount,
                category,
                type: amount > 0 ? 'income' : 'expense',
                account: 'Imported',
                paymentMethod: 'Other'
              });
              count++;
            }
          }
          setResult({ count });
        } catch (err) {
          setResult({ count: 0, error: 'Failed to process some rows' });
        } finally {
          setIsProcessing(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      },
      error: (err) => {
        setResult({ count: 0, error: err.message });
        setIsProcessing(false);
      }
    });
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 bg-gray-50 rounded-full">
          {isProcessing ? (
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          ) : result?.error ? (
            <AlertCircle className="w-8 h-8 text-red-500" />
          ) : result ? (
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          ) : (
            <FileUp className="w-8 h-8 text-gray-400" />
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Import Transactions</h3>
          <p className="mt-1 text-xs text-gray-500 max-w-[200px]">
            Upload a CSV with 'date', 'description', and 'amount' columns.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className={cn(
            "w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all",
            "border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2",
            isProcessing && "opacity-50 cursor-not-allowed"
          )}
        >
          {isProcessing ? "Processing..." : "Select File"}
        </button>
        
        {result && (
          <div className={cn(
            "text-[11px] font-bold uppercase tracking-wider",
            result.error ? "text-red-500" : "text-green-600"
          )}>
            {result.error || `Successfully imported ${result.count} rows`}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
