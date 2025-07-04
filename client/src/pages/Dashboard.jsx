import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import {
  FiPlus,
  FiHome,
  FiUsers,
  FiLogOut,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { companyData, setCompanyData, setCompanyToken } =
    useContext(AppContext);

    const [showLogout, setShowLogout] = useState(false);

  // Function to logout for company
  const logout = () => {
    setCompanyToken(null);
    localStorage.removeItem("companyToken");
    setCompanyData(null);
    navigate("/");
  };

  useEffect(() => {
    if (companyData) {
      navigate("/dashboard/manage-jobs");
    }
  }, [companyData]);

  const sidebarLinks = [
    {
      path: "/dashboard/add-job",
      icon: <FiPlus size={20} />,
      label: "Add Job",
    },
    {
      path: "/dashboard/manage-jobs",
      icon: <FiHome size={20} />,
      label: "Manage Jobs",
    },
    {
      path: "/dashboard/view-applications",
      icon: <FiUsers size={20} />,
      label: "View Applications",
    },
  ];

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.5,
      },
    },
  };

  const navItemVariants = {
    hover: {
      x: 5,
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 px-6 flex justify-between items-center sticky top-0 z-50"
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center gap-2"
        >
          <motion.img
            className="h-8"
            src={assets.logo}
            alt="Logo"
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          />
          <span className="hidden sm:inline-block text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {companyData.name}
          </span>
        </motion.div>

        {companyData && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 relative"
          >
            {/* Welcome message */}
            <motion.p
              className="hidden md:block text-gray-600 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Welcome back,{" "}
              <span className="font-medium text-gray-800">
                {companyData.name.split(" ")[0]}
              </span>
            </motion.p>

            {/* Profile image with logout */}
            <div className="relative">
              <motion.button
                onClick={() => setShowLogout(!showLogout)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="focus:outline-none"
              >
                <img
                  className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md"
                  src={companyData.image}
                  alt="Company logo"
                />
              </motion.button>

              <AnimatePresence>
                {showLogout && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200"
                  >
                    <motion.button
                      onClick={logout}
                      whileHover={{ backgroundColor: "#FEF2F2" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2 text-sm flex items-center gap-2 text-red-600 hover:bg-red-50"
                    >
                      <FiLogOut className="text-base" />
                      <span>Sign out</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </motion.nav>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <motion.div
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          className="w-full md:w-64 bg-white shadow-sm min-h-screen"
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 px-2">
              Dashboard
            </h3>

            <ul className="space-y-2">
              {sidebarLinks.map((link) => (
                <motion.li
                  key={link.path}
                  variants={navItemVariants}
                  whileHover="hover"
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                    <motion.span
                      animate={{
                        opacity: location.pathname === link.path ? 1 : 0,
                      }}
                      className="ml-auto"
                    >
                      <FiChevronRight />
                    </motion.span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.main
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 p-4 md:p-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </motion.div>
  );
};

export default Dashboard;
