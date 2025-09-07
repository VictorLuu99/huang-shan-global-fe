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
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
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
              <h3 className="text-xl font-bold">{t('companyName')}</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {t('companyDescription')}
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>
                Điện thoại: 
                <a href="tel:0389591238" className="hover:text-primary transition-colors ml-1">038.959.1238</a>
                {' - '}
                <a href="tel:0585851999" className="hover:text-primary transition-colors">058.585.1999</a>
              </p>
              <p>
                Email: <a href="mailto:huangshanglobal@gmail.com" className="hover:text-primary transition-colors">huangshanglobal@gmail.com</a>
              </p>
              <p>
                Địa chỉ: <a 
                  href="https://maps.app.goo.gl/tYXyBhZNtMHchAFV6" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors"
                >
                  C38-30, Khu C Geleximco, Dương Nội, Hà Đông, Hà Nội
                </a>
              </p>
              <div className="flex space-x-4 mt-4">
                <a 
                  href="https://www.facebook.com/profile.php?id=61573060290311" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  Facebook
                </a>
                <a 
                  href="https://zalo.me/0389591238" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  Zalo
                </a>
              </div>
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