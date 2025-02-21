// 'use client'

// import React, { useState, useEffect, useRef } from 'react';
// import { ChevronLeft, ChevronRight, Play, User, X } from 'lucide-react';
// import { Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,} from "@/components/ui/dialog";

// const SuccessAndReviews = () => {
//   const [currentSuccessSlide, setCurrentSuccessSlide] = useState(0);
//   const [currentReviewSlide, setCurrentReviewSlide] = useState(0);
//   const [isSmallScreen, setIsSmallScreen] = useState(false);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [touchStart, setTouchStart] = useState(null);
//   const [touchEnd, setTouchEnd] = useState(null);
  
//   const successSliderRef = useRef(null);
//   const reviewSliderRef = useRef(null);

//   const [successStories, setSuccessStories] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchData = async () => {
//           try {
//               const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/success-story/`);
//               const response2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer-pick/`);
//               if (!response.ok) throw new Error('Failed to fetch success Stories');
//               if (!response2.ok) throw new Error('Failed to fetch reviews');
//               const data = await response.json();
//               const data2 = await response2.json();
//               console.log('successStories - ',data2)
//               console.log('reviews - ',data)
//               setSuccessStories(data);
//               setReviews(data2);
//           } catch (error) {
//               console.error('Error fetching testimonials:', error);
//           } finally {
//               setLoading(false);
//           }
//       };
  
//       useEffect(() => {
//         fetchData();
//       }, []);
//   // Sample data
//   // const successStories = [
//   //   { id: 1, image: '/Images/thumbnale.png', title: 'Weight Loss Journey', description: 'Lost 30kg in 6 months' },
//   //   { id: 2, image: '/Images/thumbnale.png', title: 'Fitness Achievement', description: 'Marathon runner' },
//   //   { id: 3, image: '/Images/thumbnale.png', title: 'Health Transformation', description: 'Overcame health issues' },
//   //   { id: 4, image: '/Images/thumbnale.png', title: 'Business Success', description: 'Built successful team' },
//   // ];

//   // const reviews = [
//   //   { id: 1, videoUrl: 'https://youtube.com/shorts/L1La3xIrHlA?si=4alGCUiH0yBWs2Gz', thumbnail: '/Images/thumbnale.png', username: 'John Doe' },
//   //   { id: 2, videoUrl: 'https://youtube.com/shorts/L1La3xIrHlA?si=4alGCUiH0yBWs2Gz', thumbnail: '/Images/thumbnale.png', username: 'Jane Smith' },
//   //   { id: 3, videoUrl: 'https://youtube.com/shorts/L1La3xIrHlA?si=4alGCUiH0yBWs2Gz', thumbnail: '/Images/thumbnale.png', username: 'Mike Johnson' },
//   //   { id: 4, videoUrl: 'https://youtube.com/shorts/L1La3xIrHlA?si=4alGCUiH0yBWs2Gz', thumbnail: '/Images/thumbnale.png', username: 'Sarah Williams' },
//   // ];

//   useEffect(() => {
//     const handleResize = () => {
//       setIsSmallScreen(window.innerWidth < 768);
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Touch handlers
//   const handleTouchStart = (e) => {
//     setTouchEnd(null);
//     setTouchStart(e.targetTouches[0].clientX);
//   };

//   const handleTouchMove = (e) => {
//     setTouchEnd(e.targetTouches[0].clientX);
//   };

//   // Add this helper function to convert YouTube URL to embed URL
//   const getYouTubeEmbedUrl = (url) => {
//     try {
//       // Handle youtube.com/watch?v= format
//       if (url.includes('youtube.com/watch?v=')) {
//         const videoId = new URL(url).searchParams.get('v');
//         return `https://www.youtube.com/embed/${videoId}`;
//       }
//       // Handle youtu.be/ format
//       else if (url.includes('youtu.be/')) {
//         const videoId = url.split('youtu.be/')[1].split('?')[0];
//         return `https://www.youtube.com/embed/${videoId}`;
//       }
//       // Handle youtube.com/shorts/ format
//       else if (url.includes('youtube.com/shorts/')) {
//         const videoId = url.split('shorts/')[1].split('?')[0];
//         return `https://www.youtube.com/embed/${videoId}`;
//       }
//       return url;
//     } catch (error) {
//       console.error('Error parsing YouTube URL:', error);
//       return url;
//     }
//   };

//   const handleTouchEnd = (items, currentSlide, setSlide) => {
//     if (!touchStart || !touchEnd) return;
    
//     const distance = touchStart - touchEnd;
//     const isLeftSwipe = distance > 50;
//     const isRightSwipe = distance < -50;

//     if (isLeftSwipe) {
//       setSlide(currentSlide === items.length - 1 ? 0 : currentSlide + 1);
//     }
//     if (isRightSwipe) {
//       setSlide(currentSlide === 0 ? items.length - 1 : currentSlide - 1);
//     }
//   };

//   // Navigation functions
//   const navigate = (direction, currentSlide, setSlide, items) => {
//     if (direction === 'next') {
//       setSlide(currentSlide === items.length - 1 ? 0 : currentSlide + 1);
//     } else {
//       setSlide(currentSlide === 0 ? items.length - 1 : currentSlide - 1);
//     }
//   };

//   const renderSlider = (items, currentSlide, type, sliderRef) => {
//     return (
//       <div className="relative overflow-hidden">
//         <div
//           ref={sliderRef}
//           className={`flex transition-transform duration-300 ease-in-out ${isSmallScreen ? 'touch-pan-y' : ''}`}
//           style={{ 
//             transform: isSmallScreen ? `translateX(-${currentSlide * 100}%)` : 'none',
//             display: isSmallScreen ? 'flex' : 'grid',
//             gridTemplateColumns: isSmallScreen ? 'none' : 'repeat(4, 1fr)',
//             gap: '1.5rem'
//           }}
//           onTouchStart={isSmallScreen ? handleTouchStart : undefined}
//           onTouchMove={isSmallScreen ? handleTouchMove : undefined}
//           onTouchEnd={isSmallScreen ? 
//             () => handleTouchEnd(
//               type === 'success' ? successStories : reviews,
//               type === 'success' ? currentSuccessSlide : currentReviewSlide,
//               type === 'success' ? setCurrentSuccessSlide : setCurrentReviewSlide
//             ) : undefined}
//         >
//           {items.map((item) => (
//             <div 
//               key={item.id}
//               className={`${isSmallScreen ? 'w-full flex-shrink-0' : ''} px-2`}
//             >
//               {type === 'success' ? renderSuccessCard(item) : renderReviewCard(item)}
//             </div>
//           ))}
//         </div>
        
//         {isSmallScreen && (
//           <>
//             <button
//               onClick={() => navigate(
//                 'prev',
//                 type === 'success' ? currentSuccessSlide : currentReviewSlide,
//                 type === 'success' ? setCurrentSuccessSlide : setCurrentReviewSlide,
//                 items
//               )}
//               className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10"
//             >
//               <ChevronLeft className="w-6 h-6" />
//             </button>
//             <button
//               onClick={() => navigate(
//                 'next',
//                 type === 'success' ? currentSuccessSlide : currentReviewSlide,
//                 type === 'success' ? setCurrentSuccessSlide : setCurrentReviewSlide,
//                 items
//               )}
//               className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10"
//             >
//               <ChevronRight className="w-6 h-6" />
//             </button>
//           </>
//         )}
//       </div>
//     );
//   };

//   // Card rendering functions remain the same
//   const renderSuccessCard = (story) => (
//     <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
//       <div 
//         className="aspect-square relative group cursor-pointer"
//         onClick={() => setSelectedVideo(story)}
//       >
//         <img 
//           src={story.thumbnail} 
//           alt={story.title} 
//           className="w-full h-full object-cover" 
//         />
//         <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex items-center justify-center">
//           <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
//             <Play className="w-8 h-8 text-white fill-white" />
//           </div>
//         </div>
//         <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
//           <h3 className="text-xl font-bold text-white mb-1">{story.title}</h3>
//           <p className="text-sm text-white line-clamp-2">{story.description}</p>
//         </div>
//       </div>
//     </div>
//   );

//   // Update the renderReviewCard function to use correct image field
//   const renderReviewCard = (review) => (
//     <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
//       <div 
//         className="aspect-square relative group cursor-pointer"
//         onClick={() => setSelectedVideo(review)}
//       >
//         <img 
//           src={review.thumbnail} 
//           alt={review.title} 
//           className="w-full h-full object-cover" 
//         />
//         <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex items-center justify-center">
//           <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
//             <Play className="w-8 h-8 text-white fill-white" />
//           </div>
//         </div>
//         <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
//           <div className="flex items-center gap-2 text-white">
//             <User className="w-5 h-5" />
//             <span>{review.title}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const getVideoUrl = (item) => {
//     // Check if the item is a success story or customer pick
//     const videoUrl = item.youtube_link;
//     return getYouTubeEmbedUrl(videoUrl);
//   };


//   return (
//      <div className="container mx-auto px-4 py-16 space-y-16">
//       {/* Success Stories Section */}
//       <section>
//         <h2 className="text-3xl font-bold text-center mb-10">Success Stories</h2>
//         {renderSlider(successStories, currentSuccessSlide, 'success', successSliderRef)}
//       </section>

//       {/* Customer Reviews Section */}
//       <section>
//         <h2 className="text-3xl font-bold text-center mb-10">Customer Picks & Reviews</h2>
//         {renderSlider(reviews, currentReviewSlide, 'review', reviewSliderRef)}
//       </section>

//       {/* Video Modal - Updated to handle both types */}
//       <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
//         <DialogContent className="sm:max-w-[800px] p-0 bg-black">
//           <DialogHeader className="sr-only">
//             <DialogTitle>
//               {selectedVideo ? `${selectedVideo.title}'s Video` : 'Video'}
//             </DialogTitle>
//           </DialogHeader>
          
//           <button
//             onClick={() => setSelectedVideo(null)}
//             className="absolute right-4 top-4 text-white hover:text-gray-300 z-10"
//             aria-label="Close video"
//           >
//             <X className="w-6 h-6" />
//           </button>
          
//           {selectedVideo && (
//             <div className="relative pt-[56.25%] w-full">
//               <iframe
//                 src={getVideoUrl(selectedVideo)}
//                 title={`${selectedVideo.title}'s video`}
//                 className="absolute top-0 left-0 w-full h-full"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//                 loading="lazy"
//               />
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default SuccessAndReviews;


'use client'

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, User, X } from 'lucide-react';
import { Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,} from "@/components/ui/dialog";

const SuccessAndReviews = () => {
  const [currentSuccessSlide, setCurrentSuccessSlide] = useState(0);
  const [currentReviewSlide, setCurrentReviewSlide] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const successSliderRef = useRef(null);
  const reviewSliderRef = useRef(null);

  const [successStories, setSuccessStories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/success-story/`);
      const response2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer-pick/`);
      if (!response.ok) throw new Error('Failed to fetch success Stories');
      if (!response2.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      const data2 = await response2.json();
      console.log('successStories - ', data);
      console.log('reviews - ', data2);
      setSuccessStories(data);
      setReviews(data2);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Updated function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url) => {
    try {
      if (!url) return '';
      
      let videoId = '';
      
      // Handle youtube.com/watch?v= format
      if (url.includes('youtube.com/watch?v=')) {
        videoId = new URL(url).searchParams.get('v');
      }
      // Handle youtu.be/ format
      else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      // Handle youtube.com/shorts/ format
      else if (url.includes('youtube.com/shorts/')) {
        videoId = url.split('shorts/')[1].split('?')[0];
      }
      // Handle youtube.com/embed/ format (already in embed format)
      else if (url.includes('youtube.com/embed/')) {
        // Return as is, it's already an embed URL
        return url;
      }
      
      if (!videoId) return url; // If we couldn't extract a video ID, return the original URL
      
      // Create secure embed URL with additional parameters for better security and compatibility
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&origin=${encodeURIComponent(window.location.origin)}`;
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return url;
    }
  };

  const handleTouchEnd = (items, currentSlide, setSlide) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setSlide(currentSlide === items.length - 1 ? 0 : currentSlide + 1);
    }
    if (isRightSwipe) {
      setSlide(currentSlide === 0 ? items.length - 1 : currentSlide - 1);
    }
  };

  // Navigation functions
  const navigate = (direction, currentSlide, setSlide, items) => {
    if (direction === 'next') {
      setSlide(currentSlide === items.length - 1 ? 0 : currentSlide + 1);
    } else {
      setSlide(currentSlide === 0 ? items.length - 1 : currentSlide - 1);
    }
  };

  const renderSlider = (items, currentSlide, type, sliderRef) => {
    if (loading || !items || items.length === 0) {
      return <div className="p-8 text-center">Loading...</div>;
    }
    
    return (
      <div className="relative overflow-hidden">
        <div
          ref={sliderRef}
          className={`flex transition-transform duration-300 ease-in-out ${isSmallScreen ? 'touch-pan-y' : ''}`}
          style={{ 
            transform: isSmallScreen ? `translateX(-${currentSlide * 100}%)` : 'none',
            display: isSmallScreen ? 'flex' : 'grid',
            gridTemplateColumns: isSmallScreen ? 'none' : 'repeat(4, 1fr)',
            gap: '1.5rem'
          }}
          onTouchStart={isSmallScreen ? handleTouchStart : undefined}
          onTouchMove={isSmallScreen ? handleTouchMove : undefined}
          onTouchEnd={isSmallScreen ? 
            () => handleTouchEnd(
              type === 'success' ? successStories : reviews,
              type === 'success' ? currentSuccessSlide : currentReviewSlide,
              type === 'success' ? setCurrentSuccessSlide : setCurrentReviewSlide
            ) : undefined}
        >
          {items.map((item) => (
            <div 
              key={item.id}
              className={`${isSmallScreen ? 'w-full flex-shrink-0' : ''} px-2`}
            >
              {type === 'success' ? renderSuccessCard(item) : renderReviewCard(item)}
            </div>
          ))}
        </div>
        
        {isSmallScreen && items.length > 1 && (
          <>
            <button
              onClick={() => navigate(
                'prev',
                type === 'success' ? currentSuccessSlide : currentReviewSlide,
                type === 'success' ? setCurrentSuccessSlide : setCurrentReviewSlide,
                items
              )}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigate(
                'next',
                type === 'success' ? currentSuccessSlide : currentReviewSlide,
                type === 'success' ? setCurrentSuccessSlide : setCurrentReviewSlide,
                items
              )}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    );
  };

  // Card rendering functions
  const renderSuccessCard = (story) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
      <div 
        className="aspect-square relative group cursor-pointer"
        onClick={() => setSelectedVideo(story)}
      >
        <img 
          src={story.thumbnail_url || story.thumbnail || '/Images/default-thumbnail.png'} 
          alt={story.title} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            e.target.src = '/Images/default-thumbnail.png';
            e.target.onerror = null;
          }}
        />
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <h3 className="text-xl font-bold text-white mb-1">{story.title}</h3>
          <p className="text-sm text-white line-clamp-2">{story.description}</p>
        </div>
      </div>
    </div>
  );

  const renderReviewCard = (review) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
      <div 
        className="aspect-square relative group cursor-pointer"
        onClick={() => setSelectedVideo(review)}
      >
        <img 
          src={review.thumbnail_url || review.thumbnail || '/Images/default-thumbnail.png'} 
          alt={review.title} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            e.target.src = '/Images/default-thumbnail.png';
            e.target.onerror = null;
          }}
        />
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center gap-2 text-white">
            <User className="w-5 h-5" />
            <span>{review.title}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const getVideoUrl = (item) => {
    // Check if the item has youtube_link property
    if (!item || !item.youtube_link) return '';
    return getYouTubeEmbedUrl(item.youtube_link);
  };

  return (
    <div className="container mx-auto px-4 py-16 space-y-16">
      {/* Success Stories Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">Success Stories</h2>
        {renderSlider(successStories, currentSuccessSlide, 'success', successSliderRef)}
      </section>

      {/* Customer Reviews Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">Customer Picks & Reviews</h2>
        {renderSlider(reviews, currentReviewSlide, 'review', reviewSliderRef)}
      </section>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-[800px] p-0 bg-black">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {selectedVideo ? `${selectedVideo.title}'s Video` : 'Video'}
            </DialogTitle>
          </DialogHeader>
          
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute right-4 top-4 text-white hover:text-gray-300 z-10"
            aria-label="Close video"
          >
            <X className="w-6 h-6" />
          </button>
          
          {selectedVideo && (
            <div className="relative pt-[56.25%] w-full">
              <iframe
                src={getVideoUrl(selectedVideo)}
                title={`${selectedVideo.title}'s video`}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuccessAndReviews;