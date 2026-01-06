import Image from 'next/image';

export default function Logo({ className, iconSize = 32 }: { className?: string; iconSize?: number }) {
  return (
    <div className={`flex items-center justify-center overflow-hidden h-auto ${className}`} style={{ width: iconSize * 1.5 }}>
      <Image 
        src="/hb_logo.png" 
        alt="HireBridge Logo" 
        width={500}
        height={500}
        className="w-full h-auto object-contain"
        priority
      />
    </div>
  );
}
