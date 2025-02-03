'use client'
import { XMarkIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import { useHomeData } from '@/hooks/useHomeData';

export default function TopBar() {
  // Direct use of hook with key
  const companyInfo = useHomeData('companyInfo');

  if (companyInfo.loading) {
    return <div>Loading...</div>;
}

if (companyInfo.error) {
    return <div>Error: {companyInfo.error}</div>;
}


const { 
  facebook_link, 
    instagram_link, 
    twitter_link, 
    youtube_link 
} = companyInfo.data || {};
console.log('top babr con data - ' , companyInfo)
 
  return (
    <div className="w-full bg-gradient-to-r from-[#204866] to-[#257449] py-2 sticky top-0 z-[10]">
      <div className="mx-auto flex  justify-between max-w-7xl px-4 lg:px-8">
        <div className='flex  justify-start space-x-4'>

            <Link href='/auth/login' className='text-white'> Member Login ?</Link>
            {/* <Link href='#' className='text-white hidden md:block'> info@testing.com </Link> */}
        </div>
        <div className='flex justify-center space-x-2'>
            <Link href={facebook_link?facebook_link:'#'}>
                <Image src='/Images/facebook-logo.png' width={20} height={20}  alt='facebook' />
            </Link><Link href={instagram_link?instagram_link:'#'}>
                <Image src='/Images/instagram.png' width={20} height={20}  alt='instagram' />
            </Link><Link href={twitter_link?twitter_link:'#'}>
                <Image src='/Images/youtube.png' width={20} height={20}  alt='youtube' />
            </Link><Link href={youtube_link?youtube_link:'#'}>
                <Image src='/Images/twitter.png' width={20} height={20}  alt='twitter' />
            </Link>
        </div>
      </div>
    </div>
  )
}
