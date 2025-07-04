import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";
import { FiFilter, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } =
    useContext(AppContext);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((c) => c !== location)
        : [...prev, location]
    );
  };

  useEffect(() => {
    const matchesCategory = (job) =>
      selectedCategories.length === 0 ||
      selectedCategories.includes(job.category);

    const matchesLocations = (job) =>
      selectedLocations.length === 0 ||
      selectedLocations.includes(job.location);

    const matchesTitle = (job) =>
      searchFilter.title === "" ||
      job.title.toLowerCase().includes(searchFilter.title.toLowerCase());

    const matchesSearchLocation = (job) =>
      searchFilter.location === "" ||
      job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

    const newFilteredJobs = jobs
      .slice()
      .reverse()
      .filter(
        (job) =>
          matchesCategory(job) &&
          matchesLocations(job) &&
          matchesTitle(job) &&
          matchesSearchLocation(job)
      );

    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs, selectedCategories, selectedLocations, searchFilter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <FiFilter />
          <span>Filters</span>
        </button>

        {/* Sidebar - Filters */}
        <AnimatePresence>
          {(showFilter ||
            !window.matchMedia("(max-width: 1024px)").matches) && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full lg:w-1/4 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              {/* Close button for mobile */}
              <button
                onClick={() => setShowFilter(false)}
                className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>

              {/* Search Filter from Hero Component */}
              {isSearched &&
                (searchFilter.title !== "" || searchFilter.location !== "") && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <h3 className="font-medium text-lg mb-3">Current Search</h3>
                    <div className="flex flex-wrap gap-2">
                      {searchFilter.title && (
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                        >
                          {searchFilter.title}
                          <button
                            onClick={() =>
                              setSearchFilter((prev) => ({
                                ...prev,
                                title: "",
                              }))
                            }
                            className="text-blue-400 hover:text-blue-600"
                          >
                            <FiX size={14} />
                          </button>
                        </motion.span>
                      )}
                      {searchFilter.location && (
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm"
                        >
                          {searchFilter.location}
                          <button
                            onClick={() =>
                              setSearchFilter((prev) => ({
                                ...prev,
                                location: "",
                              }))
                            }
                            className="text-red-400 hover:text-red-600"
                          >
                            <FiX size={14} />
                          </button>
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                )}

              {/* Category Filter */}
              <div className="mb-8">
                <h4 className="font-medium text-lg mb-4">Categories</h4>
                <ul className="space-y-3">
                  {JobCategories.map((category, index) => (
                    <motion.li
                      whileHover={{ x: 5 }}
                      key={index}
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => handleCategoryChange(category)}
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          selectedCategories.includes(category)
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedCategories.includes(category) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-white"
                          >
                            ✓
                          </motion.div>
                        )}
                      </div>
                      <span className="text-gray-700">{category}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Location Filter */}
              <div>
                <h4 className="font-medium text-lg mb-4">Locations</h4>
                <ul className="space-y-3">
                  {JobLocations.map((location, index) => (
                    <motion.li
                      whileHover={{ x: 5 }}
                      key={index}
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => handleLocationChange(location)}
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          selectedLocations.includes(location)
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedLocations.includes(location) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-white"
                          >
                            ✓
                          </motion.div>
                        )}
                      </div>
                      <span className="text-gray-700">{location}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Job listings */}
        <section className="w-full lg:w-3/4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-bold text-2xl md:text-3xl mb-2">Latest Jobs</h3>
            <p className="text-gray-500 mb-8">
              Discover your next career opportunity
            </p>
          </motion.div>

          {filteredJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100"
            >
              <p className="text-gray-500">
                No jobs match your current filters
              </p>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedLocations([]);
                  setSearchFilter({ title: "", location: "" });
                }}
                className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <>
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredJobs
                  .slice((currentPage - 1) * 6, currentPage * 6)
                  .map((job, index) => (
                    <JobCard key={job._id} job={job} index={index} />
                  ))}
              </motion.div>

              {/* Pagination */}
              {filteredJobs.length > 6 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 mt-12"
                >
                  <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <FiChevronLeft />
                  </button>

                  {Array.from({
                    length: Math.ceil(filteredJobs.length / 6),
                  }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(
                          currentPage + 1,
                          Math.ceil(filteredJobs.length / 6)
                        )
                      )
                    }
                    disabled={
                      currentPage === Math.ceil(filteredJobs.length / 6)
                    }
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <FiChevronRight />
                  </button>
                </motion.div>
              )}
            </>
          )}
        </section>
      </div>
    </motion.div>
  );
};

export default JobListing;
