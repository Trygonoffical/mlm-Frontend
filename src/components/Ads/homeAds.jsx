import Image from "next/image"
import Link from "next/link"


const HomeAds = () => {
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
        {allAds.map((ad , idx)=>(
            <Link href={ad.url} key={idx}> 
                <Image src={ad.img} width={512} height={120} className="w-full wx-auto " alt={ad.name} />
            </Link>
        ))}
    </div>
  )
}

export default HomeAds