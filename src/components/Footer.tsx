import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Github, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

function Footer() {
  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/victorjacob-/", label: "LinkedIn" },
  ];

  const contactInfo = [
    { icon: Mail, content: "vics.jacob@gmail.com", href: "mailto:vics.jacob@gmail.com" },
    { icon: Phone, content: "+33 6 52 43 41 66", href: "tel:+33652434166" },
    { icon: MapPin, content: "Vitry-sur-Seine, France", href: null }
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
          {/* Contact Info */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.content}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.content}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Copyright and Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 md:mb-0">
            © {new Date().getFullYear()} Victor Jacob • Tous droits réservés
          </p>
          <div className="flex gap-3">
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;