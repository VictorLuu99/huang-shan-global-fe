'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('footer');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <motion.div {...fadeInUp} className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">{t('companyName')}</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {t('companyDescription')}
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Điện thoại: 038.959.1238 - 058.585.1999</p>
              <p>Email: info@huangshanglobal.com</p>
              <p>Địa chỉ: C38-30, Khu C Geleximco, Dương Nội, Hà Đông, Hà Nội</p>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }}>
            <h4 className="text-lg font-semibold mb-4">{t('services')}</h4>
            <ul className="space-y-2">
              <li><Link href="/#services" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">Vận chuyển đường bộ Trung – Việt</Link></li>
              <li><Link href="/#services" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">Vận chuyển TMĐT siêu tốc</Link></li>
              <li><Link href="/#services" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">Vận chuyển đường biển</Link></li>
              <li><Link href="/#services" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">Vận chuyển chính ngạch</Link></li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
            <h4 className="text-lg font-semibold mb-4">{t('company')}</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">{t('aboutUs')}</Link></li>
              <li><Link href="/#careers" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">{t('careers')}</Link></li>
              <li><Link href="/#news" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">{t('news')}</Link></li>
              <li><Link href="/#contact" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">{t('contact')}</Link></li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.3 }}>
            <h4 className="text-lg font-semibold mb-4">{t('support')}</h4>
            <ul className="space-y-2">
              <li><Link href="/#help" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">{t('helpCenter')}</Link></li>
              <li><Link href="/#track" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">{t('trackPackage')}</Link></li>
              <li><Link href="/#calculator" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">{t('shippingCalculator')}</Link></li>
              <li><Link href="/#docs" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">{t('documentation')}</Link></li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-800 text-center"
        >
          <p className="text-gray-400 text-sm">{t('copyright')}</p>
        </motion.div>
      </div>
    </footer>
  );
}