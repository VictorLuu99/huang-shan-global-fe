"use client";

import React from "react";
import Image from "next/image";

type ContactLink = {
  href: string;
  label: string;
  bgClass: string;
  icon: React.ReactNode;
};

const IconPhone = () => (
  <Image src="/phone-icon.svg" alt="Facebook Messenger" width={40} height={40} className="h-10 w-10" />
);

const IconMessenger = () => (
  <Image src="/facebook-icon.svg" alt="Facebook Messenger" width={40} height={40} className="h-10 w-10" />
);

const IconZalo = () => (
  <Image src="/zalo-icon.svg" alt="Zalo" width={40} height={40} className="h-10 w-10" />
);

const IconMap = () => (
  <Image src="/maps-icon.svg" alt="Bản đồ" width={40} height={40} className="h-10 w-10" />
);

const ContactBar: React.FC = () => {
  // Defaults can be customized or wired to env vars later
  const links: ContactLink[] = [
    {
      href: "tel:+84901234567",
      label: "Gọi điện thoại",
      bgClass: "bg-white-500 hover:bg-white-600",
      icon: <IconPhone />,
    },
    {
      href: "https://www.facebook.com/profile.php?id=61573060290311",
      label: "Facebook Messenger",
      bgClass: "bg-white-500 hover:bg-white-600",
      icon: <IconMessenger />,
    },
    {
      href: "https://zalo.me/0901234567",
      label: "Zalo Chat",
      bgClass: "bg-white-500 hover:bg-white-600",
      icon: <IconZalo />,
    },
    {
      href: "https://maps.app.goo.gl/tYXyBhZNtMHchAFV6",
      label: "Bản đồ",
      bgClass:"bg-white-500 hover:bg-white-600",
      icon: <IconMap />,
    },
  ];

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
      {links.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={item.label}
          className={`${item.bgClass} text-white shadow-lg rounded-full p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-400`}
        >
          <span className="sr-only">{item.label}</span>
          {item.icon}
        </a>
      ))}
    </div>
  );
};

export default ContactBar;


