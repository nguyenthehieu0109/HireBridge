import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware in Next.js runs on the server side (Edge). 
  // We can't access localStorage here. We'd normally use cookies.
  // Since we used localStorage for the MVP, this middleware won't work as expected 
  // without cookies. 
  
  // TO DISABLE UNTIL COOKIES ARE IMPLEMENTED:
  return NextResponse.next();
  
  /* 
  // PROPER COOKIE-BASED MIDDLEWARE (FOR LATER):
  const token = request.cookies.get('hirebridge_token');
  const user = request.cookies.get('hirebridge_user');

  if (!token) {
    if (request.nextUrl.pathname.startsWith('/candidate') || request.nextUrl.pathname.startsWith('/recruiter')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Role check logic would go here
  return NextResponse.next();
  */
}

export const config = {
  matcher: ['/candidate/:path*', '/recruiter/:path*'],
};
