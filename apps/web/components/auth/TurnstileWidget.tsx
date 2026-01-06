'use client';

import { Turnstile } from '@marsidev/react-turnstile';

export default function TurnstileWidget({
  onToken,
}: {
  onToken: (token: string) => void;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'; // Dummy key for testing

  return (
    <div className="mt-3 flex flex-col items-center">
      <Turnstile
        siteKey={siteKey}
        onSuccess={(token) => onToken(token)}
        onExpire={() => onToken('')}
        onError={() => onToken('')}
        options={{ 
          theme: 'light',
          appearance: 'always', // Force interactive checkbox challenge
        }}
      />
    </div>
  );
}
