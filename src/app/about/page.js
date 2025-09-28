"use client";
import React from "react";
import { Target, Eye, Gem, FileText, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const About = () => {
  const router = useRouter();
  const handleSignIn = () => router.push("/sign-in");

  // Card animation variants
  const cardVariant = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.6 }
    },
  };

  // Container for staggered animation
  const containerVariant = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <div className="relative min-h-screen pt-20 bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Optional soothing gradient background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-b from-indigo-50 via-white to-indigo-50 animate-pulse-slow"></div>

      <div className="container mx-auto px-4 py-12 md:py-20">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            About CampusCart
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            CampusCart is your trusted platform to buy and sell second-hand items with fellow students. Our mission is to create a sustainable and community-driven marketplace that’s easy, safe, and affordable.
          </p>
        </motion.header>

        {/* Mission, Vision, Values */}
        <motion.section
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {[
            { icon: Target, title: "Our Mission", desc: "Empower students to save money and support sustainability by connecting buyers and sellers across campus." },
            { icon: Eye, title: "Our Vision", desc: "Build a trusted community marketplace where students can effortlessly exchange goods and foster meaningful connections." },
            { icon: Gem, title: "Our Values", desc: "Trust, affordability, community support, and environmental responsibility drive every interaction on CampusCart." }
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariant}
              className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-200 hover:-translate-y-1 hover:scale-105 transition-transform duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-indigo-100 rounded-full">
                <item.icon className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Legal Section */}
        <motion.section
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-8 mb-20"
        >
          {[
            { icon: FileText, title: "Terms & Conditions", content: [
              "Welcome to CampusCart! By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions.",
              "Account Responsibility: You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.",
              "Peer-to-Peer Transactions: CampusCart is a facilitator for transactions. We are not responsible for the quality, safety, or legality of items exchanged.",
              "Prohibited Items: Selling illegal, unsafe, or prohibited items is strictly forbidden and may result in account suspension.",
              "Platform Use: You must not use the platform for spamming, harassment, or any activity that violates applicable laws."
            ] },
            { icon: Lock, title: "Privacy Policy", content: [
              "CampusCart is committed to protecting your privacy. We collect and use your information responsibly to provide and improve our services.",
              "Information Collection: We collect information you provide during registration, item listing, and communication on the platform.",
              "Use of Information: Your information is used to facilitate transactions, provide customer support, and improve user experience. We do not sell your personal data.",
              "Data Security: We implement industry-standard security measures to protect your personal data from unauthorized access."
            ] }
          ].map((section, index) => (
            <motion.div key={index} variants={cardVariant} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <section.icon className="w-8 h-8 text-indigo-600 flex-shrink-0"/>
                <h3 className="text-2xl font-bold text-slate-900">{section.title}</h3>
              </div>
              <div className="space-y-2 text-slate-600 text-sm">
                {section.content.map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <h2 className="text-3xl font-bold text-slate-900">Ready to Get Started?</h2>
          <p className="mt-2 text-slate-600 max-w-md mx-auto">
            Join thousands of students who are saving money and making connections on campus.
          </p>
          <div className="mt-6">
            <motion.button
              onClick={handleSignIn}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300"
            >
              Join CampusCart Today
            </motion.button>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default About;
