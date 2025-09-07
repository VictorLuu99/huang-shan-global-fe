"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import LanguageSwitcher from "./shared/LanguageSwitcher";
import { 
  Shield, 
  MapPin,
  Phone,
  Users,
  TrendingUp,
  Menu,
  X,
  Target,
  Eye,
  Star,
  FileText,
  User
} from "lucide-react";

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
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <div 
                  className="w-full h-full"
                  style={{
                    backgroundImage: 'url(/images/logo.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  aria-label="Huang Shan Global Logo"
                />
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