import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    supabaseAccessToken?: string;
    user: {
      name: string;
      image: string;
      id: string;
      admin: boolean;
      upload_count: number;
    } & DefaultSession['user'];
  }

  interface User {
    admin?: boolean;
    upload_count?: number;
  }
}
