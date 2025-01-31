'use client'

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const HomeAbout = () => {
  const [homeAbout, setHomeAbout] = useState([]);
  const [loading, setLoading] = useState(true);
        
    const fetchAbout = async () => {
      try {
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/about/1/`, {
          });
          
          if (!response.ok) throw new Error('Failed to fetch about content');
          
          const data = await response.json();
          setHomeAbout(data);
          console.log('about - ' , data)
      } catch (error) {
          console.error('Error:', error);
          
      } finally {
          setLoading(false);
      }
  };
        
   useEffect(() => {
    fetchAbout();
      }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Main Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Section */}
        <div className="relative h-[400px] lg:h-auto">
          <img
            src={homeAbout.left_image}
            alt="Herbal supplements with yellow flowers"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-[#517B54]">
            {homeAbout.title}
          </h2>
          
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: homeAbout.content }} />
           

          <a href='/about' className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-700 to-green-800 text-white rounded-md hover:opacity-90 transition-opacity">
            Start you business
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Key Segments */}
      <div className="space-y-8">
        <div  dangerouslySetInnerHTML={{ __html: homeAbout.feature_content}} />

        {/* <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-[#517B54]">Fitness Buffs:</h3>
          <p className="text-gray-700 leading-relaxed">
            Those engaged in regular physical activity who are interested in products that support their fitness goals. Our supplements are crafted to enhance weight loss and body fitness. They support muscle growth, boost metabolism, and aid recovery, helping you achieve peak performance and sculpt your ideal physique. Maximize your workouts and stay on track with your fitness goals effortlessly.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-[#517B54]">Health Enthusiasts:</h3>
          <p className="text-gray-700 leading-relaxed">
            Individuals actively seeking supplements and wellness products to enhance their lifestyle.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-[#517B54]">Working Professionals:</h3>
          <p className="text-gray-700 leading-relaxed">
            People looking for flexible income opportunities that fit around their existing commitments. And we are providing some supplement for busy professionals people, our supplements are designed to fit seamlessly into your hectic life. They help with weight loss by boosting metabolism, controlling cravings, and supporting overall body fitness. Enjoy sustained energy and convenience, making it easier to stay on track with your health goals even with a demanding schedule.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-[#517B54]">Health First Network:</h3>
          <p className="text-gray-700 leading-relaxed">
            A prominent MLM company with a robust distributor network. We differentiate ourselves through a more modern compensation plan and a focus on sustainability and product purity.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-[#517B54]">Fit Life MLM:</h3>
          <p className="text-gray-700 leading-relaxed">
            Focused on fitness and nutritional products. Herbal power Marketing Pvt. Ltd. stands out by offering a broader range of products and a more inclusive distributor support system.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default HomeAbout;