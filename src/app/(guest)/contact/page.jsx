'use client'

import React, { useState } from 'react';
import { Mail, Phone, Truck, Send, MapPin } from 'lucide-react';
import PageHead from '@/components/Pagehead/PageHead';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const shippingBenefits = [
    { id: 1, title: "Free Shipping", description: "Free shipping all over the Delhi" },
    { id: 2, title: "Free Shipping", description: "Free shipping all over the Delhi" },
    { id: 3, title: "Free Shipping", description: "Free shipping all over the Delhi" },
    { id: 4, title: "Free Shipping", description: "Free shipping all over the Delhi" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {/* <div className="bg-gradient-to-r from-[#8B6D4D] to-[#517B54] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Contact Us
          </h1>
        </div>
      </div> */}
      <PageHead title={'Contact Us'} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in touch with us</h2>
              <p className="text-gray-600 mb-8">
                We're here to help and answer any question you might have. We look forward to hearing from you.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email Contacts */}
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <a href="mailto:Email@emailaddress.com" className="block text-lg hover:text-green-600 transition-colors">
                    Email@emailaddress.com
                  </a>
                  <a href="mailto:Email@emailaddress.com" className="block text-lg hover:text-green-600 transition-colors">
                    Email@emailaddress.com
                  </a>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <a href="tel:+919999999999" className="block text-lg hover:text-green-600 transition-colors">
                    +91 9999999999
                  </a>
                  <a href="tel:+919999999999" className="block text-lg hover:text-green-600 transition-colors">
                    +91 9999999999
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-lg">
                    123 Business Street, New Delhi, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-100 p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold mb-2">Make Custom Request</h3>
            <p className="text-gray-600 mb-6">
              We're here to help answer your questions about Herbal Power and the products we run.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />

              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Now
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Shipping Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {shippingBenefits.map((benefit) => (
            <div
              key={benefit.id}
              className="bg-green-600 text-white p-6 rounded-xl flex items-center gap-4 hover:bg-green-700 transition-colors"
            >
              <div className="bg-white/20 p-3 rounded-full">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">{benefit.title}</h4>
                <p className="text-sm text-white/80">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;