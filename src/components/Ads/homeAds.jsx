'use client'
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";


const HomeAds = () => {
    const [advertisements, setAdvertisements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdvertisements();
    }, []);

    const fetchAdvertisements = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/advertisements/`);
            const data = await response.json();
            console.log('aads - ' , data)
            setAdvertisements(data);
        } catch (error) {
            console.error('Error fetching advertisements:', error);
        } finally {
            setLoading(false);
        }  
    };

    const allAds = [
        {
            url: '#',
            img: '/Sliders/ads.png',
            name: 'ads'
        },
        {
            url: '#',
            img: '/Sliders/ads.png',
            name: 'ads'
        },
    ]
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:flex md:justify-around">
        {advertisements.map((ad )=>(
            <Link href={ad.link} key={ad.position}> 
                <Image src={ad.image} width={512} height={120} className="w-full wx-auto " alt={ad.title} />
            </Link>
        ))}
    </div>
  )
}

export default HomeAds