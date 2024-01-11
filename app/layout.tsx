import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';
import Player from '../components/player/player';
import Topbar from '@/components/topbar/topbar';
import SidebarWrapper from '@/components/sidebar/sidebar-wrapper';
import { Toaster } from '@/components/ui/toaster';

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
        className={`${font.className} flex h-full w-full select-none flex-col bg-black p-2 pb-0 text-zinc-300`}
      >
        <Toaster />
        <div className='flex w-full flex-grow gap-2 overflow-hidden'>
          {/* This overflow hidden ensures overflow in children doesnt bubble upto this. */}
          {/*@ts-ignore*/}
          <SidebarWrapper />
          <div className='relative flex h-full flex-grow flex-col gap-2'>
            {/*@ts-ignore*/}
            <Topbar />
            <div className='h-full w-full overflow-hidden rounded-md border border-zinc-800 bg-zinc-950'>
              {children}
            </div>
          </div>
        </div>
        <Player />
      </body>
    </html>
  );
}
