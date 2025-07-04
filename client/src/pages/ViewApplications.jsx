import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import moment from 'moment'
import {
  FiDownload,
  FiUser,
  FiBriefcase,
  FiMapPin,
  FiMoreVertical,
  FiCheck,
  FiX,
  FiClock,
} from "react-icons/fi";

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCompanyJobApplications = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(backendUrl + "/api/company/applicants", {
        headers: { token: companyToken },
      });

      if (data.success) {
        setApplicants(data.applications.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const changeJobApplicationStatus = async (id, status) => {
    setIsUpdating(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-status",
        { id, status },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(`Application ${status.toLowerCase()}`);
        setApplicants((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status } : app))
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications();
    }
  }, [companyToken]);

  if (isLoading) {
    return <Loading />;
  }

  if (!applicants || applicants.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-[70vh] text-center p-6"
      >
        <div className="bg-gray-100 p-8 rounded-2xl max-w-md">
          <h3 className="text-xl sm:text-2xl font-medium text-gray-800 mb-4">
            No Applications Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Applications from candidates will appear here once they start
            applying to your jobs.
          </p>
        </div>
      </motion.div>
    );
  }

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Accepted: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Reviewed: "bg-blue-100 text-blue-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 max-w-6xl"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl font-bold text-gray-800 mb-8"
      >
        Job Applications
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants
                .filter((item) => item.jobId && item.userId)
                .map((applicant, index) => (
                  <motion.tr
                    key={applicant._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={applicant.userId.image}
                            alt={applicant.userId.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {applicant.userId.name}
                          </div>
                          <div className="text-sm text-gray-500 md:hidden">
                            {applicant.jobId.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900 font-medium">
                        {applicant.jobId.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiMapPin className="mr-1" size={14} />
                        {applicant.jobId.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.a
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        href={applicant.userId.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        <FiDownload className="mr-1" />
                        Resume
                      </motion.a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusColors[applicant.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {applicant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {applicant.status === "Pending" ? (
                        <div className="relative inline-block text-left">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            disabled={isUpdating}
                          >
                            <FiMoreVertical />
                          </motion.button>

                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                            >
                              <div className="py-1">
                                <motion.button
                                  whileHover={{ x: 3 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() =>
                                    changeJobApplicationStatus(
                                      applicant._id,
                                      "Accepted"
                                    )
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <FiCheck /> Accept
                                </motion.button>
                                <motion.button
                                  whileHover={{ x: 3 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() =>
                                    changeJobApplicationStatus(
                                      applicant._id,
                                      "Rejected"
                                    )
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <FiX /> Reject
                                </motion.button>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          <FiClock className="inline mr-1" />
                          {moment(applicant.updatedAt).fromNow()}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-right text-sm text-gray-500"
      >
        Showing {applicants.filter((item) => item.jobId && item.userId).length}{" "}
        applications
      </motion.div>
    </motion.div>
  );
};

export default ViewApplications;
