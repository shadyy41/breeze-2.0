import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';
import Player from '../components/player/player';
import Topbar from '@/components/topbar/topbar';
import SidebarWrapper from '@/components/sidebar/sidebar-wrapper';
import { Toaster } from 'react-hot-toast';
import MobileNavbar from '@/components/mobile-navbar/mobile-navbar';
import { TooltipProvider } from '@/components/ui/tooltip';

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
        <Toaster
          position='top-center'
          toastOptions={{
            className: '',
            style: {
              background: '#09090b',
              color: '#E4E4E7',
              border: '1px solid #27272a',
              borderRadius: '6px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#DB2777',
                secondary: '#E4E4E7',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#E4E4E7',
              },
            },
          }}
        />
        <TooltipProvider>
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
        </TooltipProvider>
      </body>
    </html>
  );
}
