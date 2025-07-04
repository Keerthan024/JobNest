import React from "react";
import { motion } from "framer-motion";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";
import { assets } from "../assets/assets";

const Footer = () => {
  const socialLinks = [
    { icon: <FiFacebook size={20} />, name: "Facebook" },
    { icon: <FiTwitter size={20} />, name: "Twitter" },
    { icon: <FiInstagram size={20} />, name: "Instagram" },
    { icon: <FiLinkedin size={20} />, name: "LinkedIn" },
  ];

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      variants={footerVariants}
      className="bg-white border-t border-gray-100 py-12"
    >
      <div className="container mx-auto px-4 2xl:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo */}
          <motion.div
            custom={0}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
          >
            <img src={assets.logo} alt="Company Logo" className="h-8 w-auto" />
          </motion.div>

          {/* Copyright */}
          <motion.p
            custom={1}
            variants={itemVariants}
            className="text-gray-500 text-sm md:text-base text-center md:text-left flex-1 px-4 md:border-l md:border-gray-200"
          >
            © {new Date().getFullYear()} Keerthan.dev. All rights reserved.
          </motion.p>

          {/* Social Links */}
          <motion.div custom={2} variants={itemVariants} className="flex gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                custom={index + 3}
                variants={itemVariants}
                whileHover={{
                  y: -3,
                  color: "#3B82F6",
                }}
                whileTap={{ scale: 0.9 }}
                href="#"
                aria-label={social.name}
                className="text-gray-500 hover:text-blue-500 transition-colors p-2 rounded-full bg-gray-50 hover:bg-gray-100"
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Additional Links */}
        <motion.div
          custom={3}
          variants={itemVariants}
          className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-sm text-gray-500"
        >
          <motion.a
            whileHover={{ color: "#3B82F6" }}
            href="#"
            className="hover:text-blue-500 transition-colors"
          >
            Privacy Policy
          </motion.a>
          <motion.a
            whileHover={{ color: "#3B82F6" }}
            href="#"
            className="hover:text-blue-500 transition-colors"
          >
            Terms of Service
          </motion.a>
          <motion.a
            whileHover={{ color: "#3B82F6" }}
            href="#"
            className="hover:text-blue-500 transition-colors"
          >
            Contact Us
          </motion.a>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
