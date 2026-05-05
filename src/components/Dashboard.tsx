import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { ArrowDownRight, ArrowUpRight, Wallet, Target, CreditCard, PieChart as PieChartIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface DashboardProps {
  transactions: Transaction[];
}

const COLORS = ['#0F172A', '#334155', '#475569', '#64748B', '#94A3B8', '#CBD5E1'];

export default function Dashboard({ transactions }: DashboardProps) {
  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return transactions.filter(tx => isWithinInterval(new Date(tx.date), { start, end }));
  }, [transactions]);

  const stats = useMemo(() => {
    const income = currentMonthTransactions
      .filter(tx => tx.type === 'income')
      .reduce((acc, tx) => acc + tx.amount, 0);
    const expenses = currentMonthTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((acc, tx) => acc + Math.abs(tx.amount), 0);
    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    return { income, expenses, savings, savingsRate };
  }, [currentMonthTransactions]);

  const categoryData = useMemo(() => {
    const groups: Record<string, number> = {};
    currentMonthTransactions
      .filter(tx => tx.type === 'expense')
      .forEach(tx => {
        groups[tx.category] = (groups[tx.category] || 0) + Math.abs(tx.amount);
      });

    return Object.entries(groups)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [currentMonthTransactions]);

  const paymentData = useMemo(() => {
    const groups: Record<string, number> = {};
    currentMonthTransactions
      .filter(tx => tx.type === 'expense')
      .forEach(tx => {
        const method = tx.paymentMethod || 'Other';
        groups[method] = (groups[method] || 0) + Math.abs(tx.amount);
      });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [currentMonthTransactions]);

  const trendData = useMemo(() => {
    const groups: Record<string, { income: number; expense: number }> = {};
    const days = 14; // Show last 14 days for clarity
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = format(d, 'dd MMM');
      groups[dateStr] = { income: 0, expense: 0 };
    }

    transactions.forEach(tx => {
      const dateStr = format(new Date(tx.date), 'dd MMM');
      if (groups[dateStr] !== undefined) {
        if (tx.type === 'income') groups[dateStr].income += tx.amount;
        else groups[dateStr].expense += Math.abs(tx.amount);
      }
    });

    return Object.entries(groups).map(([name, data]) => ({ name, ...data }));
  }, [transactions]);

  const incomeExpenseData = [
    { name: 'Income', value: stats.income, color: '#10B981' },
    { name: 'Expenses', value: stats.expenses, color: '#F97316' }
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Monthly Income" 
          value={formatCurrency(stats.income)} 
          subValue="Current Month"
          icon={<TrendUpIcon />}
          color="green"
        />
        <StatCard 
          title="Monthly Spending" 
          value={formatCurrency(stats.expenses)} 
          subValue="Current Month"
          icon={<TrendDownIcon />}
          color="orange"
        />
        <StatCard 
          title="Total Savings" 
          value={formatCurrency(stats.savings)} 
          subValue={`${stats.savingsRate.toFixed(1)}% Rate`}
          icon={<Wallet className="w-5 h-5" />}
          color="blue"
        />
        <StatCard 
          title="Top Category" 
          value={categoryData[0]?.name || 'N/A'} 
          subValue={categoryData[0] ? formatCurrency(categoryData[0].value) : '0'}
          icon={<Target className="w-5 h-5" />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Comparison Chart */}
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm lg:col-span-1">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4" /> Comparison
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeExpenseData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'transparent' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: number) => formatCurrency(val)}
                />
                <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={40}>
                  {incomeExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm lg:col-span-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Financial Flow (Last 14 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  interval={1}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 600 }} />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  name="Income"
                  stroke="#10B981" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }} 
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  name="Expense"
                  stroke="#F97316" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#F97316', strokeWidth: 0 }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm lg:col-span-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Spending Concentration</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  width={100}
                  tick={{ fontSize: 11, fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: number) => formatCurrency(val)}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Stats */}
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm lg:col-span-1">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Payment Methods
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: number) => formatCurrency(val)}
                />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendUpIcon() {
  return (
    <div className="bg-green-100 p-1 rounded-lg">
      <ArrowUpRight className="w-4 h-4 text-green-600" />
    </div>
  );
}

function TrendDownIcon() {
  return (
    <div className="bg-orange-100 p-1 rounded-lg">
      <ArrowDownRight className="w-4 h-4 text-orange-600" />
    </div>
  );
}

function StatCard({ title, value, subValue, icon, color }: { 
  title: string; 
  value: string; 
  subValue: string; 
  icon: React.ReactNode;
  color: 'orange' | 'green' | 'blue' | 'purple';
}) {
  const colors = {
    orange: "border-orange-100",
    green: "border-green-100",
    blue: "border-blue-100",
    purple: "border-purple-100",
  };

  return (
    <div className={cn("p-6 bg-white border border-gray-200 rounded-2xl shadow-sm transition-all hover:shadow-md", colors[color])}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 rounded-xl">
          {icon}
        </div>
      </div>
      <div>
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">{title}</h4>
        <div className="text-2xl font-bold text-gray-900 tracking-tight">{value}</div>
        <div className="mt-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">{subValue}</div>
      </div>
    </div>
  );
}
