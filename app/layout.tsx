import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';
import Sidebar from '../components/Sidebar/Sidebar';
import Player from '../components/Player';
import Topbar from '@/components/Topbar/Topbar';

// const font = Inter({ subsets: ['latin'] });
const font = Lexend({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Breeze',
  description: 'Listen to music together.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='dark h-full'>
      <body
        className={`${font.className} flex h-full w-full select-none flex-col bg-black text-zinc-300`}
      >
        <div className='flex w-full flex-grow gap-2 overflow-hidden p-2 pb-0'>
          {/* This overflow hidden ensures overflow in children doesnt bubble upto this. */}
          <Sidebar />
          <div className='relative flex h-full flex-grow flex-col gap-2 overflow-auto'>
            {/*@ts-ignore*/}
            <Topbar />
            <div className='h-full w-full rounded-md border border-zinc-800 bg-zinc-950'>
              {children}
            </div>
          </div>
        </div>
        <Player />
      </body>
    </html>
  );
}
