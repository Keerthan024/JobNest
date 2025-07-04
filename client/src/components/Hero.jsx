import React, { useContext, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { FiSearch, FiMapPin, FiArrowRight } from "react-icons/fi";
import { assets } from "../assets/assets.js";

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const [isFocused, setIsFocused] = useState(false);
  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    setIsSearched(true);
  };

  const companies = [
    { name: "Microsoft", logo: assets.microsoft_logo },
    { name: "Walmart", logo: assets.walmart_logo },
    { name: "Accenture", logo: assets.accenture_logo },
    { name: "Samsung", logo: assets.samsung_logo },
    { name: "Amazon", logo: assets.amazon_logo },
    { name: "Adobe", logo: assets.adobe_logo },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Main Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 to-purple-900 text-white"
      >
        {/* Animated Background Elements */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-10 px-6 py-16 sm:py-20 lg:py-28 xl:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Discover Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Dream Job
              </span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Join over 10,000+ professionals who found their perfect career
              match with us
            </motion.p>

            {/* Search Box */}
            <motion.div
              className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex flex-col sm:flex-row items-stretch">
                <div className="flex-1 flex items-center px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
                  <FiSearch className="text-gray-500 mr-3" size={20} />
                  <input
                    type="text"
                    ref={titleRef}
                    placeholder="Job title or keywords"
                    className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </div>

                <div className="flex-1 flex items-center px-4 py-3">
                  <FiMapPin className="text-gray-500 mr-3" size={20} />
                  <input
                    type="text"
                    ref={locationRef}
                    placeholder="Location"
                    className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </div>

                <motion.button
                  onClick={onSearch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 flex items-center justify-center"
                >
                  <span>Search</span>
                  <FiArrowRight className="ml-2" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Trusted Companies Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex flex-col items-center">
          <motion.p
            className="text-gray-500 mb-6 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Trusted by leading companies worldwide
          </motion.p>

          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 items-center">
            <AnimatePresence>
              {companies.map((company, index) => (
                <motion.div
                  key={company.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 1 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ y: -5 }}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-6 sm:h-8 object-contain"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
