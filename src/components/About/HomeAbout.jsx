// import Image from 'next/image'
// import React from 'react'

// const HomeAbout = () => {
//   return (
//     <>
//     <div className='max-w-7xl p-4 lg:px-8 '>
//         <div className='grid grid-cols-2'>
//             <div>
//                 <Image src='/images/about.png' width={512} height={150} className='w-full h-auto' alt='about' />
//             </div>
//             <div>
//                 <h2>
//                 Our Business Objectives
//                 </h2>
//                 <p>
//                 Our target market includes health-conscious individuals aged 18-70 who are interested in improving their well-being and exploring new opportunities for financial growth. Our goal is to help people who are struggling with their weight find ease and confidence in their personal and work lives. Our supplements are crafted to support fat burning and make losing weight simpler, so you can feel great and thrive every day. This demographic typically values high-quality products and is motivated by personal development and the potential for earning supplemental income. Key segments include:
//                 </p>
//                 <button>
//                     Start Your Business
//                 </button>
//             </div>
//         </div>
//         <div>
//             <p>
//             Fitness Buffs: Those engaged in regular physical activity who are interested in products that support their fitness goals. Our supplements are crafted to enhance weight loss and body fitness. They support muscle growth, boost metabolism, and aid recovery, helping you achieve peak performance and sculpt your ideal physique. Maximize your workouts and stay on track with your fitness goals effortlessly.

//             Health Enthusiasts: Individuals actively seeking supplements and wellness products to enhance their lifestyle.

//             Working Professionals: People looking for flexible income opportunities that fit around their existing commitments. And we are providing some supplement for busy professionals people, our supplements are designed to fit seamlessly into your hectic life. They help with weight loss by boosting metabolism, controlling cravings, and supporting overall body fitness. Enjoy sustained energy and convenience, making it easier to stay on track with your health goals even with a demanding schedule.

//             Health First Network: A prominent MLM company with a robust distributor network. We differentiate ourselves through a more modern compensation plan and a focus on sustainability and product purity.

//             Fit Life MLM: Focused on fitness and nutritional products. Herbal power Marketing Pvt. Ltd. stands out by offering a broader range of products and a more inclusive distributor support system.
//             </p>
//         </div>
//     </div>
        
//     </>
//   )
// }

// export default HomeAbout

import React from 'react';
import { ArrowRight } from 'lucide-react';

const HomeAbout = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Main Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Section */}
        <div className="relative h-[400px] lg:h-auto">
          <img
            src="/images/about.png"
            alt="Herbal supplements with yellow flowers"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-[#517B54]">
            Our Business Objectives
          </h2>
          
          <p className="text-gray-700 leading-relaxed">
            Our target market includes health-conscious individuals aged 18-70 who are interested in improving their well-being and exploring new opportunities for financial growth. Our goal is to help people who are struggling with their weight find ease and confidence in their personal and work lives. Our supplements are crafted to support fat burning and make losing weight simpler, so you can feel great and thrive every day. This demographic typically values high-quality products and is motivated by personal development and the potential for earning supplemental income.
          </p>

          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-700 to-green-800 text-white rounded-md hover:opacity-90 transition-opacity">
            Start you business
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Key Segments */}
      <div className="space-y-8">
        <div className="bg-gray-50 p-6 rounded-lg">
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
        </div>
      </div>
    </div>
  );
};

export default HomeAbout;