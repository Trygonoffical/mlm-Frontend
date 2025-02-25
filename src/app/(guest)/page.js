import HomeAbout from "@/components/About/HomeAbout";
import HomeAds from "@/components/Ads/homeAds";
import HomeBlogSlider from "@/components/Blogs/guest/HomeBlogSlider";
import  HomeCats  from "@/components/Categories/HomeCats";
import BestSelling from "@/components/Products/HomeProducts";
import HomeSticky from "@/components/Products/HomeSticky";
import HeroSlider from "@/components/Sliders/HeroSlider";
import SuccessAndReviews from "@/components/Stories/homestories";
import TestimonialSection from "@/components/Testimonials/HomeTest";


export default function Home() {
  return (
    < >
   
    <HeroSlider />
    <HomeCats />
    <HomeAds />
    <BestSelling />
    <HomeSticky />
    <HomeAbout />
    <TestimonialSection />
    <SuccessAndReviews />
    <HomeBlogSlider />
    </>
  );
}
