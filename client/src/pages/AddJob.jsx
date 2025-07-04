import React, { useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { FiPlus, FiDollarSign, FiChevronDown } from "react-icons/fi";

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
  const { backendUrl, companyToken } = useContext(AppContext);

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
      ...prev,
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="max-w-4xl mx-auto p-6"
    >
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Post a New Job</h1>

      <form onSubmit={onSubmitHandler} className="space-y-6">
        {/* Job Title */}
        <motion.div whileHover={{ scale: 1.005 }} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <motion.input
            type="text"
            placeholder="e.g. Senior React Developer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            whileFocus="focus"
            variants={inputVariants}
          />
        </motion.div>

        {/* Job Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <motion.div
            whileHover={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)" }}
            className="border border-gray-300 rounded-lg overflow-hidden"
          >
            <div ref={editorRef} className="h-64"></div>
          </motion.div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Category */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Category
            </label>
            <motion.div whileHover={{ scale: 1.01 }} className="relative">
              <button
                type="button"
                onClick={() => toggleSelect("category")}
                className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-left"
              >
                <span>{category}</span>
                <FiChevronDown
                  className={`transition-transform ${
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
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg py-1"
                  >
                    {JobCategories.map((cat, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        className="px-4 py-2 cursor-pointer"
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
                className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-left"
              >
                <span>{location}</span>
                <FiChevronDown
                  className={`transition-transform ${
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
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg py-1"
                  >
                    {JobLocations.map((loc, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        className="px-4 py-2 cursor-pointer"
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
                className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-left"
              >
                <span>{level}</span>
                <FiChevronDown
                  className={`transition-transform ${
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
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg py-1"
                  >
                    {[
                      "Beginner level",
                      "Intermediate level",
                      "Senior level",
                    ].map((lvl, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        className="px-4 py-2 cursor-pointer"
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Salary (₹)
            </label>
            <motion.div whileHover={{ scale: 1.01 }} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-700">₹</span>
              </div>
              <input
                type="number"
                min="0"
                placeholder="e.g. 75000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </motion.div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow hover:shadow-md"
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
              <FiPlus />
              Post Job
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddJob;
