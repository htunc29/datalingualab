"use client";
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function StatisticCard({ title, value, percentChange, data, timeframe }) {
  const isPositive = percentChange >= 0;

  return (
    <div className="bg-white p-4 rounded-md w-full ">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-sm text-slate-700">{title} ({timeframe})</h4>
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '📈' : '📉'} {Math.abs(percentChange)}%
        </span>
      </div>

      <h2 className="text-2xl font-bold text-slate-800">{value}</h2>

      <div className="mt-2 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="value" stroke={isPositive ? "#22c55e" : "#ef4444"} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
