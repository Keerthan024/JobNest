import React, { useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { FiPlus, FiDollarSign, FiChevronDown, FiX } from "react-icons/fi";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner level");
  const [salary, setSalary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState({
    category: false,
    location: false,
    level: false,
  });

  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const formRef = useRef(null);
  const { backendUrl, companyToken } = useContext(AppContext);

  // Floating background elements
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [0, window.innerHeight], [10, -10]);
  const rotateY = useTransform(x, [0, window.innerWidth], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = formRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const description = quillRef.current.root.innerHTML;

      const { data } = await axios.post(
        `${backendUrl}/api/company/post-job`,
        { title, description, location, salary, category, level },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setSalary("");
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
          ],
        },
        placeholder: "Write detailed job description...",
      });
    }
  }, []);

  const toggleSelect = (field) => {
    setIsSelectOpen((prev) => ({
      category: false,
      location: false,
      level: false,
      [field]: !prev[field],
    }));
  };

  const selectOption = (field, value) => {
    if (field === "category") setCategory(value);
    if (field === "location") setLocation(value);
    if (field === "level") setLevel(value);
    setIsSelectOpen((prev) => ({ ...prev, [field]: false }));
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const inputVariants = {
    focus: {
      borderColor: "#3B82F6",
      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)",
      transition: { duration: 0.2 },
    },
  };

  const floatingBgVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Floating background elements */}
      <motion.div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        variants={floatingBgVariants}
        initial="initial"
        animate="animate"
      >
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-100 opacity-20 blur-xl"></div>
        <div className="absolute top-2/3 right-1/3 w-48 h-48 rounded-full bg-indigo-100 opacity-20 blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-purple-100 opacity-20 blur-xl"></div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="max-w-4xl mx-auto"
      >
        <motion.div 
          ref={formRef}
          onMouseMove={handleMouseMove}
          style={{
            perspective: 1000,
            rotateX,
            rotateY,
          }}
          className="relative bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 backdrop-blur-sm bg-opacity-90 border border-gray-100"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <motion.div 
              className="absolute bg-blue-500 rounded-full filter blur-3xl opacity-10"
              style={{
                x,
                y,
                width: 300,
                height: 300,
                left: -150,
                top: -150,
              }}
            />
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Post a New <span className="text-blue-600">Job</span>
              </h1>
              <motion.div 
                whileHover={{ rotate: 90 }}
                className="hidden sm:block w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center"
              >
                <FiPlus className="text-blue-500 text-xl" />
              </motion.div>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-6">
              {/* Job Title */}
              <motion.div 
                whileHover={{ scale: 1.005 }} 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <motion.input
                  type="text"
                  placeholder="e.g. Senior React Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                  whileFocus="focus"
                  variants={inputVariants}
                />
              </motion.div>

              {/* Job Description */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <label className="block text-sm font-medium text-gray-700">
                  Job Description
                </label>
                <motion.div
                  whileHover={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)" }}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                >
                  <div ref={editorRef} className="h-64"></div>
                </motion.div>
              </motion.div>

              {/* Job Details */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Job Category */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Category
                  </label>
                  <motion.div whileHover={{ scale: 1.01 }} className="relative">
                    <button
                      type="button"
                      onClick={() => toggleSelect("category")}
                      className="w-full flex justify-between items-center px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-left hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-800">{category}</span>
                      <FiChevronDown
                        className={`transition-transform text-gray-500 ${
                          isSelectOpen.category ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isSelectOpen.category && (
                        <motion.ul
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-60 overflow-auto"
                        >
                          {JobCategories.map((cat, index) => (
                            <motion.li
                              key={index}
                              whileHover={{ backgroundColor: "#f3f4f6" }}
                              className={`px-4 py-2 cursor-pointer transition-colors ${
                                category === cat ? "bg-blue-50 text-blue-600" : "text-gray-800"
                              }`}
                              onClick={() => selectOption("category", cat)}
                            >
                              {cat}
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Job Location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Location
                  </label>
                  <motion.div whileHover={{ scale: 1.01 }} className="relative">
                    <button
                      type="button"
                      onClick={() => toggleSelect("location")}
                      className="w-full flex justify-between items-center px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-left hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-800">{location}</span>
                      <FiChevronDown
                        className={`transition-transform text-gray-500 ${
                          isSelectOpen.location ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isSelectOpen.location && (
                        <motion.ul
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-60 overflow-auto"
                        >
                          {JobLocations.map((loc, index) => (
                            <motion.li
                              key={index}
                              whileHover={{ backgroundColor: "#f3f4f6" }}
                              className={`px-4 py-2 cursor-pointer transition-colors ${
                                location === loc ? "bg-blue-50 text-blue-600" : "text-gray-800"
                              }`}
                              onClick={() => selectOption("location", loc)}
                            >
                              {loc}
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Job Level */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Level
                  </label>
                  <motion.div whileHover={{ scale: 1.01 }} className="relative">
                    <button
                      type="button"
                      onClick={() => toggleSelect("level")}
                      className="w-full flex justify-between items-center px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-left hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-800">{level}</span>
                      <FiChevronDown
                        className={`transition-transform text-gray-500 ${
                          isSelectOpen.level ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isSelectOpen.level && (
                        <motion.ul
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1"
                        >
                          {[
                            "Beginner level",
                            "Intermediate level",
                            "Senior level",
                          ].map((lvl, index) => (
                            <motion.li
                              key={index}
                              whileHover={{ backgroundColor: "#f3f4f6" }}
                              className={`px-4 py-2 cursor-pointer transition-colors ${
                                level === lvl ? "bg-blue-50 text-blue-600" : "text-gray-800"
                              }`}
                              onClick={() => selectOption("level", lvl)}
                            >
                              {lvl}
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Job Salary */}
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.01 }}
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Salary (₹)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 75000"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="pt-4"
              >
                <motion.button
                  type="submit"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 5px 15px rgba(59, 130, 246, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className={`w-full px-8 py-4 rounded-xl font-medium flex items-center justify-center gap-2 ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Posting...
                    </>
                  ) : (
                    <>
                      <FiPlus className="text-lg" />
                      <span className="text-lg">Post Job</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddJob;