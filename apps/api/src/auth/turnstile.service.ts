import { Injectable } from '@nestjs/common';

@Injectable()
export class TurnstileService {
  async verify(token: string | undefined, remoteip?: string) {
    if (!token) return { success: false, error: 'missing-token' };

    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
        // Log internally, but avoid leaking this to client in production.
        console.warn("TURNSTILE_SECRET_KEY not set. Skipping captcha verification.");
        return { success: true };
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip }),
    });

    const data: any = await res.json();
    return data; // { success: boolean, ... }
  }
}
