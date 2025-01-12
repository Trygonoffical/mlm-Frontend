import { XMarkIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'

export default function TopBar() {
  return (
    <div className="w-full bg-gradient-to-r from-[#204866] to-[#257449] py-2 sticky top-0 z-[10]">
      <div className="mx-auto flex  justify-between max-w-7xl px-4 lg:px-8">
        <div className='flex  justify-start space-x-4'>
            <Link href='/auth/login' className='text-white'> Member Login ?</Link>
            <Link href='#' className='text-white hidden md:block'> info@testing.com </Link>
        </div>
        <div className='flex justify-center space-x-2'>
            <Link href='#'>
                <Image src='/images/facebook-logo.png' width={20} height={20}  alt='facebook' />
            </Link><Link href='#'>
                <Image src='/images/instagram.png' width={20} height={20}  alt='instagram' />
            </Link><Link href='#'>
                <Image src='/images/youtube.png' width={20} height={20}  alt='youtube' />
            </Link><Link href='#'>
                <Image src='/images/twitter.png' width={20} height={20}  alt='twitter' />
            </Link>
        </div>
      </div>
    </div>
  )
}
