'use client'

import { Target, Eye } from 'lucide-react';
import { useHomeData } from '@/hooks/useHomeData';

const AboutUs = () => {
    const about = useHomeData('about');
    
        if (about.loading) {
            return <div>Loading...</div>;
        }
        // Find the specific page with matching slug
        const homeAbout = about.data.find(page => page.type === 'MAIN');
       
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
              src={homeAbout.left_image}
              alt="Welcome to Herbal Power"
              className="w-full h-full object-cover rounded-2xl shadow-lg"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">
            {homeAbout.title}
            </h2>
            <div className="space-y-4 text-gray-600 whitespace-normal" dangerouslySetInnerHTML={{ __html: homeAbout.content }} />
             
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
            <div className="text-white/90 whitespace-normal" dangerouslySetInnerHTML={{ __html: homeAbout.vision_description }}  />
              
          </div>

          {/* Mission Card */}
          <div className="bg-[#517B54] text-white p-8 rounded-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Mission</h3>
            </div>
            <div className="text-white/90 whitespace-normal" dangerouslySetInnerHTML={{ __html: homeAbout.mission_description}}  />
          </div>
        </div>

        {/* Business Objectives */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Business Objectives</h2>
          <div className="space-y-6 text-gray-600">
            <div className="p-6 bg-gray-50 rounded-xl whitespace-normal" dangerouslySetInnerHTML={{ __html: homeAbout.objective_content}}  />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;