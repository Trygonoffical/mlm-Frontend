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

  // Sample data
  const successStories = [
    { id: 1, image: '/images/thumbnale.png', title: 'Weight Loss Journey', description: 'Lost 30kg in 6 months' },
    { id: 2, image: '/images/thumbnale.png', title: 'Fitness Achievement', description: 'Marathon runner' },
    { id: 3, image: '/images/thumbnale.png', title: 'Health Transformation', description: 'Overcame health issues' },
    { id: 4, image: '/images/thumbnale.png', title: 'Business Success', description: 'Built successful team' },
  ];

  const reviews = [
    { id: 1, videoUrl: 'https://youtube.com/shorts/L1La3xIrHlA?si=4alGCUiH0yBWs2Gz', thumbnail: '/images/thumbnale.png', username: 'John Doe' },
    { id: 2, videoUrl: 'https://youtube.com/shorts/L1La3xIrHlA?si=4alGCUiH0yBWs2Gz', thumbnail: '/images/thumbnale.png', username: 'Jane Smith' },
    { id: 3, videoUrl: 'https://youtube.com/shorts/L1La3xIrHlA?si=4alGCUiH0yBWs2Gz', thumbnail: '/images/thumbnale.png', username: 'Mike Johnson' },
    { id: 4, videoUrl: 'https://youtube.com/shorts/L1La3xIrHlA?si=4alGCUiH0yBWs2Gz', thumbnail: '/images/thumbnale.png', username: 'Sarah Williams' },
  ];

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
        
        {isSmallScreen && (
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

  // Card rendering functions remain the same
  const renderSuccessCard = (story) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
      <div className="aspect-square relative">
        <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
          <h3 className="text-xl font-bold mb-1">{story.title}</h3>
          <p className="text-sm">{story.description}</p>
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
        <img src={review.thumbnail} alt={review.username} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center gap-2 text-white">
            <User className="w-5 h-5" />
            <span>{review.username}</span>
          </div>
        </div>
      </div>
    </div>
  );

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
        <DialogContent className="max-w-4xl p-0 bg-black">
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute right-4 top-4 text-white hover:text-gray-300 z-10"
          >
            <X className="w-6 h-6" />
          </button>
          {selectedVideo && (
            <div className="aspect-video w-full">
              <iframe
                src={selectedVideo.videoUrl}
                title={`${selectedVideo.username}'s review`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuccessAndReviews;