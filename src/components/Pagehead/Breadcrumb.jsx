import { ArrowRightIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

const Breadcrumb = ({title}) => {
  return (
    <section className='w-full py-8  '>
            <div className="text-center py-10">
                <h2 className='font-bold  text-3xl'>
                    {title}
                </h2>
                <span className='text-sm mt-3 flex justify-between mx-auto max-w-fit'>
                    <Link href="/cart" className='text-blue-600'>Shopping Cart</Link> <ArrowRightIcon className='w-5 h-5' />  <Link href="/checkout" className='text-blue-600'>Checkout Page</Link> <ArrowRightIcon className='w-5 h-5' />  ORDER COMPLETE
                </span>
            </div>
    <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
        </section>
  )
}

export default Breadcrumb