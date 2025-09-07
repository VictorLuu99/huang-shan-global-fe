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
  Package,
  Plane,
  Ship,
  Globe,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Users,
  Phone
} from 'lucide-react';

const ServicesPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations();

  const services = [
    {
      id: 'ground-transport',
      icon: Truck,
      title: t('services.groundTransportation.title'),
      description: t('services.groundTransportation.description'),
      shortDesc: "Vận chuyển đường bộ Trung - Việt, 2-3 ngày, kho bãi 2 đầu",
      color: "bg-blue-500",
      features: ["2-3 ngày giao hàng", "Kho bãi tại 2 đầu", "Theo dõi real-time", "Bảo hiểm toàn trình"],
      price: "Từ 15,000 VNĐ/kg",
      popular: true
    },
    {
      id: 'air-freight', 
      icon: Plane,
      title: t('services.airFreight.title'),
      description: t('services.airFreight.description'),
      shortDesc: "Line chuyên biệt TMĐT, 2-3 ngày, tối ưu shop online",
      color: "bg-red-500",
      features: ["Chuyên biệt TMĐT", "Không kiểm hóa", "Tránh tắc biên", "Phù hợp shop online"],
      price: "Từ 25,000 VNĐ/kg"
    },
    {
      id: 'ocean-freight',
      icon: Ship,
      title: t('services.oceanFreight.title'),
      description: t('services.oceanFreight.description'),
      shortDesc: "Hàng cồng kềnh, máy móc, thiết bị công nghiệp",
      color: "bg-cyan-500",
      features: ["Hàng cồng kềnh", "Máy móc thiết bị", "Chứng từ đầy đủ", "Giá cả cạnh tranh"],
      price: "Liên hệ báo giá"
    },
    {
      id: 'legal-import',
      icon: Package,
      title: t('services.warehousing.title'),
      description: t('services.warehousing.description'),
      shortDesc: "Hóa đơn VAT, nhập khẩu chính ngạch, minh bạch",
      color: "bg-orange-500",
      features: ["Hóa đơn VAT", "Chính ngạch", "Minh bạch an toàn", "Nhập khẩu lâu dài"],
      price: "Phí từ 8%"
    },
    {
      id: 'machinery-import',
      icon: Globe,
      title: t('services.globalNetwork.title'),
      description: t('services.globalNetwork.description'),
      shortDesc: "Thẩm định nhà máy, thủ tục hải quan, vận chuyển an toàn",
      color: "bg-green-500",
      features: ["Thẩm định nhà máy", "Thủ tục hải quan", "Vận chuyển an toàn", "Tư vấn kỹ thuật"],
      price: "Liên hệ tư vấn"
    },
    {
      id: 'sourcing-order',
      icon: Shield,
      title: t('services.insurance.title'),
      description: t('services.insurance.description'),
      shortDesc: "Tìm nguồn uy tín, đàm phán giá, đặt hàng A-Z",
      color: "bg-purple-500",
      features: ["Tìm nguồn uy tín", "Đàm phán giá tốt", "Đặt hàng A-Z", "Kiểm tra chất lượng"],
      price: "Phí từ 3%"
    }
  ];

  const whyChooseUs = [
    {
      icon: Clock,
      title: "Hàng về siêu nhanh - chỉ 2-3 ngày",
      description: "Line vận chuyển TMĐT chuyên biệt, không kiểm hóa, tránh tình trạng tắc biên"
    },
    {
      icon: CheckCircle,
      title: "Chi phí tối ưu - minh bạch tuyệt đối",
      description: "Phí dịch vụ rẻ chỉ từ 1%, phù hợp từ đơn lẻ đến hàng lô"
    },
    {
      icon: Shield,
      title: "Chính sách đền bù chi tiết, đảm bảo",
      description: "Đền 100% giá trị hàng hóa nếu mua gói bảo hiểm 5%"
    },
    {
      icon: Users,
      title: "CSKH tận tâm - đồng hành 24/7",
      description: "Mỗi khách hàng đều có nhân viên hỗ trợ riêng từ A-Z"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Đơn hàng vận chuyển" },
    { number: "1,500+", label: "Khách hàng tin tưởng" }, 
    { number: "50+", label: "Chủng loại hàng hóa" },
    { number: "250+", label: "Đối tác chiến lược" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('services.title')}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('services.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
                >
                  {service.popular && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Phổ biến
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Giá từ</div>
                      <div className="font-bold text-primary">{service.price}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.shortDesc}</p>
                  
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center group">
                    Nhận báo giá ngay
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Vì sao nên chọn Huang Shan Global?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Uy tín số 1 Việt Nam trong lĩnh vực nhập khẩu và vận chuyển Trung Quốc - Việt Nam
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 flex items-start space-x-4"
                >
                  <div className="bg-primary/10 rounded-lg p-3 flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Những con số ấn tượng
              </h2>
              <p className="text-xl opacity-90">
                Khẳng định sự tin cậy tuyệt đối từ khách hàng
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-12 text-white"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Sẵn sàng bắt đầu vận chuyển?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Liên hệ ngay để nhận tư vấn miễn phí và báo giá tốt nhất cho nhu cầu vận chuyển của bạn
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:0389591238" className="bg-white text-primary hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Gọi ngay: 038.959.1238
                </a>
                <Link href="/contact" className="bg-transparent border-2 border-white hover:bg-white hover:text-primary font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center">
                  Nhận báo giá miễn phí
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServicesPage;