'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {!isScrolled ? (
        <header className="fixed top-0 w-full z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <Link href="/" className="text-2xl font-bold text-white">
                  FinDash
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-200">
                    Home
                  </Link>
                  <Link href="#calculate" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-200">
                    Calculate
                  </Link>
                  <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-200">
                    About
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </header>
      ) : (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 inset-x-0 mx-auto z-50 flex justify-center"
        >
          <motion.nav
            className="inline-flex px-8 py-3 rounded-full bg-white/10 backdrop-blur-md shadow-lg border border-white/20"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-8">
              <Link 
                href="/" 
                className="text-white/90 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                Home
              </Link>
              <div className="w-px h-4 bg-white/20" />
              <Link 
                href="#calculate" 
                className="text-white/90 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                Calculate
              </Link>
              <div className="w-px h-4 bg-white/20" />
              <Link 
                href="/about" 
                className="text-white/90 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                About
              </Link>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}