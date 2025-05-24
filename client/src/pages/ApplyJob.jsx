import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import kconvert from 'k-convert'
import moment from 'moment'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '@clerk/clerk-react'

const ApplyJob = () => {
  const { id } = useParams()
  const { getToken } = useAuth()
  const navigate = useNavigate()

  const [jobData, setJobData] = useState(null)
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const { jobs, backendUrl, userData, userApplications, fetchUserApplications } = useContext(AppContext)

  const fetchJob = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`)
      if (data?.success) {
        setJobData(data.job)
      } else {
        toast.error(data?.message || 'Failed to fetch job details')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch job')
      navigate('/jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const applyHandler = async () => {
    try {
      if (!userData) {
        toast.error('Please login to apply for jobs')
        return
      }

      if (!userData?.resume) {
        navigate('/applications')
        toast.error('Please upload your resume before applying')
        return
      }

      if (!jobData?._id) {
        toast.error('Invalid job data')
        return
      }

      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId: jobData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data?.success) {
        toast.success(data.message)
        await fetchUserApplications()
      } else {
        toast.error(data?.message || 'Application failed')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Application failed')
    }
  }

  const checkedAlreadyApplied = () => {
    if (!jobData?._id || !Array.isArray(userApplications)) {
      setIsAlreadyApplied(false)
      return
    }
    
    const hasApplied = userApplications.some(
      item => item?.jobId?._id === jobData._id
    )
    setIsAlreadyApplied(hasApplied)
  }
  
  useEffect(() => {
    if (id) {
      fetchJob()
    }
  }, [id])

  useEffect(() => {
    checkedAlreadyApplied()
  }, [jobData, userApplications])

  if (isLoading) {
    return <Loading />
  }

  if (!jobData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-600">Job not found</p>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-balance rounded-lg w-full'>
          <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
            <div className='flex flex-col md:flex-row items-center'>
              <img 
                className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border' 
                src={jobData.companyId?.image || assets.default_company} 
                alt={jobData.companyId?.name || 'Company logo'} 
              />
              <div className='text-center md:text-left text-neutral-700'>
                <h1 className='text-2xl sm:text-4xl font-medium'>{jobData.title}</h1>
                <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'>
                  <span className='flex items-center gap-1'>
                    <img src={assets.suitcase_icon} alt="Company" />
                    {jobData.companyId?.name || 'N/A'}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.location_icon} alt="Location" />
                    {jobData.location || 'N/A'}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.person_icon} alt="Level" />
                    {jobData.level || 'N/A'}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.money_icon} alt="Salary" />
                    CTC: {jobData.salary ? kconvert.convertTo(jobData.salary) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
              <button 
                onClick={applyHandler} 
                className='bg-blue-600 p-2.5 px-10 text-white rounded disabled:bg-blue-400'
                disabled={isAlreadyApplied}
              >
                {isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
              </button>
              <p className='mt-1 text-gray-600'>
                Posted {jobData.date ? moment(jobData.date).fromNow() : 'N/A'}
              </p>
            </div>
          </div>

          <div className='flex flex-col lg:flex-row justify-between items-start'>
            <div className='w-full lg:w-2/3'>
              <h2 className='font-bold text-2xl mb-4'>Job description</h2>
              <div 
                className='rich-text' 
                dangerouslySetInnerHTML={{
                  __html: jobData.description || '<p>No description available</p>'
                }}
              />
              <button 
                onClick={applyHandler} 
                className='bg-blue-600 p-2.5 px-10 text-white rounded mt-10 disabled:bg-blue-400'
                disabled={isAlreadyApplied}
              >
                {isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
              </button>
            </div>
            
            {/* Right Section More Jobs */}
            <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
              <h2 className='text-xl font-semibold'>More jobs from {jobData.companyId?.name || 'this company'}</h2>
              {jobs
                ?.filter(job => 
                  job?._id !== jobData._id && 
                  job?.companyId?._id === jobData.companyId?._id
                )
                ?.filter(job => {
                  const appliedJobsIds = new Set(
                    userApplications
                      ?.map(app => app?.jobId?._id)
                      ?.filter(Boolean)
                  )
                  return !appliedJobsIds.has(job._id)
                })
                ?.slice(0, 4)
                ?.map((job, index) => (
                  <JobCard key={job._id || index} job={job} />
                ))}
              {jobs?.filter(job => 
                job?._id !== jobData._id && 
                job?.companyId?._id === jobData.companyId?._id
              ).length === 0 && (
                <p className='text-gray-500'>No other jobs from this company</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ApplyJob