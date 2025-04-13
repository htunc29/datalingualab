import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';  // JWT token'ı almak için yardımcı fonksiyon
import { NextRequest } from 'next/server';

export async function middleware(req) {
  // JWT token'ı kontrol et
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Token yoksa, yani kullanıcı giriş yapmamışsa
  if (!token) {
    // Oturumu olmayan kullanıcıyı login sayfasına yönlendir
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Eğer token varsa, kullanıcının erişimine izin ver
  return NextResponse.next();
}

export const config = {
  matcher: ['/about',  '/profile',"/survey"], // Bu sayfalara middleware uygulanacak
};
