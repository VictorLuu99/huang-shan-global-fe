'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext';
import Link from 'next/link';
import LanguageSwitcher from './shared/LanguageSwitcher';
import { 
  Truck,
  Menu, 
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Building,
  Package,
  Globe,
  Star,
  CheckCircle,
  User,
  MessageSquare
} from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  serviceType: string;
  subject: string;
  message: string;
  priority: string;
}

const ContactPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle form submission
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const serviceTypes = [
    { id: 'ground_transport', label: t('contact.services.ground_transport'), icon: <Truck className="w-4 h-4" /> },
    { id: 'air_freight', label: t('contact.services.air_freight'), icon: <Package className="w-4 h-4" /> },
    { id: 'ocean_freight', label: t('contact.services.ocean_freight'), icon: <Globe className="w-4 h-4" /> },
    { id: 'warehousing', label: t('contact.services.warehousing'), icon: <Building className="w-4 h-4" /> },
    { id: 'consultation', label: t('contact.services.consultation'), icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'other', label: t('contact.services.other'), icon: <Star className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('contact.title')}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                {t('contact.subtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{t('contact.benefits.fast_response')}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{t('contact.benefits.expert_advice')}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{t('contact.benefits.free_quote')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Form and Information */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="bg-card border border-border rounded-xl p-8">
                  <h2 className="text-3xl font-bold mb-2">{t('contact.form.title')}</h2>
                  <p className="text-muted-foreground mb-8">{t('contact.form.subtitle')}</p>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-green-600 mb-2">{t('contact.form.success.title')}</h3>
                      <p className="text-muted-foreground">{t('contact.form.success.message')}</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <User className="w-5 h-5 mr-2" />
                          {t('contact.form.personal_info')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              {t('contact.form.first_name')} *
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              {t('contact.form.last_name')} *
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {t('contact.form.email')} *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {t('contact.form.phone')} *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                      </div>

                      {/* Company Information */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('contact.form.company')}
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>

                      {/* Service Type */}
                      <div>
                        <label className="block text-sm font-medium mb-4">
                          {t('contact.form.service_type')} *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {serviceTypes.map((service) => (
                            <label key={service.id} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name="serviceType"
                                value={service.id}
                                checked={formData.serviceType === service.id}
                                onChange={handleInputChange}
                                className="text-primary focus:ring-primary/20"
                              />
                              <div className="flex items-center space-x-2">
                                {service.icon}
                                <span>{service.label}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('contact.form.priority')}
                        </label>
                        <select
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="low">{t('contact.form.priority_levels.low')}</option>
                          <option value="normal">{t('contact.form.priority_levels.normal')}</option>
                          <option value="high">{t('contact.form.priority_levels.high')}</option>
                          <option value="urgent">{t('contact.form.priority_levels.urgent')}</option>
                        </select>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('contact.form.subject')} *
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          placeholder={t('contact.form.subject_placeholder')}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('contact.form.message')} *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          placeholder={t('contact.form.message_placeholder')}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-lg font-medium hover:bg-primary/80 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Send className="w-5 h-5" />
                        <span>{t('contact.form.send_message')}</span>
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-8"
              >
                {/* Quick Contact */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">{t('contact.info.title')}</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{t('contact.info.phone')}</h4>
                        <a href="tel:0389591238" className="text-muted-foreground text-sm hover:text-primary transition-colors block">038.959.1238</a>
                        <a href="tel:0585851999" className="text-muted-foreground text-sm hover:text-primary transition-colors block">058.585.1999</a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{t('contact.info.email')}</h4>
                        <p className="text-muted-foreground text-sm">info@huangshanglobal.com</p>
                        <p className="text-muted-foreground text-sm">sales@huangshanglobal.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{t('contact.info.address')}</h4>
                        <a 
                          href="https://maps.app.goo.gl/tYXyBhZNtMHchAFV6" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground text-sm hover:text-primary transition-colors block"
                        >
                          C38-30, Block C Geleximco<br />
                          Duong Noi, Ha Dong, Hanoi
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    {t('contact.hours.title')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('contact.hours.weekdays')}</span>
                      <span className="font-medium">8:00 - 17:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('contact.hours.saturday')}</span>
                      <span className="font-medium">8:00 - 12:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('contact.hours.sunday')}</span>
                      <span className="font-medium text-red-500">{t('contact.hours.closed')}</span>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 text-primary">{t('contact.response.title')}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{t('contact.response.phone')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{t('contact.response.email')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{t('contact.response.quote')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">{t('contact.faq.title')}</h2>
              <p className="text-muted-foreground">{t('contact.faq.subtitle')}</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {Array.from({ length: 4 }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="bg-background border border-border rounded-lg p-6"
                >
                  <h3 className="font-bold mb-3">{t(`contact.faq.questions.q${i + 1}.question`)}</h3>
                  <p className="text-muted-foreground">{t(`contact.faq.questions.q${i + 1}.answer`)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;