'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

interface WorthResponse {
  success: boolean;
  totalWorth: number;
  timestamp: string;
  breakdown: {
    stocks: {
      total: number;
      details: {
        symbol: string;
        exchange: string;
        quantity: number;
        current_price: number;
        start_price: number;
        total_value: number;
        percent_change: number;
        trend: 'positive' | 'negative' | 'neutral';
        price_history: { date: string; price: number }[];
      }[];
    };
    gold: {
      total: number;
      details: {
        purity: number;
        weight_grams: number;
        price_per_gram: number;
        total_value_inr: number;
        last_updated: string;
      };
    };
  };
}

interface WorthProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
}

export default function Worth({ isOpen, onClose, formData }: WorthProps) {
  const [totalWorth, setTotalWorth] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<WorthResponse['breakdown'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      calculateWorth();
    }
  }, [isOpen]);

  const calculateWorth = async () => {
    console.log('Calculating worth with formData:', formData);
    try {
      const response = await fetch('http://localhost:8000/financial-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to calculate worth');
      }

      const data: WorthResponse = await response.json();
      
      if (data.success) {
        setTotalWorth(data.totalWorth);
        setBreakdown(data.breakdown);
      } else {
        throw new Error('Calculation failed');
      }
      
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const StockCard = ({ stock }: { stock: WorthResponse['breakdown']['stocks']['details'][0] }) => {
    return (
      <div className="bg-gray-800/30 rounded-xl p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-lg font-medium text-white">{stock.symbol}</h4>
            <span className="text-sm text-gray-400">{stock.exchange}</span>
          </div>
          <span className={`px-2 py-1 rounded text-sm ${
            stock.trend === 'positive' ? 'bg-green-500/20 text-green-400' :
            stock.trend === 'negative' ? 'bg-red-500/20 text-red-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {stock.percent_change > 0 ? '+' : ''}{stock.percent_change?.toFixed(2) ?? 0}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-400">
            Quantity: {stock.quantity?.toLocaleString() ?? 0}
          </div>
          <div className="text-gray-400">
            Price: ₹{stock.current_price?.toLocaleString() ?? 0}
          </div>
          <div className="text-gray-400">
            Start: ₹{stock.start_price?.toLocaleString() ?? 0}
          </div>
          <div className="text-gray-400">
            Change: ₹{((stock.current_price ?? 0) - (stock.start_price ?? 0)).toLocaleString()}
          </div>
          <div className="text-lg font-semibold text-white col-span-2">
            Value: ₹{stock.total_value?.toLocaleString() ?? 0}
          </div>
        </div>
      </div>
    );
  };

  const GoldCard = ({ gold }: { gold: WorthResponse['breakdown']['gold']['details'] }) => {
    return (
      <div className="bg-gray-800/30 rounded-xl p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium text-white">Gold Details</h4>
          <span className="text-sm text-gray-400">
            {new Date(gold.last_updated).toLocaleDateString()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-400">
            Weight: {gold.weight_grams}g
          </div>
          <div className="text-gray-400">
            Purity: {gold.purity}%
          </div>
          <div className="text-gray-400">
            Price/g: ₹{gold.price_per_gram.toLocaleString()}
          </div>
          <div className="text-lg font-semibold text-white col-span-2">
            Value: ₹{gold.total_value_inr.toLocaleString()}
          </div>
        </div>
      </div>
    );
  };

  // Update the modal container and content styles
  return (
    <>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
          <div className="fixed inset-5 flex items-center justify-center z-50">
            <div className="w-3/4 h-[90vh] bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-800 flex flex-col p-6 relative mx-auto overflow-hidden">
              <button onClick={onClose} className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 z-10">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex-none">
                <h2 className="text-4xl font-bold text-white text-center my-4">Total Worth</h2>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-thin hover:scrollbar scrollbar-thumb-gray-600/50 scrollbar-track-transparent">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full space-x-4">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white/80 rounded-full animate-spin" />
                    <span className="text-2xl text-white/80">Calculating...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-red-400 text-2xl text-center max-w-2xl">{error}</div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="text-6xl font-bold text-green-400 text-center">
                      ₹{totalWorth?.toLocaleString()}
                    </div>
                    
                    {breakdown && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-800/50 rounded-xl p-4">
                            <h3 className="text-gray-400 mb-2">Stocks</h3>
                            <p className="text-2xl font-semibold text-white">
                              ₹{breakdown.stocks.total.toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-gray-800/50 rounded-xl p-4">
                            <h3 className="text-gray-400 mb-2">Gold</h3>
                            <p className="text-2xl font-semibold text-white">
                              ₹{breakdown.gold.total.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Stocks Breakdown */}
                        {breakdown.stocks.details.length > 0 && (
                          <div>
                            <h3 className="text-xl text-gray-300 mb-4">Stocks Breakdown</h3>
                            <div className="grid grid-cols-2 gap-4">
                              {breakdown.stocks.details.map((stock, index) => (
                                <StockCard key={index} stock={stock} />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Gold Details */}
                        {breakdown.gold.details && (
                          <div>
                            <h3 className="text-xl text-gray-300 mb-4">Gold Details</h3>
                            <GoldCard gold={breakdown.gold.details} />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <p className="text-xl text-gray-400 text-center">Your Total Net Worth</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}