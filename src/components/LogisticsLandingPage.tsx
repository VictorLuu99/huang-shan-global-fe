"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useTranslation } from "../contexts/LanguageContext";
import { contactService } from "../services/contactService";
import { handleApiError } from "../services/api";
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
  Loader2,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

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

// Logo Carousel Component
interface Logo {
  name: string;
  id: number;
  img: string; // Changed to string for image path
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
  const adjustedTime =
    (currentTime + columnDelay) % (cycleInterval * logos.length);
  const currentIndex = Math.floor(adjustedTime / cycleInterval);
  const currentLogo = logos[currentIndex];

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
          <Image
            src={currentLogo.img}
            alt={currentLogo.name}
            width={128}
            height={80}
            className="h-20 w-20 max-h-[80%] max-w-[80%] object-contain md:h-32 md:w-32"
          />
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


// Main Logistics Landing Page Component
const LogisticsLandingPage: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  // Get translations
  const { t, currentLocale } = useTranslation();

  const partnerLogos: Logo[] = [
    { name: "Partner 1", id: 1, img: "/images/partners/doitac1.png" },
    { name: "Partner 2", id: 2, img: "/images/partners/doitac2.png" },
    { name: "Partner 3", id: 3, img: "/images/partners/doitac3.png" },
    { name: "Partner 4", id: 4, img: "/images/partners/doitac4.png" },
    { name: "Partner 5", id: 5, img: "/images/partners/doitac5.png" },
  ];

  const services = [
    {
      icon: Truck,
      title: t("services.groundTransportation.title"),
      description: t("services.groundTransportation.description"),
    },
    {
      icon: Plane,
      title: t("services.airFreight.title"),
      description: t("services.airFreight.description"),
    },
    {
      icon: Ship,
      title: t("services.oceanFreight.title"),
      description: t("services.oceanFreight.description"),
    },
    {
      icon: Package,
      title: t("services.warehousing.title"),
      description: t("services.warehousing.description"),
    },
    {
      icon: Globe,
      title: t("services.globalNetwork.title"),
      description: t("services.globalNetwork.description"),
    },
    {
      icon: Shield,
      title: t("services.insurance.title"),
      description: t("services.insurance.description"),
    },
  ];

  const stats = [
    { number: 20000, label: t("stats.shipmentsDelivered"), suffix: "+" },
    { number: 1500, label: t("stats.countriesServed"), suffix: "+" },
    { number: 1000, label: t("stats.onTimeDelivery"), suffix: "+" },
    { number: 300, label: t("stats.customerSupport"), suffix: "+" },
  ];

  const whyChooseUs = [
    {
      icon: Clock,
      title: t("whyChooseUs.fastDelivery.title"),
      description: t("whyChooseUs.fastDelivery.description"),
    },
    {
      icon: Shield,
      title: t("whyChooseUs.secureHandling.title"),
      description: t("whyChooseUs.secureHandling.description"),
    },
    {
      icon: TrendingUp,
      title: t("whyChooseUs.costEffective.title"),
      description: t("whyChooseUs.costEffective.description"),
    },
    {
      icon: Users,
      title: t("whyChooseUs.expertSupport.title"),
      description: t("whyChooseUs.expertSupport.description"),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      // Prepare data for API
      const submitData = {
        full_name: fullName,
        email: email,
        phone: phone,
        company: company,
        subject: 'Contact Form Submission - Home Page',
        message: message,
        priority: 'normal',
        language: currentLocale,
        status: 'pending'
      };
      
      // Validate form data
      const validation = contactService.validateContactForm(submitData);
      
      if (!validation.isValid) {
        const errorMessage = validation.errors.join(", ");
        addToast({
          type: "error",
          title: t("contact.form.validation_error"),
          message: errorMessage,
        });
        return;
      }
      
      // Submit to API
      const result = await contactService.submitContact(submitData);
      
      if (result.success) {
        // Show success message
        setSubmitted(true);
        
        // Reset form after successful submission
        setFullName("");
        setPhone("");
        setEmail("");
        setCompany("");
        setMessage("");
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('Contact form submission error:', errorMessage);
      // You can add toast notification here if you have a toast context
      alert(errorMessage); // Temporary error display
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section id="home" className="pt-16">
        <div className="container mx-auto px-4">
          <Image
            src="/images/background_home.png"
            alt="Huang Shan Global Logistics"
            width={1200}
            height={600}
            className="w-full h-auto object-contain rounded-lg"
            priority
          />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("services.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("services.subtitle")}
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("stats.title")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t("stats.subtitle")}
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("partners.title")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t("partners.subtitle")}
            </p>
          </motion.div>

          <LogoCarousel columnCount={5} logos={partnerLogos} />
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("whyChooseUs.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("whyChooseUs.subtitle")}
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
      <section id="contact" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {t("contact.title")}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t("contact.subtitle")}
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
                    <h3 className="font-semibold">{t("contact.info.phone")}</h3>
                    <div className="text-muted-foreground space-y-1">
                      <a href="tel:0389591238" className="block hover:text-primary transition-colors">
                        038.959.1238
                      </a>
                      <a href="tel:0585851999" className="block hover:text-primary transition-colors">
                        058.585.1999
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("contact.info.email")}</h3>
                    <a 
                      href="mailto:huangshanglobal@gmail.com" 
                      className="text-muted-foreground hover:text-primary transition-colors block"
                    >
                      huangshanglobal@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("contact.info.address")}</h3>
                    <a 
                      href="https://maps.app.goo.gl/tYXyBhZNtMHchAFV6" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors block"
                    >
                      C38-30, Khu C Geleximco, Dương Nội, Hà Đông, Hà Nội
                    </a>
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
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("contact.form.full_name")}
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background disabled:opacity-50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("contact.form.phone")}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background disabled:opacity-50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("contact.form.email")}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background disabled:opacity-50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("contact.form.company")}
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("contact.form.message")}
                      </label>
                      <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background resize-none disabled:opacity-50"
                        placeholder={t("contact.form.messagePlaceholder")}
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>{t("contact.form.sending")}</span>
                        </>
                      ) : (
                        <span>{t("contact.form.sendMessage")}</span>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">
                      {t("contact.form.thankYou")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("contact.form.thankYouMessage")}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LogisticsLandingPage;
