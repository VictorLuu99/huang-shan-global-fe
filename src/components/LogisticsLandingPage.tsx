"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
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
  TrendingUp
} from "lucide-react";

// Count Up Component
interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
}

const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 2,
  className = "",
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, {
    damping: 20 + 40 * (1 / duration),
    stiffness: 100 * (1 / duration),
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = from.toString();
    }
  }, [from]);

  useEffect(() => {
    if (isInView) {
      motionValue.set(to);
    }
  }, [isInView, motionValue, to]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString();
      }
    });
    return () => unsubscribe();
  }, [springValue]);

  return <span className={className} ref={ref} />;
};

// Animated Grid Pattern Component
interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
}

const AnimatedGridPattern: React.FC<AnimatedGridPatternProps> = ({
  width = 40,
  height = 40,
  numSquares = 50,
  className = "",
  maxOpacity = 0.5,
  duration = 4,
}) => {
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState<Array<{ id: number; pos: [number, number] }>>([]);

  const getPos = (): [number, number] => [
    Math.floor((Math.random() * dimensions.width) / width),
    Math.floor((Math.random() * dimensions.height) / height),
  ];

  const generateSquares = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      pos: getPos(),
    }));
  };

  const updateSquarePosition = (id: number) => {
    setSquares((currentSquares) =>
      currentSquares.map((sq) =>
        sq.id === id ? { ...sq, pos: getPos() } : sq
      )
    );
  };

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions, numSquares]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    const currentRef = containerRef.current;
    if (currentRef) {
      resizeObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full fill-sage-400/30 stroke-sage-400/30 ${className}`}
    >
      <defs>
        <pattern
          id="grid-pattern"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" strokeDasharray={0} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      <svg className="overflow-visible">
        {squares.map(({ pos: [x, y], id }, index) => (
          <motion.rect
            key={`${x}-${y}-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1,
              delay: index * 0.1,
              repeatType: "reverse",
            }}
            onAnimationComplete={() => updateSquarePosition(id)}
            width={width - 1}
            height={height - 1}
            x={x * width + 1}
            y={y * height + 1}
            fill="currentColor"
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  );
};

// Logo Carousel Component
interface Logo {
  name: string;
  id: number;
  img: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const distributeLogos = (allLogos: Logo[], columnCount: number): Logo[][] => {
  const shuffled = shuffleArray(allLogos);
  const columns: Logo[][] = Array.from({ length: columnCount }, () => []);

  shuffled.forEach((logo, index) => {
    columns[index % columnCount].push(logo);
  });

  const maxLength = Math.max(...columns.map((col) => col.length));
  columns.forEach((col) => {
    while (col.length < maxLength) {
      col.push(shuffled[Math.floor(Math.random() * shuffled.length)]);
    }
  });

  return columns;
};

const LogoColumn: React.FC<{
  logos: Logo[];
  index: number;
  currentTime: number;
}> = React.memo(function LogoColumn({ logos, index, currentTime }) {
  const cycleInterval = 2000;
  const columnDelay = index * 200;
  const adjustedTime = (currentTime + columnDelay) % (cycleInterval * logos.length);
  const currentIndex = Math.floor(adjustedTime / cycleInterval);
  const CurrentLogo = logos[currentIndex].img;

  return (
    <motion.div
      className="relative h-14 w-24 overflow-hidden md:h-24 md:w-48"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${logos[currentIndex].id}-${currentIndex}`}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: "10%", opacity: 0, filter: "blur(8px)" }}
          animate={{
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
              mass: 1,
              bounce: 0.2,
              duration: 0.5,
            },
          }}
          exit={{
            y: "-20%",
            opacity: 0,
            filter: "blur(6px)",
            transition: {
              type: "tween",
              ease: "easeIn",
              duration: 0.3,
            },
          }}
        >
          <CurrentLogo className="h-20 w-20 max-h-[80%] max-w-[80%] object-contain md:h-32 md:w-32 text-sage-500" />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
});

const LogoCarousel: React.FC<{
  columnCount?: number;
  logos: Logo[];
}> = ({ columnCount = 3, logos }) => {
  const [logoSets, setLogoSets] = useState<Logo[][]>([]);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 100);
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const distributedLogos = distributeLogos(logos, columnCount);
    setLogoSets(distributedLogos);
  }, [logos, columnCount]);

  return (
    <div className="flex space-x-4 justify-center">
      {logoSets.map((logos, index) => (
        <LogoColumn
          key={index}
          logos={logos}
          index={index}
          currentTime={currentTime}
        />
      ))}
    </div>
  );
};

// Sample Logo Components
const FedExIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 40" {...props}>
    <rect width="100" height="40" fill="#4B0082" rx="4"/>
    <text x="50" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">FedEx</text>
  </svg>
);

const DHLIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 40" {...props}>
    <rect width="100" height="40" fill="#FFCC00" rx="4"/>
    <text x="50" y="25" textAnchor="middle" fill="#D40511" fontSize="12" fontWeight="bold">DHL</text>
  </svg>
);

const UPSIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 40" {...props}>
    <rect width="100" height="40" fill="#8B4513" rx="4"/>
    <text x="50" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">UPS</text>
  </svg>
);

const AmazonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 40" {...props}>
    <rect width="100" height="40" fill="#FF9900" rx="4"/>
    <text x="50" y="25" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Amazon</text>
  </svg>
);

const MaerskIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 40" {...props}>
    <rect width="100" height="40" fill="#0066CC" rx="4"/>
    <text x="50" y="25" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Maersk</text>
  </svg>
);

const TNTIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 40" {...props}>
    <rect width="100" height="40" fill="#FF6600" rx="4"/>
    <text x="50" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">TNT</text>
  </svg>
);

// Main Logistics Landing Page Component
const LogisticsLandingPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  // Get translations
  const t = useTranslations();

  const partnerLogos: Logo[] = [
    { name: "FedEx", id: 1, img: FedExIcon },
    { name: "DHL", id: 2, img: DHLIcon },
    { name: "UPS", id: 3, img: UPSIcon },
    { name: "Amazon", id: 4, img: AmazonIcon },
    { name: "Maersk", id: 5, img: MaerskIcon },
    { name: "TNT", id: 6, img: TNTIcon },
  ];

  const services = [
    {
      icon: Truck,
      title: t('services.groundTransportation.title'),
      description: t('services.groundTransportation.description')
    },
    {
      icon: Plane,
      title: t('services.airFreight.title'),
      description: t('services.airFreight.description')
    },
    {
      icon: Ship,
      title: t('services.oceanFreight.title'),
      description: t('services.oceanFreight.description')
    },
    {
      icon: Package,
      title: t('services.warehousing.title'),
      description: t('services.warehousing.description')
    },
    {
      icon: Globe,
      title: t('services.globalNetwork.title'),
      description: t('services.globalNetwork.description')
    },
    {
      icon: Shield,
      title: t('services.insurance.title'),
      description: t('services.insurance.description')
    }
  ];

  const stats = [
    { number: 50000, label: t('stats.shipmentsDelivered'), suffix: "+" },
    { number: 200, label: t('stats.countriesServed'), suffix: "+" },
    { number: 99, label: t('stats.onTimeDelivery'), suffix: "%" },
    { number: 24, label: t('stats.customerSupport'), suffix: "/7" }
  ];

  const whyChooseUs = [
    {
      icon: Clock,
      title: t('whyChooseUs.fastDelivery.title'),
      description: t('whyChooseUs.fastDelivery.description')
    },
    {
      icon: Shield,
      title: t('whyChooseUs.secureHandling.title'),
      description: t('whyChooseUs.secureHandling.description')
    },
    {
      icon: TrendingUp,
      title: t('whyChooseUs.costEffective.title'),
      description: t('whyChooseUs.costEffective.description')
    },
    {
      icon: Users,
      title: t('whyChooseUs.expertSupport.title'),
      description: t('whyChooseUs.expertSupport.description')
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-700 bg-clip-text text-transparent">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary-600 transition-colors">
                {t('hero.getQuote')}
              </button>
              <button className="px-8 py-4 border border-border rounded-lg text-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors">
                {t('hero.trackShipment')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('services.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-border"
              >
                <service.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('stats.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('stats.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-6xl font-bold text-primary mb-2">
                  <CountUp to={stat.number} duration={2} />
                  {stat.suffix}
                </div>
                <p className="text-muted-foreground text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('partners.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('partners.subtitle')}
            </p>
          </motion.div>

          <LogoCarousel columnCount={3} logos={partnerLogos} />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('whyChooseUs.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('whyChooseUs.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h2>
              <p className="text-xl text-muted-foreground">
                {t('contact.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('contact.phone')}</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('contact.email')}</h3>
                    <p className="text-muted-foreground">contact@logistics.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('contact.address')}</h3>
                    <p className="text-muted-foreground">123 Logistics Ave, Business District</p>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-background p-8 rounded-xl shadow-lg border border-border"
              >
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('contact.form.firstName')}</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('contact.form.lastName')}</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('contact.form.email')}</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('contact.form.company')}</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('contact.form.message')}</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background resize-none"
                        placeholder={t('contact.form.messagePlaceholder')}
                        required
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                    >
                      {t('contact.form.sendMessage')}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">{t('contact.form.thankYou')}</h3>
                    <p className="text-muted-foreground">
                      {t('contact.form.thankYouMessage')}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{t('footer.companyName')}</h3>
              <p className="text-muted-foreground">
                {t('footer.companyDescription')}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('footer.services')}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>{t('services.groundTransportation.title')}</li>
                <li>{t('services.airFreight.title')}</li>
                <li>{t('services.oceanFreight.title')}</li>
                <li>{t('services.warehousing.title')}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>{t('footer.aboutUs')}</li>
                <li>{t('footer.careers')}</li>
                <li>{t('footer.news')}</li>
                <li>{t('footer.contact')}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('footer.support')}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>{t('footer.helpCenter')}</li>
                <li>{t('footer.trackPackage')}</li>
                <li>{t('footer.shippingCalculator')}</li>
                <li>{t('footer.documentation')}</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LogisticsLandingPage;