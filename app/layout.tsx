import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';
import Player from '../components/player/player';
import Topbar from '@/components/topbar/topbar';
import SidebarWrapper from '@/components/sidebar/sidebar-wrapper';
import { Toaster } from '@/components/ui/toaster';
import MobileNavbar from '@/components/mobile-navbar/mobile-navbar';

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
        className={`${font.className} flex h-full w-full select-none flex-col bg-black text-zinc-300 md:p-2 md:pb-0`}
      >
        <Toaster />
        <div className='flex w-full flex-grow gap-2 overflow-hidden'>
          {/* This overflow hidden ensures overflow in children doesnt bubble upto this. */}
          {/*@ts-ignore*/}
          <SidebarWrapper />
          <div className='relative flex h-full flex-grow flex-col md:gap-2'>
            {/*@ts-ignore*/}
            <Topbar />
            <div className='h-full w-full overflow-hidden bg-zinc-950 md:rounded-md md:border md:border-zinc-800'>
              {children}
            </div>
          </div>
        </div>
        <Player />
        <MobileNavbar />
      </body>
    </html>
  );
}
