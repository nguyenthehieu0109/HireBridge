'use client';

import Image from 'next/image';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-16">
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Logo iconSize={108} />
              <span className="text-5xl font-black tracking-tighter text-white">Hire<span className="text-brand-600">Bridge</span></span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Nâng tầm trải nghiệm tuyển dụng với sức mạnh trí tuệ nhân tạo. 
              Kết nối nhân tài và doanh nghiệp một cách thông minh, nhanh chóng và chính xác nhất.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <SocialLink icon="facebook" src="/facebook-icon.png" label="Facebook" />
              <SocialLink icon="instagram" src="/linkedin-icon.png" label="Instagram" />
              <SocialLink icon="twitter" src="/twitter-icon.png" label="Twitter" />
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest text-[11px]">Sản phẩm</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Tìm việc làm</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Đăng tin tuyển dụng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Resume Scanner</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Matching thông minh</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest text-[11px]">Hỗ trợ</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog tuyển dụng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Quy trình vận hành</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Liên hệ hệ thống</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest text-[11px]">Pháp lý</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cơ chế giải quyết</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs font-medium">
              © 2026 HireBridge. All rights reserved.
            </p>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
              Designed for Excellence
            </p>
          </div>
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-600">
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">System Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon, src, label }: { icon: string; src: string; label: string }) {
  return (
    <a href="#" className="group transition-all hover:-translate-y-1 flex flex-col items-center gap-2">
      <Image
        src={src}
        alt={icon} 
        width={16} 
        height={16}
        className="w-16 h-16 object-contain opacity-50 group-hover:opacity-100 transition-opacity brightness-0 invert" 
      />
      <span className="text-xs font-semibold text-slate-500 group-hover:text-white transition-colors">{label}</span>
    </a>
  );
}
