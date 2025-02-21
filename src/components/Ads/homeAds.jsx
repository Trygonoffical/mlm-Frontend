'use client'
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";


const HomeAds = () => {
    const [advertisements, setAdvertisements] = useState([]);
    const [fullAdvertisements, setFullAdvertisements] = useState([]);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        fetchAdvertisements();
    }, []);

    const fetchAdvertisements = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/advertisements/?position=SIDEBAR`);
            const response2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/advertisements/?position=FULL_WIDTH`);
            const data = await response.json();
            const data2 = await response2.json();
            console.log('aads - ' , data)
            setAdvertisements(data);
            setFullAdvertisements(data2);
        } catch (error) {
            console.error('Error fetching advertisements:', error);
        } finally {
            setLoading(false);
        }  
    };

  return (
    <>
        <div className="max-w-7xl mx-auto px-4 py-8 md:flex md:justify-around" >
        {advertisements.map((ad )=>(
            
                <Link href={ad.link} key={ad.id}> 
                    <Image src={ad.image} width={512} height={120} className="w-full wx-auto " alt={ad.title} />
                </Link>
            
        ))}
        </div>
    
        {fullAdvertisements.map((ad )=>(
            <div className="max-w-7xl mx-auto py-8" key={ad.id}>
                <Link href={ad.link} > 
                    <Image src={ad.image} width={1144} height={45} className="w-full wx-auto " alt={ad.title} />
                </Link>
            </div>
        ))}
    </>
    
  )
}

export default HomeAds