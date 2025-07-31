'use client';

import React, { useState } from "react";

// Mock data for HSA balance and investments
const mockHsaData = {
  balance: 15420.50,
  contributions: 3650.00,
  withdrawals: 1240.75,
  growth: 8.5,
  monthlyChange: 234.20,
  cashFunds: 8230.25,
  investmentFunds: 7190.25
};

// Mock chart data for portfolio performance
const mockChartData = [
  { month: 'Jan', cash: 7500, investments: 6800, total: 14300 },
  { month: 'Feb', cash: 7800, investments: 6900, total: 14700 },
  { month: 'Mar', cash: 8000, investments: 7000, total: 15000 },
  { month: 'Apr', cash: 8200, investments: 7100, total: 15300 },
  { month: 'May', cash: 8100, investments: 7200, total: 15300 },
  { month: 'Jun', cash: 8150, investments: 7150, total: 15300 },
  { month: 'Jul', cash: 8230, investments: 7190, total: 15420 }
];

const mockInvestments = [
  {
    id: 1,
    name: "Vanguard Total Stock Market ETF",
    symbol: "VTI",
    shares: 45.2,
    currentPrice: 245.67,
    totalValue: 11104.28,
    change: 2.34,
    changePercent: 1.85
  },
  {
    id: 2,
    name: "Fidelity Health Care ETF",
    symbol: "FHLC",
    shares: 23.1,
    currentPrice: 89.45,
    totalValue: 2066.30,
    change: -0.67,
    changePercent: -0.74
  },
  {
    id: 3,
    name: "iShares Core S&P 500 ETF",
    symbol: "IVV",
    shares: 12.8,
    currentPrice: 456.78,
    totalValue: 5846.78,
    change: 3.21,
    changePercent: 2.15
  }
];

const mockSpendingHistory = [
  {
    id: 1,
    date: "2024-01-15",
    description: "LaserAway - Laser Hair Removal",
    amount: 299.00,
    category: "MedSpa"
  },
  {
    id: 2,
    date: "2024-01-10",
    description: "Smooth Synergy - Acupuncture Session",
    amount: 125.00,
    category: "Acupuncture"
  },
  {
    id: 3,
    date: "2024-01-05",
    description: "Zen Wellness - Therapeutic Massage",
    amount: 95.00,
    category: "Massage"
  },
  {
    id: 4,
    date: "2023-12-28",
    description: "LaserAway - Skin Treatment",
    amount: 199.00,
    category: "MedSpa"
  }
];

// Simple chart component
const PortfolioChart = ({ data }: { data: typeof mockChartData }) => {
  const maxValue = Math.max(...data.map(d => d.total));
  const minValue = Math.min(...data.map(d => d.total));
  const range = maxValue - minValue;
  
  // Add some padding to make the line more visible
  const padding = range * 0.1; // 10% padding
  const adjustedMinValue = minValue - padding;
  const adjustedRange = range + (padding * 2);
  
  // Calculate line points with better scaling
  const linePoints = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((point.total - adjustedMinValue) / adjustedRange) * 100;
    return { x, y };
  });
  
  // Adjust x coordinates to span the full width
  const adjustedLinePoints = linePoints.map((point, index) => {
    const barWidth = 100 / data.length;
    const x = (index * barWidth) + (barWidth / 2); // Center of each bar
    return { x, y: point.y };
  });
  
  // Create SVG path for the line
  const linePath = adjustedLinePoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');
  
  return (
    <div className="w-full h-32 mt-4 relative">
      {/* SVG overlay for the line */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }}>
        <path
          d={linePath}
          stroke="#1e40af"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Data points */}
        {adjustedLinePoints.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="#1e40af"
            stroke="white"
            strokeWidth="1"
          />
        ))}
      </svg>
      
      <div className="flex items-end justify-between h-full space-x-1">
        {data.map((point, index) => {
          const cashHeight = ((point.cash - adjustedMinValue) / adjustedRange) * 100;
          const investmentHeight = ((point.investments - adjustedMinValue) / adjustedRange) * 100;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full flex flex-col-reverse h-full">
                {/* Investment portion */}
                <div 
                  className="bg-blue-600 w-full rounded-t"
                  style={{ height: `${Math.max(0, investmentHeight)}%` }}
                />
                {/* Cash portion */}
                <div 
                  className="bg-blue-300 w-full"
                  style={{ height: `${Math.max(0, cashHeight - investmentHeight)}%` }}
                />
              </div>
              <div className="text-xs text-gray-600 mt-1">{point.month}</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-2 space-x-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-300 rounded mr-1"></div>
          <span>Cash</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-600 rounded mr-1"></div>
          <span>Investments</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-800 rounded mr-1"></div>
          <span>Total Portfolio</span>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');

  return (
    <div className="bg-blue-50 min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-4 text-center tracking-tight text-blue-900">
            HSA Investment Dashboard
          </h1>
          <p className="text-center text-blue-600 text-lg">
            Manage your health savings and investments in one place
          </p>
        </div>

        {/* HSA Balance Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Total HSA Balance</h2>
              <div className="text-4xl font-bold text-blue-800 mb-2">
                ${mockHsaData.balance.toLocaleString()}
              </div>
              <div className="flex items-center gap-4 text-sm mb-4">
                <span className={`flex items-center ${mockHsaData.monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  +${mockHsaData.monthlyChange} this month
                </span>
                <span className="text-blue-600">
                  {mockHsaData.growth}% annual growth
                </span>
              </div>
              
              {/* Portfolio Chart */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Portfolio Performance</h3>
                <PortfolioChart data={mockChartData} />
              </div>
            </div>
            
            <div className="mt-6 lg:mt-0 lg:ml-8">
              <div className="grid grid-cols-1 gap-4">
                {/* Cash Funds */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-blue-600 text-sm font-medium">Cash Funds</div>
                    <div className="w-3 h-3 bg-blue-300 rounded"></div>
                  </div>
                  <div className="text-blue-800 text-2xl font-bold">${mockHsaData.cashFunds.toLocaleString()}</div>
                  <div className="text-blue-600 text-sm">
                    {((mockHsaData.cashFunds / mockHsaData.balance) * 100).toFixed(1)}% of total
                  </div>
                </div>
                
                {/* Investment Funds */}
                <div className="bg-blue-100 rounded-xl p-4 border border-blue-300">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-blue-700 text-sm font-medium">Investment Funds</div>
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  </div>
                  <div className="text-blue-800 text-2xl font-bold">${mockHsaData.investmentFunds.toLocaleString()}</div>
                  <div className="text-blue-600 text-sm">
                    {((mockHsaData.investmentFunds / mockHsaData.balance) * 100).toFixed(1)}% of total
                  </div>
                </div>
                
                {/* Contributions vs Withdrawals */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="text-green-600 text-sm font-medium">Contributions</div>
                    <div className="text-green-800 text-xl font-bold">${mockHsaData.contributions.toLocaleString()}</div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <div className="text-red-600 text-sm font-medium">Withdrawals</div>
                    <div className="text-red-800 text-xl font-bold">${mockHsaData.withdrawals.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-lg border border-blue-100">
            {['1M', '3M', '6M', '1Y', 'ALL'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Investment Portfolio */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">Investment Portfolio</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition cursor-pointer">
                Trade
              </button>
            </div>
            
            <div className="space-y-4">
              {mockInvestments.map((investment) => (
                <div key={investment.id} className="border border-blue-100 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-blue-900">{investment.name}</h3>
                      <p className="text-sm text-blue-600">{investment.symbol}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-800">
                        ${investment.totalValue.toLocaleString()}
                      </div>
                      <div className={`text-sm font-medium ${
                        investment.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {investment.change >= 0 ? '+' : ''}{investment.change} ({investment.changePercent}%)
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{investment.shares} shares</span>
                    <span>${investment.currentPrice}/share</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spending History */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">Recent Spending</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {mockSpendingHistory.map((transaction) => (
                <div key={transaction.id} className="border border-blue-100 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900">{transaction.description}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                          {transaction.category}
                        </span>
                        <span className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">
                        -${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition text-center cursor-pointer">
              <div className="text-2xl mb-2">💰</div>
              <div className="font-semibold">Contribute</div>
              <div className="text-sm opacity-90">Add funds to HSA</div>
            </button>
            <button className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition text-center cursor-pointer">
              <div className="text-2xl mb-2">📈</div>
              <div className="font-semibold">Invest</div>
              <div className="text-sm opacity-90">Buy stocks/ETFs</div>
            </button>
            <button className="bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition text-center cursor-pointer">
              <div className="text-2xl mb-2">🏥</div>
              <div className="font-semibold">Pay Medical</div>
              <div className="text-sm opacity-90">Use HSA funds</div>
            </button>
            <button className="bg-orange-600 text-white p-4 rounded-xl hover:bg-orange-700 transition text-center cursor-pointer">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold">Reports</div>
              <div className="text-sm opacity-90">Tax documents</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 