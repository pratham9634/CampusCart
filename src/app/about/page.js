"use client"
import React from 'react';
import { Target, Eye, Gem, ShieldCheck, FileText, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

const About = () => {
   const router = useRouter();

  const handleSignIn = () => {
    router.push('/sign-in'); // 4. Navigate to your sign-in page
  };
  return (

    <div className="min-h-screen pt-20 bg-slate-50 font-sans text-slate-800">
      <div className="container mx-auto px-4 py-12 md:py-20">

        {/* --- Header Section --- */}
        <header className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            About CampusCart
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            CampusCart is your trusted platform to buy and sell second-hand items with fellow students. Our mission is to create a sustainable and community-driven marketplace that’s easy, safe, and affordable.
          </p>
        </header>

        {/* --- Mission, Vision, Values Section --- */}
        <section className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Mission Card */}
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-200 hover:-translate-y-1 transition-transform duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-indigo-100 rounded-full">
              <Target className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Our Mission</h3>
            <p className="text-slate-600">
              Empower students to save money and support sustainability by connecting buyers and sellers across campus.
            </p>
          </div>

          {/* Vision Card */}
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-200 hover:-translate-y-1 transition-transform duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-indigo-100 rounded-full">
              <Eye className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Our Vision</h3>
            <p className="text-slate-600">
              Build a trusted community marketplace where students can effortlessly exchange goods and foster meaningful connections.
            </p>
          </div>

          {/* Values Card */}
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-200 hover:-translate-y-1 transition-transform duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-indigo-100 rounded-full">
              <Gem className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Our Values</h3>
            <p className="text-slate-600">
              Trust, affordability, community support, and environmental responsibility drive every interaction on CampusCart.
            </p>
          </div>
        </section>

        {/* --- Legal Section --- */}
        <section className="max-w-3xl mx-auto">
           <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
              Platform Guidelines
            </h2>
          <div className="space-y-8">
              {/* Terms & Conditions */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-md">
                <div className="flex items-center gap-4 mb-4">
                    <FileText className="w-8 h-8 text-indigo-600 flex-shrink-0"/>
                    <h3 className="text-2xl font-bold text-slate-900">Terms & Conditions</h3>
                </div>
                <div className="space-y-3 text-slate-600 text-sm">
                  <p>Welcome to CampusCart! By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions.</p>
                  <ul className="list-disc list-inside space-y-2 pl-2">
                    <li><strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.</li>
                    <li><strong>Peer-to-Peer Transactions:</strong> CampusCart is a facilitator for transactions. We are not responsible for the quality, safety, or legality of items exchanged.</li>
                    <li><strong>Prohibited Items:</strong> Selling illegal, unsafe, or prohibited items is strictly forbidden and may result in account suspension.</li>
                    <li><strong>Platform Use:</strong> You must not use the platform for spamming, harassment, or any activity that violates applicable laws.</li>
                  </ul>
                </div>
              </div>

              {/* Privacy Policy */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-md">
                 <div className="flex items-center gap-4 mb-4">
                    <Lock className="w-8 h-8 text-indigo-600 flex-shrink-0"/>
                    <h3 className="text-2xl font-bold text-slate-900">Privacy Policy</h3>
                </div>
                <div className="space-y-3 text-slate-600 text-sm">
                  <p>CampusCart is committed to protecting your privacy. We collect and use your information responsibly to provide and improve our services.</p>
                  <ul className="list-disc list-inside space-y-2 pl-2">
                    <li><strong>Information Collection:</strong> We collect information you provide during registration, item listing, and communication on the platform.</li>
                    <li><strong>Use of Information:</strong> Your information is used to facilitate transactions, provide customer support, and improve user experience. We do not sell your personal data.</li>
                    <li><strong>Data Security:</strong> We implement industry-standard security measures to protect your personal data from unauthorized access.</li>
                  </ul>
                </div>
              </div>
          </div>
        </section>

        {/* --- Call to Action Section --- */}
        <section className="text-center mt-20">
          <h2 className="text-3xl font-bold text-slate-900">Ready to Get Started?</h2>
          <p className="mt-2 text-slate-600 max-w-md mx-auto">
            Join thousands of students who are saving money and making connections on campus.
          </p>
          <div className="mt-6">
            <button 
            onClick={handleSignIn}
            className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
              Join CampusCart Today
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;