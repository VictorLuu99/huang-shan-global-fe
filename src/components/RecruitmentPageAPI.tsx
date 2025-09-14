"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../contexts/LanguageContext";
import { recruitmentService, JobListing } from "../services/recruitmentService";
import { handleApiError } from "../services/api";
import {
  Users,
  MapPin,
  Clock,
  DollarSign,
  GraduationCap,
  Briefcase,
  Search,
  Filter,
  ChevronRight,
  Calendar,
  Building,
  Phone,
  Mail,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import CVUpload from "@/components/shared/CVUpload";
import { FileUploadResult } from "@/utils/fileUpload";

// Use JobListing from service layer with extended fields
type ExtendedJobListing = JobListing & {
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  created_at: string;
};

// Application form data interface
interface ApplicationData {
  job_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  education_level?: string;
  experience_years: number;
  current_position?: string;
  current_company?: string;
  expected_salary?: number;
  available_date?: string;
  cv_file_url: string;
  cv_file_name: string;
  cv_file_size?: number;
  cover_letter?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  skills?: string;
  languages?: string;
}

export default function RecruitmentPageAPI() {
  const [jobs, setJobs] = useState<ExtendedJobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [showApplication, setShowApplication] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("");
  const [applicationData, setApplicationData] = useState<
    Partial<ApplicationData>
  >({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Vietnam",
    nationality: "Vietnamese",
    experience_years: 0,
    cover_letter: "",
    cv_file_url: "",
    cv_file_name: "",
    skills: "",
    languages: "Vietnamese,English",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { t, currentLocale } = useTranslation();

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await recruitmentService.getJobs({
          lang: currentLocale,
        });

        if (response && response.data) {
          setJobs(response.data);
        } else {
          throw new Error(response.error || "Failed to fetch jobs");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentLocale]);

  // Get unique departments and employment types
  const departments = [...new Set(jobs.map((job) => job?.department))];
  const employmentTypes = [...new Set(jobs.map((job) => job?.type))];

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !selectedDepartment || job.department === selectedDepartment;
    const matchesEmploymentType =
      !selectedEmploymentType || job.type === selectedEmploymentType;

    return matchesSearch && matchesDepartment && matchesEmploymentType;
  });

  const formatSalary = (job: ExtendedJobListing) => {
    if (job.salary_range) {
      return job.salary_range;
    }
    if (job.salary_min && job.salary_max && job.salary_currency) {
      return `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ${
        job.salary_currency
      }`;
    }
    if (job.salary_min && !job.salary_max) {
      return `${t("recruitment.salary_from")} ${job.salary_min.toLocaleString()} 'VND'}`;
    }
    if (job.salary_max && !job.salary_min) {
      return `${t("recruitment.salary_upto")} ${job.salary_max.toLocaleString()} 'VND'}`;
    }
    return t("recruitment.salary_negotiable");
  };


  const formatDepartment = (dept: string) => {
    return dept.replace("_", " ").toUpperCase();
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("comin here1");
    
    if (!showApplication) return;
    console.log("comin here2");

    try {
      setSubmitting(true);
      setError(null);
console.log("applicationData: ", applicationData);

      // Validate required fields
      if (
        !applicationData.first_name ||
        !applicationData.last_name ||
        !applicationData.email ||
        !applicationData.phone ||
        !applicationData.cv_file_url ||
        !applicationData.cv_file_name
      ) {
        throw new Error(
          "Please fill in all required fields and upload your CV."
        );
      }

      // Transform data to match backend API contract
      const serviceData = {
        first_name: applicationData.first_name!,
        last_name: applicationData.last_name!,
        email: applicationData.email!,
        phone: applicationData.phone!,
        current_position: applicationData.current_position,
        years_experience: Number(applicationData.experience_years) || 0,
        cover_letter: applicationData.cover_letter || "",
        cv_file_url: applicationData.cv_file_url!,
        cv_file_name: applicationData.cv_file_name!,
        cv_file_size: applicationData.cv_file_size,
        skills: applicationData.skills,
        languages: applicationData.languages || "Vietnamese,English",
        country: applicationData.country || "Vietnam",
        address: applicationData.address,
        city: applicationData.city,
        date_of_birth: applicationData.date_of_birth,
        gender: applicationData.gender,
        nationality: applicationData.nationality || "Vietnamese",
        education_level: applicationData.education_level,
        expected_salary: applicationData.expected_salary,
        available_date: applicationData.available_date,
        portfolio_url: applicationData.portfolio_url,
        linkedin_url: applicationData.linkedin_url,
      };
      console.log("serviceData: ", serviceData);
      
      const result = await recruitmentService.submitApplication(
        String(showApplication),
        serviceData
      );
      if (!result.success) {
        throw new Error(result.error || "Failed to submit application");
      }

      console.log("Application submitted successfully:", result.data);

      setSubmitSuccess(true);
      setShowApplication(null);

      // Reset form
      setApplicationData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "Vietnam",
        nationality: "Vietnamese",
        experience_years: 0,
        cover_letter: "",
        cv_file_url: "",
        cv_file_name: "",
        skills: "",
        languages: "Vietnamese,English",
      });
    } catch (err) {
      console.error("Error submitting application:", err);
      setError(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (result: FileUploadResult) => {
    if (result.success && result.fileUrl) {
      setApplicationData({
        ...applicationData,
        cv_file_url: result.fileUrl,
        cv_file_name: result.fileName || "",
        cv_file_size: result.fileSize || 0,
      });
      setError(null);
    } else {
      setError(result.error || "Failed to upload CV file");
    }
  };

  const handleInputChange = (
    field: keyof ApplicationData,
    value: string | number
  ) => {
    setApplicationData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-gray-600">Loading job opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-blue-900 to-green-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {t("recruitment.hero.title")}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                {t("recruitment.hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    document
                      .getElementById("job-listings")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {t("recruitment.hero.view_jobs")}
                </motion.button>
                <motion.button
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    document
                      .getElementById("why-join")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {t("recruitment.hero.learn_more")}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Success Message */}
        <AnimatePresence>
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="bg-green-100 border border-green-200 text-green-800 px-6 py-4 mx-6 mt-6 rounded-lg flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>
                Your application has been submitted successfully! We will review
                it and contact you soon.
              </span>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="bg-red-100 border border-red-200 text-red-800 px-6 py-4 mx-6 mt-6 rounded-lg flex items-center"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Why Join Us Section */}
        <section id="why-join" className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {t("recruitment.why_join.title")}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t("recruitment.why_join.subtitle")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Users,
                  title: t("recruitment.benefits.team_work.title"),
                  description: t("recruitment.benefits.team_work.description"),
                },
                {
                  icon: GraduationCap,
                  title: t("recruitment.benefits.learning.title"),
                  description: t("recruitment.benefits.learning.description"),
                },
                {
                  icon: Briefcase,
                  title: t("recruitment.benefits.career.title"),
                  description: t("recruitment.benefits.career.description"),
                },
                {
                  icon: DollarSign,
                  title: t("recruitment.benefits.compensation.title"),
                  description: t(
                    "recruitment.benefits.compensation.description"
                  ),
                },
              ].map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Job Search & Filter Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {t("recruitment.search.title")}
              </h3>

              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t("recruitment.search.placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="">
                      {t("recruitment.filters.all_departments")}
                    </option>
                    {departments &&
                      departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {formatDepartment(dept)}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedEmploymentType}
                    onChange={(e) => setSelectedEmploymentType(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="">All Employment Types</option>
                    {employmentTypes &&
                      employmentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDepartment("");
                    setSelectedEmploymentType("");
                  }}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>

              <p className="text-gray-600 text-center">
                {t("recruitment.search.results", { count: filteredJobs.length })}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Job Listings Section */}
        <section id="job-listings" className="py-20">
          <div className="container mx-auto px-6">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {t("recruitment.no_jobs.title")}
                </h3>
                <p className="text-gray-600">
                  {jobs.length === 0
                    ? t("recruitment.no_jobs.updating_message")
                    : t("recruitment.no_jobs.search_message")}
                </p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Job List */}
                <div className="lg:col-span-2 space-y-6">
                  {filteredJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${
                        selectedJob === job.id ? "ring-2 ring-blue-500" : ""
                      } ${
                        new Date(job.created_at).getTime() >
                        Date.now() - 7 * 24 * 60 * 60 * 1000
                          ? "border-l-4 border-green-500"
                          : ""
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      onClick={() =>
                        setSelectedJob(selectedJob === job.id ? null : job.id)
                      }
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {job.title}
                            {new Date(job.created_at).getTime() >
                              Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                              <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                New
                              </span>
                            )}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Building className="w-4 h-4 mr-1" />
                              {formatDepartment(job.department)}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {job?.type}
                            </span>
                            <span className="flex items-center">
                              {/* <DollarSign className="w-4 h-4 mr-1" /> */}
                              {formatSalary(job)}
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-6 h-6 text-gray-400 transition-transform ${
                            selectedJob === job.id ? "rotate-90" : ""
                          }`}
                        />
                      </div>

                      <AnimatePresence>
                        {selectedJob === job.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <p className="text-gray-700 mb-4">
                                {job.description}
                              </p>

                              <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                    Requirements
                                  </h4>
                                  <div className="space-y-2">
                                    {(job.requirements as unknown as string)
                                      ?.split("\n")
                                      .filter((req) => req.trim())
                                      .map((req, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-start group hover:bg-white hover:shadow-sm rounded-md p-2 transition-all duration-200"
                                        >
                                          <CheckCircle className="w-4 h-4 text-green-600 mr-3 mt-0.5 flex-shrink-0 group-hover:text-green-700" />
                                          <span className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900">
                                            {req.trim()}
                                          </span>
                                        </div>
                                      ))}
                                  </div>
                                </div>

                                {job.benefits && job.benefits.length > 0 && (
                                  <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                      Benefits
                                    </h4>
                                    <div className="space-y-2">
                                      {(job.benefits as unknown as string)
                                        ?.split("\n")
                                        .filter((benefit) => benefit.trim())
                                        .map((benefit, idx) => (
                                          <div
                                            key={idx}
                                            className="flex items-start group hover:bg-white hover:shadow-sm rounded-md p-2 transition-all duration-200"
                                          >
                                            <CheckCircle className="w-4 h-4 text-blue-600 mr-3 mt-0.5 flex-shrink-0 group-hover:text-blue-700" />
                                            <span className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900">
                                              {benefit.trim()}
                                            </span>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                  <div className="flex items-center mb-1">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Posted:{" "}
                                    {new Date(
                                      job.created_at
                                    ).toLocaleDateString()}
                                  </div>
                                  {job.application_deadline && (
                                    <div className="flex items-center">
                                      <Calendar className="w-4 h-4 mr-1" />
                                      Deadline:{" "}
                                      {new Date(
                                        job.application_deadline
                                      ).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setApplicationData({
                                      ...applicationData,
                                      job_id: parseInt(job.id),
                                    });
                                    setShowApplication(job.id);
                                  }}
                                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  {t("recruitment.apply_now")}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {/* Application Form Sidebar */}
                <div className="lg:col-span-1">
                  <AnimatePresence>
                    {showApplication && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-6 rounded-xl shadow-lg sticky top-6"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                          Apply for Position
                        </h3>

                        <form
                          onSubmit={handleApplicationSubmit}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name *
                              </label>
                              <input
                                type="text"
                                required
                                value={applicationData.first_name || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "first_name",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name *
                              </label>
                              <input
                                type="text"
                                required
                                value={applicationData.last_name || ""}
                                onChange={(e) =>
                                  handleInputChange("last_name", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email *
                            </label>
                            <input
                              type="email"
                              required
                              value={applicationData.email || ""}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone *
                            </label>
                            <input
                              type="tel"
                              required
                              value={applicationData.phone || ""}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Years of Experience
                            </label>
                            <select
                              value={applicationData.experience_years || 0}
                              onChange={(e) =>
                                handleInputChange(
                                  "experience_years",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value={0}>Fresh Graduate</option>
                              <option value={1}>1 year</option>
                              <option value={2}>2 years</option>
                              <option value={3}>3 years</option>
                              <option value={4}>4 years</option>
                              <option value={5}>5+ years</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Cover Letter
                            </label>
                            <textarea
                              rows={4}
                              value={applicationData.cover_letter || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "cover_letter",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              placeholder="Tell us why you're interested in this position..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CV/Resume *
                            </label>
                            <CVUpload
                              onUploadComplete={handleFileUpload}
                              onUploadError={(error) => setError(error)}
                              currentFile={
                                applicationData.cv_file_url
                                  ? {
                                      name:
                                        applicationData.cv_file_name || "CV",
                                      url: applicationData.cv_file_url,
                                      size: applicationData.cv_file_size,
                                    }
                                  : null
                              }
                              disabled={submitting}
                            />
                          </div>

                          <div className="flex gap-3 pt-4">
                            <button
                              type="submit"
                              disabled={submitting}
                              className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                              {submitting ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  {t("recruitment.status.submitting")}
                                </>
                              ) : (
                                t("recruitment.application.submit")
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowApplication(null)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Contact HR Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t("recruitment.contact.title")}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {t("recruitment.contact.subtitle")}
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t("recruitment.contact.hr_department")}
                  </h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-blue-600 mr-3" />
                      <span>{t("recruitment.contact.phone")}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-blue-600 mr-3" />
                      <span>{t("recruitment.contact.email")}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                      <span>{t("recruitment.contact.address")}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t("recruitment.contact.office_hours")}
                  </h3>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span>{t("recruitment.contact.weekdays")}</span>
                      <span>8:00 - 17:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("recruitment.contact.saturday")}</span>
                      <span>8:00 - 12:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("recruitment.contact.sunday")}</span>
                      <span>{t("recruitment.contact.closed")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
