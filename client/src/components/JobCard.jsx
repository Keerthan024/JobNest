import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiBookmark, FiShare2 } from "react-icons/fi";

const JobCard = ({ job, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
      className="relative bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Header with Company Info */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 rounded-lg bg-white border border-gray-100 p-1 flex items-center justify-center shadow-sm"
            >
              <img
                src={job.companyId.image}
                alt={job.companyId.name}
                className="w-full h-full object-contain"
              />
            </motion.div>
            <div>
              <h4 className="font-medium text-lg text-gray-900">{job.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{job.companyId.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-blue-500 transition-colors">
              <FiBookmark size={18} />
            </button>
            <button className="text-gray-400 hover:text-blue-500 transition-colors">
              <FiShare2 size={18} />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600"
          >
            {job.location}
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600"
          >
            {job.level}
          </motion.span>
          {job.type && (
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600"
            >
              {job.type}
            </motion.span>
          )}
        </div>

        {/* Description (with gradient fade) */}
        <div className="relative mt-4">
          <div
            className="text-gray-600 text-sm line-clamp-3"
            dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent"></div>
        </div>
      </div>

      {/* Footer with CTA */}
      <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex justify-between items-center">
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            window.scrollTo(0, 0);
          }}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Learn more
          <FiArrowRight size={16} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            window.scrollTo(0, 0);
          }}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          Apply now
        </motion.button>
      </div>

      {/* Floating salary indicator if exists */}
      {job.salary && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 right-4 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm text-sm font-medium"
        >
          ₹{job.salary.toLocaleString()}
        </motion.div>
      )}
    </motion.div>
  );
};

export default JobCard;
