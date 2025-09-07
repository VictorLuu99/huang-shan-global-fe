'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext';
import { 
  FileText,
  ChevronRight,
  Download,
  Shield,
  Package,
  RefreshCw,
  CreditCard,
  CheckSquare
} from 'lucide-react';

const PoliciesPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('terms');
  const { t, messages } = useTranslation();

  const policyTypes = [
    {
      id: 'terms',
      icon: FileText,
      title: t('policies.sections.terms'),
      description: 'Điều khoản và điều kiện sử dụng dịch vụ',
      color: 'bg-blue-500'
    },
    {
      id: 'privacy',
      icon: Shield,
      title: t('policies.sections.privacy'),
      description: 'Bảo mật và xử lý thông tin khách hàng',
      color: 'bg-green-500'
    },
    {
      id: 'shipping',
      icon: Package,
      title: t('policies.sections.shipping'),
      description: 'Quy định về vận chuyển hàng hóa',
      color: 'bg-orange-500'
    },
    {
      id: 'refund',
      icon: RefreshCw,
      title: t('policies.sections.refund'),
      description: 'Chính sách hoàn tiền và đền bù',
      color: 'bg-purple-500'
    },
    {
      id: 'insurance',
      icon: CreditCard,
      title: t('policies.sections.insurance'),
      description: 'Chính sách bảo hiểm hàng hóa',
      color: 'bg-red-500'
    },
    {
      id: 'compliance',
      icon: CheckSquare,
      title: t('policies.sections.compliance'),
      description: 'Quy định tuân thủ và pháp lý',
      color: 'bg-cyan-500'
    }
  ];

  const getPolicyContent = (sectionId: string) => {
    const policyContentKey = `policies.content.${sectionId}`;
    
    // Navigate through the nested object structure
    const policyContent = policyContentKey.split('.').reduce((obj: Record<string, unknown>, key: string) => {
      return obj && typeof obj[key] === 'object' && obj[key] !== null ? obj[key] as Record<string, unknown> : {};
    }, messages as Record<string, unknown>);

    if (policyContent && Array.isArray((policyContent as { sections?: unknown[] }).sections)) {
      const content = policyContent as { title?: string; sections: Array<{ number: string; heading: string; content: string; }> };
      return {
        title: content.title || '',
        sections: content.sections || []
      };
    }

    // Fallback to default structure
    return {
      title: t(`policies.content.${sectionId}.title`),
      sections: []
    };
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                {t('policies.title')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t('policies.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Policy Types Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {policyTypes.map((policy, index) => (
                <motion.button
                  key={policy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => setActiveSection(policy.id)}
                  className={`text-left p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                    activeSection === policy.id 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-3">
                    <div className={`w-12 h-12 ${policy.color} rounded-lg flex items-center justify-center`}>
                      <policy.icon className="w-6 h-6 text-white" />
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform ${
                      activeSection === policy.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{policy.title}</h3>
                  <p className="text-muted-foreground text-sm">{policy.description}</p>
                </motion.button>
              ))}
            </div>

            {/* Policy Content */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold">
                  {getPolicyContent(activeSection).title}
                </h2>
                <button className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">{t(`policies.content.${activeSection}.download`)}</span>
                </button>
              </div>

              <div className="space-y-8">
                {getPolicyContent(activeSection).sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="border-l-4 border-primary pl-6"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-primary">
                      {section.number}. {section.heading}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Lưu ý:</strong> {t(`policies.content.terms.note`)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t(`policies.content.terms.contact`)}
                  <a href={`tel:${t('policies.content.terms.phone')}`} className="font-bold hover:text-primary transition-colors"> {t('policies.content.terms.phone')}</a> hoặc email: 
                  <a href={`mailto:${t('policies.content.terms.email')}`} className="font-bold hover:text-primary transition-colors"> {t('policies.content.terms.email')}</a>
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PoliciesPage;