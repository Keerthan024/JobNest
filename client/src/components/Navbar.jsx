import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FiMenu, FiX, FiUser, FiBriefcase } from "react-icons/fi";
import { assets } from "../assets/assets.js";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { setShowRecruiterLogin } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const menuVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
    closed: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm"
    >
      <div className="container mx-auto px-4 2xl:px-20 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="cursor-pointer"
          >
            <img src={assets.logo} alt="Logo" className="h-8" />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-4"
                >
                  <Link
                    to="/applications"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <FiBriefcase className="text-lg" />
                    <span>Applied Jobs</span>
                  </Link>

                  <div className="h-6 w-px bg-gray-200"></div>

                  <div className="flex items-center gap-2">
                    <FiUser className="text-gray-500" />
                    <span className="text-gray-700">Hi, {user.firstName}</span>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "h-8 w-8",
                          userButtonPopoverCard: "shadow-lg rounded-xl",
                        },
                      }}
                    />
                  </motion.div>
                </motion.div>
              </>
            ) : (
              <motion.div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => setShowRecruiterLogin(true)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  For Employers
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => openSignIn()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full shadow hover:shadow-md transition-all"
                >
                  Sign In
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden fixed inset-0 bg-white z-40 pt-20 px-6"
          >
            <div className="flex flex-col gap-8">
              {user ? (
                <>
                  <motion.div variants={itemVariants}>
                    <Link
                      to="/applications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-xl text-gray-800 py-3"
                    >
                      <FiBriefcase />
                      Applied Jobs
                    </Link>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-3 text-xl text-gray-800 py-3"
                  >
                    <FiUser />
                    <span>Hi, {user.firstName}</span>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-3 text-xl text-gray-800 py-3"
                  >
                    <UserButton afterSignOutUrl="/" />
                    <span>Account</span>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.button
                    variants={itemVariants}
                    onClick={(e) => {
                      setShowRecruiterLogin(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-xl text-gray-800 py-3 text-left"
                  >
                    <FiBriefcase />
                    For Employers
                  </motion.button>

                  <motion.button
                    variants={itemVariants}
                    onClick={(e) => {
                      openSignIn();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full text-xl font-medium mt-4"
                  >
                    Sign In
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
