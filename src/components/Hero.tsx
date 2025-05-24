'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const quote = "Invest in your future, one calculation at a time.";
const colors = ["#00f7ff", "#00e6a8", "#ffaa00", "#ff4f81"];

const generateLineData = () =>
  Array.from({ length: 10 }).map((_, i) => ({ x: i, y: Math.random() * 100 }));

const generateBarData = () =>
  Array.from({ length: 6 }).map((_, i) => ({ name: `Cat ${i + 1}`, value: Math.random() * 100 }));

const generatePieData = () =>
  Array.from({ length: 4 }).map((_, i) => ({ name: `Seg ${i + 1}`, value: Math.random() * 100 }));

export default function Hero() {
  const [displayedQuote, setDisplayedQuote] = useState("");
  const [lineData, setLineData] = useState(generateLineData());
  const [barData, setBarData] = useState(generateBarData());
  const [pieData, setPieData] = useState(generatePieData());

  // Initialize useEffect only after state is defined
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDisplayedQuote(""); // Reset the quote when component mounts
      let currentIndex = 0;
      
      const typewriterInterval = setInterval(() => {
        if (currentIndex < quote.length) {
          setDisplayedQuote(quote.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typewriterInterval);
        }
      }, 50);

      return () => clearInterval(typewriterInterval);
    }
  }, []);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setLineData(generateLineData());
      setBarData(generateBarData());
      setPieData(generatePieData());
    }, 3000);

    return () => clearInterval(updateInterval);
  }, []);

  const scrollToCalculate = () => {
    const calculateSection = document.getElementById('calculate');
    calculateSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const chartTypes = ['line', 'bar', 'pie'];
  const getChart = (type: string, key: number) => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={lineData}>
              <XAxis dataKey="x" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="y" stroke="#00f7ff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#ffaa00" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={40}
                fill="#8884d8"
              >
                {pieData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-4 opacity-30 p-4">
        {Array.from({ length: 12 }).map((_, idx) => {
          const chartType = chartTypes[idx % chartTypes.length];
          return (
            <motion.div
              key={`chart-${idx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: idx * 0.1 }}
            >
              {getChart(chartType, idx)}
            </motion.div>
          );
        })}
      </div>

      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-60 px-6 text-center">
        <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-semibold max-w-4xl mb-6">
          {displayedQuote}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          >
            |
          </motion.span>
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToCalculate}
          className="relative inline-flex items-center px-8 py-3 overflow-hidden text-lg font-medium text-white border-2 border-cyan-500 rounded-full group hover:bg-cyan-500"
        >
          <span className="relative">Calculate Now</span>
          <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </span>
        </motion.button>
      </div>
    </div>
  );
}