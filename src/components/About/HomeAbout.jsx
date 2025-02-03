'use client'

import { ArrowRight } from 'lucide-react';
import { useHomeData } from '@/hooks/useHomeData';

const HomeAbout = () => {
      const about = useHomeData('about');
      if (about.loading) {
          return <div>Loading...</div>;
      }
      // Find the specific page with matching slug
      const homeAbout = about.data.find(page => page.type === 'HOME');
      
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
      </div>
    </div>
  );
};

export default HomeAbout;