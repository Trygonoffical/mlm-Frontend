import React from 'react';
import { Phone, Mail } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {

    const socialLinks = [
        {
            icon: '/images/facebook-logo.png',
            link: '#',
            name: 'facebook'
        },
        {
            icon: '/images/instagram.png',
            link: '#',
            name: 'instagram'

        },
        {
            icon: '/images/youtube.png',
            link: '#',
            name: 'youtube'

        },
        {
            icon: '/images/twitter.png',
            link: '#',
            name: 'twitter'

        },
    ]


  return (
    <footer className="bg-[url('/Sliders/footerbg.png')] bg-no-repeat bg-cover">
      <div className="bg-gradient-to-r from-slate-700 to-green-800 text-white pt-12 pb-4 opacity-90">
          {/* Need Help Section */}
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-center mb-8">Need Help?</h2>
            
            {/* Contact Info Grid */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="flex items-center gap-3">
                <Phone className="w-8 h-8" />
                <div>
                  <p className="font-medium">+91 9999999999</p>
                  <p className="text-sm text-gray-300">(Mon-Fri, 10:00-7:00 IST)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <div>
                  <p className="font-medium">+91 9999999999</p>
                  <p className="text-sm text-gray-300">(Mon-Fri, 10:00-7:00 IST)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-8 h-8" />
                <div>
                  <p className="font-medium">Mail@google.com</p>
                  <p className="text-sm text-gray-300">(Mon-Fri, 10:00-7:00 IST)</p>
                </div>
              </div>
            </div>

            {/* Stay Connected Section */}
            <div className="text-center mb-12 ">
              <h3 className="text-xl font-semibold mb-4">Stay Connected</h3>
              <div className='flex justify-center'>
                <form action="" method="post">
                    <div className='flex mx-auto'>
                        <input
                        type="text"
                        placeholder="Search for Products......"
                        className="min-w-[150px]  md:min-w-[352px]   px-4 py-2 border-y border-r-0 border-t-0  border-l-0  border-gray-100 focus:outline-none text-gray-200 bg-transparent"
                        />
                        <button className="bg-white text-green-700 px-8 py-2 rounded-md hover:bg-gray-100 transition-colors -ml-5 text-sm md:text-base">
                            Suscribe
                        </button>
                    </div>
                </form>
              </div>
              
                
            </div>

            {/* Main Footer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Organization Column */}
              <div>
                <h4 className="font-semibold mb-4">Organization</h4>
                <ul className="space-y-2">
                  <li><a href="/about" className="hover:text-gray-300">About Us</a></li>
                  <li><a href="/contact" className="hover:text-gray-300">Contact Us</a></li>
                  <li><a href="/shop" className="hover:text-gray-300">Shop</a></li>
                  {Array(4).fill(0).map((_, i) => (
                    <li key={i}><a href="#" className="hover:text-gray-300">Menu</a></li>
                  ))}
                </ul>
              </div>

              {/* Userfull Tools Column */}
              <div>
                <h4 className="font-semibold mb-4">Userfull Tools</h4>
                <ul className="space-y-2">
                  {Array(6).fill(0).map((_, i) => (
                    <li key={i}><a href="#" className="hover:text-gray-300">Menu</a></li>
                  ))}
                </ul>
              </div>

              {/* Connect With Us Column */}
              <div>
                <h4 className="font-semibold mb-4">CONNECT WITH US</h4>
                <p className="mb-4">B-88, B Block, Sector 2, Noida, Uttar Pradesh 201301</p>
                <h5 className="font-semibold mb-3">Follow Us On</h5>
                <div className="flex gap-4">
                  {socialLinks.map((social , idx) => (
                    <a 
                      key={idx} 
                      href={social.link} 
                      className=" text-green-700 rounded-full   transition-colors"
                    >
                        <Image src={social.icon} width={20} height={20}  alt={social.name} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map Column */}
              <div className='w-full md:w-auto'>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.5007461610985!2d77.31112207555113!3d28.584750975690895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce45f16150aab%3A0x6fe40b4511945251!2sBasement%2C%20B%2C%2088%2C%20B%20Block%2C%20Sector%202%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1734870506818!5m2!1sen!2sin" width="auto" height="auto" className='w-full' allowFullScreen="" loading="lazy" ></iframe>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center border-t border-gray-600 pt-4">
              <p className="mb-4">© Copyright 2024. All Rights Reserved by Herbal Power Marketing Pvt Ltd.</p>
              <p className="text-xs text-gray-400">
                Disclaimer: Herbal Power Product are not intended to diagnose, treat, cure or prevent any disease, illness or pain. In compliance with applicable Laws. These results are not typical; individual results may vary from person to person.
              </p>
            </div>
          </div>
      </div>
      
    </footer>
  );
};

export default Footer;