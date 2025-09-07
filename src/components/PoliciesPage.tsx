'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import LanguageSwitcher from './shared/LanguageSwitcher';
import { 
  Truck, 
  Menu, 
  X,
  FileText,
  ChevronRight,
  Download,
  Shield,
  Scale,
  Package,
  RefreshCw,
  CreditCard,
  CheckSquare
} from 'lucide-react';

const PoliciesPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('terms');
  const t = useTranslations();

  const policyTypes = [
    {
      id: 'terms',
      icon: Scale,
      title: t('policies.sections.terms'),
      description: 'Điều khoản và điều kiện sử dụng dịch vụ',
      color: 'bg-blue-500'
    },
    {
      id: 'privacy',
      icon: Shield,
      title: t('policies.sections.privacy'),
      description: 'Chính sách bảo vệ thông tin khách hàng',
      color: 'bg-green-500'
    },
    {
      id: 'shipping',
      icon: Package,
      title: t('policies.sections.shipping'),
      description: 'Chính sách vận chuyển và giao nhận',
      color: 'bg-orange-500'
    },
    {
      id: 'refund',
      icon: RefreshCw,
      title: t('policies.sections.refund'),
      description: 'Chính sách hoàn trả và đổi hàng',
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
    const policies = {
      terms: {
        title: 'Điều khoản sử dụng dịch vụ',
        content: [
          {
            heading: '1. Phạm vi áp dụng',
            text: 'Điều khoản này áp dụng cho tất cả khách hàng sử dụng dịch vụ vận chuyển và logistics của Huang Shan Global.'
          },
          {
            heading: '2. Quyền và nghĩa vụ của khách hàng',
            text: 'Khách hàng có trách nhiệm cung cấp thông tin chính xác về hàng hóa, địa chỉ giao nhận và tuân thủ các quy định về xuất nhập khẩu.'
          },
          {
            heading: '3. Trách nhiệm của Huang Shan Global',
            text: 'Chúng tôi cam kết vận chuyển hàng hóa an toàn, đúng thời gian và cung cấp dịch vụ chăm sóc khách hàng 24/7.'
          }
        ]
      },
      privacy: {
        title: 'Chính sách bảo mật thông tin',
        content: [
          {
            heading: '1. Thu thập thông tin',
            text: 'Chúng tôi chỉ thu thập thông tin cần thiết để cung cấp dịch vụ logistics và hỗ trợ khách hàng.'
          },
          {
            heading: '2. Sử dụng thông tin',
            text: 'Thông tin khách hàng được sử dụng để xử lý đơn hàng, liên lạc và cải thiện chất lượng dịch vụ.'
          },
          {
            heading: '3. Bảo mật dữ liệu',
            text: 'Chúng tôi áp dụng các biện pháp bảo mật hiện đại để bảo vệ thông tin khách hàng khỏi truy cập trái phép.'
          }
        ]
      },
      shipping: {
        title: 'Chính sách vận chuyển',
        content: [
          {
            heading: '1. Thời gian vận chuyển',
            text: 'Vận chuyển đường bộ: 2-3 ngày làm việc. Vận chuyển đường biển: 7-15 ngày tùy tuyến đường.'
          },
          {
            heading: '2. Đóng gói hàng hóa',
            text: 'Hàng hóa cần được đóng gói theo tiêu chuẩn quốc tế để đảm bảo an toàn trong quá trình vận chuyển.'
          },
          {
            heading: '3. Giao nhận hàng',
            text: 'Chúng tôi cung cấp dịch vụ giao hàng tận nơi hoặc nhận hàng tại kho theo yêu cầu khách hàng.'
          }
        ]
      },
      refund: {
        title: 'Chính sách hoàn trả',
        content: [
          {
            heading: '1. Điều kiện hoàn trả',
            text: 'Khách hàng có thể yêu cầu hoàn trả phí dịch vụ trong trường hợp chúng tôi không hoàn thành cam kết.'
          },
          {
            heading: '2. Quy trình hoàn trả',
            text: 'Yêu cầu hoàn trả cần được gửi trong vòng 7 ngày kể từ khi phát sinh vấn đề.'
          },
          {
            heading: '3. Thời gian xử lý',
            text: 'Chúng tôi cam kết xử lý yêu cầu hoàn trả trong vòng 5-7 ngày làm việc.'
          }
        ]
      },
      insurance: {
        title: 'Chính sách bảo hiểm',
        content: [
          {
            heading: '1. Bảo hiểm hàng hóa',
            text: 'Khách hàng có thể mua bảo hiểm với mức phí 5% giá trị hàng hóa để được bồi thường 100% khi có rủi ro.'
          },
          {
            heading: '2. Phạm vi bảo hiểm',
            text: 'Bảo hiểm bao gồm: mất mát, hư hỏng, cháy nổ và các rủi ro khác trong quá trình vận chuyển.'
          },
          {
            heading: '3. Quy trình bồi thường',
            text: 'Khi có sự cố, khách hàng cần báo ngay và cung cấp đầy đủ chứng từ để được bồi thường.'
          }
        ]
      },
      compliance: {
        title: 'Quy định tuân thủ',
        content: [
          {
            heading: '1. Quy định pháp luật',
            text: 'Tất cả hoạt động vận chuyển tuân thủ nghiêm ngặt quy định pháp luật Việt Nam và Trung Quốc.'
          },
          {
            heading: '2. Hàng cấm vận chuyển',
            text: 'Chúng tôi không vận chuyển hàng cấm, hàng nguy hiểm và hàng hóa vi phạm pháp luật.'
          },
          {
            heading: '3. Thủ tục hải quan',
            text: 'Khách hàng có trách nhiệm cung cấp đầy đủ giấy tờ và thủ tục hải quan theo quy định.'
          }
        ]
      }
    };

    return policies[sectionId as keyof typeof policies] || policies.terms;
  };

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
                <FileText className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('policies.title')}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
                  <span className="hidden sm:inline">Tải xuống PDF</span>
                </button>
              </div>

              <div className="space-y-8">
                {getPolicyContent(activeSection).content.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="border-l-4 border-primary pl-6"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-primary">
                      {section.heading}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.text}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Lưu ý:</strong> Các chính sách này có hiệu lực từ ngày 01/01/2024 và có thể được cập nhật. 
                  Khách hàng nên thường xuyên kiểm tra để nắm bắt những thay đổi mới nhất.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Để biết thêm thông tin chi tiết, vui lòng liên hệ: 
                  <a href="tel:0389591238" className="font-bold hover:text-primary transition-colors"> 038.959.1238</a> hoặc email: 
                  <a href="mailto:huangshanglobal@gmail.com" className="font-bold hover:text-primary transition-colors"> huangshanglobal@gmail.com</a>
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