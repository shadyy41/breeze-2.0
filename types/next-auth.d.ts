import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    supabaseAccessToken?: string;
    user: {
      name: string;
      image: string;
      id: string;
      admin: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    admin?: boolean;
  }
}
