import React, { useContext, useEffect } from "react";
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
} from "react-icons/fi";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { companyData, setCompanyData, setCompanyToken } =
    useContext(AppContext);

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
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-10"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="cursor-pointer"
        >
          <img className="h-8" src={assets.logo} alt="Logo" />
        </motion.div>

        {companyData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4"
          >
            <p className="hidden md:block text-gray-700">
              Welcome, <span className="font-medium">{companyData.name}</span>
            </p>

            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <img
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                  src={companyData.image}
                  alt="Company logo"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
              >
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>

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
