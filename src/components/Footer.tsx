"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Github, Instagram, Linkedin } from "iconoir-react";
import { useState, useEffect } from "react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show footer after scrolling down 100px
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: <Linkedin />,
      url: "https://www.linkedin.com/in/advait-dhakad-0a29681a0/",
    },
    {
      name: "Instagram",
      icon: <Instagram />,
      url: "https://www.instagram.com/advait.dhakad/",
    },
    {
      name: "GitHub",
      icon: <Github />,
      url: "https://github.com/AdvaitDhakad",
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.footer
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 w-full bg-gray-900/80 backdrop-blur-md border-t border-gray-800"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>

              {/* Copyright */}
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Advait Dhakad
              </p>
            </div>
          </div>
        </motion.footer>
      )}
    </AnimatePresence>
  );
};

export default Footer;