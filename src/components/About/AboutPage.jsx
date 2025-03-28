'use client'

import { Target, Eye } from 'lucide-react';
import { useHomeData } from '@/hooks/useHomeData';
import styles from './About.module.css'; 
import RichContentRenderer from '../Editor/RichContentRenderer';
const AboutUs = () => {
    const about = useHomeData('about');
    
        if (about.loading) {
            return <div>Loading...</div>;
        }
        // Find the specific page with matching slug
        const homeAbout = about.data.find(page => page.type === 'MAIN');
        console.log('about data - ', homeAbout);
       
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#8B6D4D] to-[#517B54] py-16">
        <div className="container mx-auto px-4">
          <h1 className="uppercase text-4xl md:text-5xl font-bold text-white text-center">
            About Us
          </h1>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* h-[400px] md:h-[500px] */}
          <div className="relative ">
            <img
              src={homeAbout.left_image}
              alt="Welcome to Herbal Power"
              className="w-full h-full rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">
            {homeAbout.title}
            </h2>
            {/* <div  className={` space-y-4 text-gray-600 ${styles.aboutcontent}`}  dangerouslySetInnerHTML={{ __html: homeAbout.content }}  /> */}
            <RichContentRenderer 
              content={homeAbout.content} 
              className="text-gray-700 leading-relaxed"
            />
             
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
            {/* <div className={`text-white/90 ${styles.aboutcontent}`}  dangerouslySetInnerHTML={{ __html: homeAbout.vision_description }}   /> */}
            <RichContentRenderer 
              content={homeAbout.vision_description} 
              className="text-white/90 leading-relaxed"
            />
          </div>

          {/* Mission Card */}
          <div className="bg-[#517B54] text-white p-8 rounded-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Mission</h3>
            </div>
            {/* <div className={`text-white/90 ${styles.aboutcontent}`}  dangerouslySetInnerHTML={{ __html: homeAbout.mission_description}}  /> */}
            <RichContentRenderer 
              content={homeAbout.mission_description} 
              className="text-white/90 leading-relaxed"
            />
          </div>
        </div>

        {/* Business Objectives */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Business Objectives</h2>
          <div className="space-y-6 text-gray-600">
            {/* <div className={`text-gray-600 ${styles.aboutcontent}`}  dangerouslySetInnerHTML={{ __html: homeAbout.objective_content}}  /> */}
            <RichContentRenderer 
              content={homeAbout.objective_content} 
              className="text-gray-700 leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;