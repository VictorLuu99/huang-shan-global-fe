"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import { 
  Truck, 
  Globe, 
  Shield, 
  Clock, 
  Package, 
  Plane, 
  Ship, 
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Users,
  TrendingUp,
  Menu,
  X,
  Target,
  Eye,
  Star,
  Building2,
  FileText,
  User
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

const AboutPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations();

  const coreValues = [
    {
      icon: Shield,
      title: t('about.values.trust.title'),
      description: t('about.values.trust.description'),
      color: "bg-blue-500"
    },
    {
      icon: TrendingUp,
      title: t('about.values.efficiency.title'),
      description: t('about.values.efficiency.description'),
      color: "bg-green-500"
    },
    {
      icon: Eye,
      title: t('about.values.transparency.title'),
      description: t('about.values.transparency.description'),
      color: "bg-purple-500"
    },
    {
      icon: Users,
      title: t('about.values.partnership.title'),
      description: t('about.values.partnership.description'),
      color: "bg-orange-500"
    },
    {
      icon: Star,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description'),
      color: "bg-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Company Name */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary">Huang Shan Global</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="/#home" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.home')}</a>
              <a href="/about" className="text-sm font-medium text-primary">{t('nav.about')}</a>
              <a href="/#services" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.services')}</a>
              <a href="#policies" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.policies')}</a>
              <a href="#recruitment" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.recruitment')}</a>
              <a href="#news" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.news')}</a>
              <a href="#complaints" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.complaints')}</a>
              <a href="/#contact" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.contact')}</a>
            </nav>

            {/* Language Switcher and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden border-t border-border mt-1"
              >
                <nav className="py-4 space-y-2">
                  <a href="/#home" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.home')}</a>
                  <a href="/about" className="block px-4 py-2 text-sm font-medium bg-muted rounded-lg text-primary" onClick={() => setMobileMenuOpen(false)}>{t('nav.about')}</a>
                  <a href="/#services" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.services')}</a>
                  <a href="#policies" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.policies')}</a>
                  <a href="#recruitment" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.recruitment')}</a>
                  <a href="#news" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.news')}</a>
                  <a href="#complaints" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.complaints')}</a>
                  <a href="/#contact" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.contact')}</a>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t('about.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t('about.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-background rounded-2xl p-8 shadow-lg border">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">{t('about.company.phone')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">{t('about.company.address')}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm leading-relaxed">{t('about.company.license')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">{t('about.company.representative')}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">{t('about.introduction.title')}</h2>
            </div>
            <div className="bg-muted/50 rounded-2xl p-8">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t('about.introduction.content')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-background rounded-2xl p-8 shadow-lg border"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">{t('about.mission.title')}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {t('about.mission.content')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-background rounded-2xl p-8 shadow-lg border"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mr-4">
                    <Eye className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">{t('about.vision.title')}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {t('about.vision.content')}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">{t('about.values.title')}</h2>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-background rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow"
                >
                  <div className={`w-12 h-12 ${value.color} rounded-full flex items-center justify-center mb-4`}>
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-primary">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t('about.conclusion')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Truck className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary">Huang Shan Global</span>
            </div>
            <p className="text-muted-foreground mb-8">
              {t('footer.companyDescription')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;