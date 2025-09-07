'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { 
  Truck, 
  Menu, 
  X,
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
  Upload,
  CheckCircle
} from 'lucide-react';

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
  education: string;
  description: string;
  requirements: string[];
  benefits: string[];
  deadline: string;
  featured: boolean;
}

export default function RecruitmentPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [showApplication, setShowApplication] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    education: '',
    coverLetter: '',
    resume: null as File | null
  });
  const t = useTranslations();

  // Mock job listings data
  const jobListings: JobListing[] = [
    {
      id: '1',
      title: t('recruitment.jobs.logistics_coordinator.title'),
      department: t('recruitment.departments.logistics'),
      location: t('recruitment.locations.hanoi'),
      type: t('recruitment.job_types.full_time'),
      salary: '15-25 triệu VNĐ',
      experience: '2-3 năm',
      education: t('recruitment.education.bachelor'),
      description: t('recruitment.jobs.logistics_coordinator.description'),
      requirements: t('recruitment.jobs.logistics_coordinator.requirements').split('|'),
      benefits: t('recruitment.jobs.logistics_coordinator.benefits').split('|'),
      deadline: '2024-12-31',
      featured: true
    },
    {
      id: '2',
      title: t('recruitment.jobs.warehouse_manager.title'),
      department: t('recruitment.departments.operations'),
      location: t('recruitment.locations.ho_chi_minh'),
      type: t('recruitment.job_types.full_time'),
      salary: '20-30 triệu VNĐ',
      experience: '3-5 năm',
      education: t('recruitment.education.bachelor'),
      description: t('recruitment.jobs.warehouse_manager.description'),
      requirements: t('recruitment.jobs.warehouse_manager.requirements').split('|'),
      benefits: t('recruitment.jobs.warehouse_manager.benefits').split('|'),
      deadline: '2024-12-25',
      featured: true
    },
    {
      id: '3',
      title: t('recruitment.jobs.customer_service.title'),
      department: t('recruitment.departments.customer_service'),
      location: t('recruitment.locations.hanoi'),
      type: t('recruitment.job_types.full_time'),
      salary: '12-18 triệu VNĐ',
      experience: '1-2 năm',
      education: t('recruitment.education.high_school'),
      description: t('recruitment.jobs.customer_service.description'),
      requirements: t('recruitment.jobs.customer_service.requirements').split('|'),
      benefits: t('recruitment.jobs.customer_service.benefits').split('|'),
      deadline: '2024-12-20',
      featured: false
    },
    {
      id: '4',
      title: t('recruitment.jobs.sales_executive.title'),
      department: t('recruitment.departments.sales'),
      location: t('recruitment.locations.da_nang'),
      type: t('recruitment.job_types.full_time'),
      salary: '15-25 triệu VNĐ',
      experience: '2-4 năm',
      education: t('recruitment.education.bachelor'),
      description: t('recruitment.jobs.sales_executive.description'),
      requirements: t('recruitment.jobs.sales_executive.requirements').split('|'),
      benefits: t('recruitment.jobs.sales_executive.benefits').split('|'),
      deadline: '2024-12-15',
      featured: false
    }
  ];

  const departments = [
    t('recruitment.departments.logistics'),
    t('recruitment.departments.operations'),
    t('recruitment.departments.customer_service'),
    t('recruitment.departments.sales'),
    t('recruitment.departments.finance'),
    t('recruitment.departments.hr')
  ];

  const locations = [
    t('recruitment.locations.hanoi'),
    t('recruitment.locations.ho_chi_minh'),
    t('recruitment.locations.da_nang'),
    t('recruitment.locations.hai_phong')
  ];

  // Filter jobs based on search and filters
  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || job.department === selectedDepartment;
    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle application submission logic here
    console.log('Application submitted:', applicationData);
    setShowApplication(null);
    // Reset form or show success message
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setApplicationData({ ...applicationData, resume: file });
    }
  };

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
                {t('recruitment.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                {t('recruitment.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('recruitment.hero.view_jobs')}
                </motion.button>
                <motion.button
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('recruitment.hero.learn_more')}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Join Us Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {t('recruitment.why_join.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('recruitment.why_join.subtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Users,
                  title: t('recruitment.benefits.team_work.title'),
                  description: t('recruitment.benefits.team_work.description')
                },
                {
                  icon: GraduationCap,
                  title: t('recruitment.benefits.learning.title'),
                  description: t('recruitment.benefits.learning.description')
                },
                {
                  icon: Briefcase,
                  title: t('recruitment.benefits.career.title'),
                  description: t('recruitment.benefits.career.description')
                },
                {
                  icon: DollarSign,
                  title: t('recruitment.benefits.compensation.title'),
                  description: t('recruitment.benefits.compensation.description')
                }
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
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
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
                {t('recruitment.search.title')}
              </h3>
              
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t('recruitment.search.placeholder')}
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
                    <option value="">{t('recruitment.filters.all_departments')}</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="">{t('recruitment.filters.all_locations')}</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  {t('recruitment.search.button')}
                </button>
              </div>
              
              <p className="text-gray-600 text-center">
                {t('recruitment.search.results', { count: filteredJobs.length })}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Job Listings Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Job List */}
              <div className="lg:col-span-2 space-y-6">
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${
                      selectedJob === job.id ? 'ring-2 ring-blue-500' : ''
                    } ${job.featured ? 'border-l-4 border-yellow-500' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {job.title}
                          {job.featured && (
                            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              {t('recruitment.featured')}
                            </span>
                          )}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            {job.department}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {job.type}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {job.salary}
                          </span>
                        </div>
                      </div>
                      <ChevronRight 
                        className={`w-6 h-6 text-gray-400 transition-transform ${
                          selectedJob === job.id ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                    
                    <AnimatePresence>
                      {selectedJob === job.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-gray-700 mb-4">{job.description}</p>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {t('recruitment.job_details.requirements')}
                                </h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {job.requirements.map((req, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                      {req}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {t('recruitment.job_details.benefits')}
                                </h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {job.benefits.map((benefit, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                              <div className="text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {t('recruitment.job_details.deadline')}: {job.deadline}
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setApplicationData({ ...applicationData, position: job.title });
                                  setShowApplication(job.id);
                                }}
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                {t('recruitment.apply_now')}
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
                        {t('recruitment.application.title')}
                      </h3>
                      
                      <form onSubmit={handleApplicationSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('recruitment.application.full_name')}
                          </label>
                          <input
                            type="text"
                            required
                            value={applicationData.fullName}
                            onChange={(e) => setApplicationData({ ...applicationData, fullName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('recruitment.application.email')}
                          </label>
                          <input
                            type="email"
                            required
                            value={applicationData.email}
                            onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('recruitment.application.phone')}
                          </label>
                          <input
                            type="tel"
                            required
                            value={applicationData.phone}
                            onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('recruitment.application.experience')}
                          </label>
                          <select
                            required
                            value={applicationData.experience}
                            onChange={(e) => setApplicationData({ ...applicationData, experience: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">{t('recruitment.application.select_experience')}</option>
                            <option value="0-1">{t('recruitment.experience.entry')}</option>
                            <option value="1-3">{t('recruitment.experience.junior')}</option>
                            <option value="3-5">{t('recruitment.experience.mid')}</option>
                            <option value="5+">{t('recruitment.experience.senior')}</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('recruitment.application.cover_letter')}
                          </label>
                          <textarea
                            rows={4}
                            value={applicationData.coverLetter}
                            onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder={t('recruitment.application.cover_letter_placeholder')}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('recruitment.application.resume')}
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="resume-upload"
                            />
                            <label htmlFor="resume-upload" className="cursor-pointer">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">
                                {applicationData.resume ? applicationData.resume.name : t('recruitment.application.upload_resume')}
                              </p>
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                          <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            {t('recruitment.application.submit')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowApplication(null)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            {t('recruitment.application.cancel')}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
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
                {t('recruitment.contact.title')}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {t('recruitment.contact.subtitle')}
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t('recruitment.contact.hr_department')}
                  </h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-blue-600 mr-3" />
                      <span>{t('recruitment.contact.phone')}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-blue-600 mr-3" />
                      <span>{t('recruitment.contact.email')}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                      <span>{t('recruitment.contact.address')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t('recruitment.contact.office_hours')}
                  </h3>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span>{t('recruitment.contact.weekdays')}</span>
                      <span>8:00 - 17:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('recruitment.contact.saturday')}</span>
                      <span>8:00 - 12:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('recruitment.contact.sunday')}</span>
                      <span>{t('recruitment.contact.closed')}</span>
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