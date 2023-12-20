'use client';
import { PiArrowLeft, PiArrowRight } from 'react-icons/pi';
import { useRouter } from 'next/navigation';


const Navigation = () => {
  const router = useRouter();

  return (
    <nav className='flex gap-1'>
      <button
        className='flex aspect-square h-10 items-center justify-center rounded-full border-2 border-zinc-800 bg-zinc-900 transition-colors hover:border-pink-600 hover:text-zinc-200'
        onClick={() => router.back()}
      >
        <PiArrowLeft className='text-lg' />
      </button>
      <button
        className='flex aspect-square h-10 items-center justify-center rounded-full border-2 border-zinc-800 bg-zinc-900 transition-colors hover:border-pink-600 hover:text-zinc-200'
        onClick={() => router.forward()}
      >
        <PiArrowRight className='text-lg' />
      </button>
    </nav>
  )
}

export default Navigation