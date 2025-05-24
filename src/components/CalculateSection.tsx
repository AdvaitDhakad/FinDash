'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import mutualFundData from './mutual-fund.json';
import tickerData from './ticker.json';
import Worth from './Worth';

interface AssetForm {
  stocks: { 
    company: string; 
    ticker: string;    // Add ticker field
    quantity: number | null; 
    purchaseDate: string 
  }[];
  mutualFunds: { 
    fundHouse: string; 
    scheme: string;
    quantity: number | null; 
    purchaseNAV: number | null 
  }[];
  gold: { weight: number | null; quality: string };
  property: { location: string; size: number | null; type: string }[];
}

export default function CalculateSection() {
  const [formData, setFormData] = useState<AssetForm>({
    stocks: [{ company: '', ticker: '', quantity: null, purchaseDate: '' }],
    mutualFunds: [{ fundHouse: '', scheme: '', quantity: null, purchaseNAV: null }],
    gold: { weight: null, quality: '24K' },
    property: [{ location: '', size: null, type: 'Residential' }],
  });
  const [isWorthModalOpen, setIsWorthModalOpen] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }   
  };

  const addField = (field: keyof AssetForm) => {
    if (Array.isArray(formData[field])) {
      setFormData({
        ...formData,
        [field]: [...formData[field], field === 'stocks'
          ? { company: '', ticker: '', quantity: null, purchaseDate: '' }
          : field === 'mutualFunds'
          ? { fundHouse: '', scheme: '', quantity: null, purchaseNAV: null }
          : { location: '', size: null, type: 'Residential' }
        ],
      });
    }
  };

  const handleStockNewsClick = (company: string) => {
    if (company) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(company)}+stock+news`, '_blank');
    }
  };

  const selectClassName = "w-full bg-gray-800 text-white rounded-lg p-3 backdrop-blur-sm border border-gray-700 focus:border-green-500 focus:outline-none hover:bg-gray-700";

  return (
    <section id="calculate" className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white py-20 px-4 md:px-8">
      <motion.div initial="initial" animate="animate" className="max-w-7xl mx-auto">
        <motion.h2 {...fadeInUp} className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Calculate Your Net Worth
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stocks Card */}
          <motion.div {...fadeInUp} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/15 transition-all">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Stock Portfolio
            </h3>
            {formData.stocks.map((stock, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <select
                  className={selectClassName}
                  value={stock.company}
                  onChange={(e) => {
                    const selectedCompany = tickerData.Nifty50Companies.find(
                      company => company.name === e.target.value
                    );
                    const newStocks = [...formData.stocks];
                    newStocks[index].company = e.target.value;
                    newStocks[index].ticker = selectedCompany?.ticker || '';
                    setFormData({ ...formData, stocks: newStocks });
                  }}
                >
                  <option value="" className="bg-gray-800">Select Company</option>
                  {tickerData.Nifty50Companies.map((company, idx) => (
                    <option key={idx} value={company.name} className="bg-gray-800 hover:bg-green-500">
                      {company.name} ({company.ticker})
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    placeholder="Quantity"
                    className="w-full bg-black/20 rounded-lg p-3 backdrop-blur-sm"
                    value={stock.quantity ?? ''}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0) {
                        const newStocks = [...formData.stocks];
                        newStocks[index].quantity = value || null;
                        setFormData({ ...formData, stocks: newStocks });
                      }
                    }}
                  />
                  <div className="relative group">
                    <input
                      type="date"
                      className={`${selectClassName} [color-scheme:dark] w-full`}
                      value={stock.purchaseDate}
                      min="2000-01-01"
                      max={new Date().toISOString().split('T')[0]}
                      placeholder="Purchase Date"
                      onFocus={e => e.target.type = 'date'}
                      onBlur={e => {
                        if (!e.target.value) {
                          e.target.type = 'text';
                        }
                      }}
                      onChange={(e) => {
                        const newStocks = [...formData.stocks];
                        newStocks[index].purchaseDate = e.target.value;
                        setFormData({ ...formData, stocks: newStocks });
                      }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Purchase Date
                    </div>
                  </div>
                </div>

                {stock.company && (
                  <button
                    className="text-sm text-blue-400 hover:underline mt-2"
                    onClick={() => handleStockNewsClick(stock.company)}
                  >
                    View News
                  </button>
                )}
              </motion.div>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addField('stocks')}
              className="w-full mt-4 py-2 rounded-lg border border-green-500/50 text-green-500 hover:bg-green-500/10"
            >
              + Add Another Stock
            </motion.button>
          </motion.div>

          {/* Mutual Funds Card */}
          <motion.div 
            {...fadeInUp}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/15 transition-all"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mutual Funds
            </h3>
            <div className="space-y-4">
              {formData.mutualFunds.map((fund, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-3"
                >
                  <select
                    className={selectClassName}
                    value={fund.fundHouse}
                    onChange={(e) => {
                      const newFunds = [...formData.mutualFunds];
                      newFunds[index].fundHouse = e.target.value;
                      newFunds[index].scheme = '';
                      setFormData({ ...formData, mutualFunds: newFunds });
                    }}
                  >
                    <option value="" className="bg-gray-800">Select Fund House</option>
                    {mutualFundData.MutualFunds.map((mf, idx) => (
                      <option key={idx} value={mf.fundHouse} className="bg-gray-800">
                        {mf.fundHouse}
                      </option>
                    ))}
                  </select>

                  <select
                    className={`${selectClassName} ${!fund.fundHouse && 'opacity-50 cursor-not-allowed'}`}
                    value={fund.scheme}
                    disabled={!fund.fundHouse}
                    onChange={(e) => {
                      const newFunds = [...formData.mutualFunds];
                      newFunds[index].scheme = e.target.value;
                      setFormData({ ...formData, mutualFunds: newFunds });
                    }}
                  >
                    <option value="" className="bg-gray-800">Select Scheme</option>
                    {fund.fundHouse && 
                      mutualFundData.MutualFunds
                        .find(mf => mf.fundHouse === fund.fundHouse)
                        ?.schemes.map((scheme, idx) => (
                          <option key={idx} value={scheme} className="bg-gray-800">
                            {scheme}
                          </option>
                        ))
                    }
                  </select>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      min="0"
                      placeholder="Quantity"
                      className="bg-black/20 rounded-lg p-3 backdrop-blur-sm"
                      value={fund.quantity ?? ''}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 0) {
                          const newFunds = [...formData.mutualFunds];
                          newFunds[index].quantity = value || null;
                          setFormData({ ...formData, mutualFunds: newFunds });
                        }
                      }}
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Purchase NAV"
                      className="bg-black/20 rounded-lg p-3 backdrop-blur-sm"
                      value={fund.purchaseNAV ?? ''}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 0) {
                          const newFunds = [...formData.mutualFunds];
                          newFunds[index].purchaseNAV = value || null;
                          setFormData({ ...formData, mutualFunds: newFunds });
                        }
                      }}
                    />
                  </div>
                </motion.div>
              ))}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addField('mutualFunds')}
                className="w-full mt-4 py-2 rounded-lg border border-green-500/50 text-green-500 hover:bg-green-500/10"
              >
                + Add Another Mutual Fund
              </motion.button>
            </div>
          </motion.div>

          {/* Gold Card */}
          <motion.div 
            {...fadeInUp}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/15 transition-all"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Gold Assets
            </h3>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Weight (in grams)"
                    className="w-full bg-black/20 rounded-lg p-3 backdrop-blur-sm"
                    value={formData.gold.weight ?? ''}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0) {
                        setFormData({
                          ...formData,
                          gold: { ...formData.gold, weight: value || null }
                        });
                      }
                    }}
                  />
                  <select
                    className={selectClassName}
                    value={formData.gold.quality}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        gold: { ...formData.gold, quality: e.target.value }
                      });
                    }}
                  >
                    <option value="24K" className="bg-gray-800">24K</option>
                    <option value="22K" className="bg-gray-800">22K</option>
                    <option value="18K" className="bg-gray-800">18K</option>
                    <option value="14K" className="bg-gray-800">14K</option>
                  </select>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Property Card */}
          <motion.div 
            {...fadeInUp}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/15 transition-all relative"
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center mb-2"
                >
                  <svg className="w-8 h-8 text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </motion.div>
                <span className="text-xl font-semibold text-white/90">Under Development</span>
              </div>
            </div>

            {/* Existing content with reduced opacity */}
            <div className="opacity-50">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Property
              </h3>
              <div className="space-y-4">
                {formData.property.map((prop, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      placeholder="Location"
                      className="w-full bg-black/20 rounded-lg p-3 backdrop-blur-sm"
                      value={prop.location}
                      onChange={(e) => {
                        const newProperties = [...formData.property];
                        newProperties[index].location = e.target.value;
                        setFormData({ ...formData, property: newProperties });
                      }}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Size (in sqft)"
                        className="bg-black/20 rounded-lg p-3 backdrop-blur-sm"
                        value={prop.size ?? ''}
                        onChange={(e) => {
                          const newProperties = [...formData.property];
                          newProperties[index].size = e.target.value ? Number(e.target.value) : null;
                          setFormData({ ...formData, property: newProperties });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Type (e.g., Residential, Commercial)"
                        className="bg-black/20 rounded-lg p-3 backdrop-blur-sm"
                        value={prop.type}
                        onChange={(e) => {
                          const newProperties = [...formData.property];
                          newProperties[index].type = e.target.value;
                          setFormData({ ...formData, property: newProperties });
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addField('property')}
                  className="w-full mt-4 py-2 rounded-lg border border-green-500/50 text-green-500 hover:bg-green-500/10"
                >
                  + Add Another Property
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mx-auto mt-12 px-8 py-3 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center"
          onClick={() => setIsWorthModalOpen(true)}
        >
          Calculate Total Net Worth
        </motion.button>

        <Worth 
          isOpen={isWorthModalOpen}
          onClose={() => setIsWorthModalOpen(false)}
          formData={formData}
        />
      </motion.div>
    </section>
  );
}
