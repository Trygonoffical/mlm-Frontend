'use client'
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";


const MLMAds = () => {
    // const [advertisements, setAdvertisements] = useState([]);
    const [fullAdvertisements, setFullAdvertisements] = useState([]);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        fetchAdvertisements();
    }, []);

    const fetchAdvertisements = async () => {
        try {
            const response2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/advertisements/?position=MLM_PANEL`);
            const data2 = await response2.json();
            // console.log('aads - ' , data)
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
            <div className="max-w-7xl mx-auto " key={ad.id}>
                <Link href={ad.link} > 
                    <Image src={ad.image} width={1144} height={45} className="w-full wx-auto " alt={ad.title} />
                </Link>
            </div>
        ))}
    </>
    
  )
}

export default MLMAds