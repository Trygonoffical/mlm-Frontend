'use client'

import React from 'react';
import { Target, Eye } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#8B6D4D] to-[#517B54] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            About Us
          </h1>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] md:h-[500px]">
            <img
              src="/images/aboutbg.png"
              alt="Welcome to Herbal Power"
              className="w-full h-full object-cover rounded-2xl shadow-lg"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome to Herbal Power Marketing Pvt Ltd
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Where your health and financial well-being go hand in hand. Our premium natural-herbs health supplements are designed to enhance your vitality and overall wellness, using the finest natural ingredients and cutting-edge research. But we go beyond just health support – with you a unique opportunity to earn money by sharing these benefits with others. Take control of your journey as an entrepreneur, and take control of your future with Herbal Power Marketing Pvt Ltd.
              </p>
              <p>
                Experience wellness, achieve your goals, and build a brighter tomorrow with us. Nutraceuticals are products derived from food sources that offer additional health benefits beyond basic nutritional value. The term combines "nutrition" and "pharmaceutical," highlighting their dual role in promoting health and preventing disease. Manochi deals with a range of products such as:
              </p>
              <p>
                Dietary Supplements: These are concentrated sources of nutrients like vitamins, minerals, amino acids, or fatty acids, often taken in pill, capsule, or powder form.
              </p>
              <p>
                Functional Foods: These are foods enhanced with added nutrients or compounds, like fortified breakfast cereals, yogurt, which provide benefits beyond basic nutrition.
              </p>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {/* Vision Card */}
          <div className="bg-[#517B54] text-white p-8 rounded-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Vision</h3>
            </div>
            <p className="text-white/90">
              Our vision is to become a leading global MLM company recognized for transforming lives through opportunity and excellence. We aim to build an Herbal power Marketing Pvt. Ltd. Community where each member feels empowered to grow, succeed and make a positive impact on the world of Health, Wellness a new era of prosperity.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-[#517B54] text-white p-8 rounded-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Mission</h3>
            </div>
            <p className="text-white/90">
              At Herbal power marketing Pvt. Ltd., our mission is to inspire individuals to achieve their fullest potential through a powerful combination of exceptional products and a supportive Multi-Level Marketing environment. We are dedicated to fostering personal and professional growth by providing innovative solutions that enhance well-being and success.
            </p>
          </div>
        </div>

        {/* Business Objectives */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Business Objectives</h2>
          <div className="space-y-6 text-gray-600">
            <div className="p-6 bg-gray-50 rounded-xl">
              <p>
                Our target market includes health-conscious individuals aged 18-70 who are interested in improving their well-being and exploring new opportunities for financial growth. Our goal is to help people who are struggling with their weight find ease and confidence in their personal and work lives. Our supplements are crafted to support fat burning and make losing weight simpler, so you can feel great and thrive every day. This demographic typically values high-quality products and is motivated by personal development and the potential for earning supplemental income.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <p>
                Our target market includes health-conscious individuals aged 18-70 who are interested in improving their well-being and exploring new opportunities for financial growth. Our goal is to help people who are struggling with their weight find ease and confidence in their personal and work lives. Our supplements are crafted to support fat burning and make losing weight simpler, so you can feel great and thrive every day.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <p>
                Our target market includes health-conscious individuals aged 18-70 who are interested in improving their well-being and exploring new opportunities for financial growth. Our goal is to help people who are struggling with their weight find ease and confidence in their personal and work lives. Our supplements are crafted to support fat burning and make losing weight simpler.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;