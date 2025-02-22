'use client'
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";


const CustomerAds = () => {
    const [fullAdvertisements, setFullAdvertisements] = useState([]);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        fetchAdvertisements();
    }, []);

    const fetchAdvertisements = async () => {
        try {
           
            const response2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/advertisements/?position=CUSTOMER_PANEL`);
            const data2 = await response2.json();
            setFullAdvertisements(data2);
        } catch (error) {
            console.error('Error fetching advertisements:', error);
        } finally {
            setLoading(false);
        }  
    };

  return (
    <>
        {fullAdvertisements.map((ad )=>(
            <div className="max-w-7xl mx-auto py-4" key={ad.id}>
                <Link href={ad.link} > 
                    <Image src={ad.image} width={1144} height={45} className="w-full wx-auto " alt={ad.title} />
                </Link>
            </div>
        ))}
    </>
    
  )
}

export default CustomerAds