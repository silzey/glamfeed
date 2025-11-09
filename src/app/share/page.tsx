
'use client';

import { useState } from 'react';
import {
  User,
  Settings,
  Heart,
  Camera,
  Star,
  Store,
  PenSquare,
  Home,
  Search,
  Bell,
  Mail,
  BarChart,
  UserCog,
  LogOut,
  HelpCircle,
  Shield,
  Palette,
  LayoutGrid,
  ArrowLeft,
  Wallet,
  Compass,
  Newspaper,
  Download,
  Coins,
  HeartPulse,
} from 'lucide-react';
import { Header } from '@/components/header';
import { PageLoader } from '@/components/page-loader';
import { useAuth } from '@/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/context/pwa-install-context';


export default function SharePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const { canInstall, promptInstall } = usePWAInstall();

  const handleSignOut = () => {
    setIsNavigating(true);
    signOut();
  }

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '#') {
        e.preventDefault();
        return;
    }
    if (href !== router.pathname) {
      setIsNavigating(true);
    }
  };
  
  const actionIcons = [
    { Icon: Home, name: 'Home', href: '/' },
    { Icon: Compass, name: 'Explore', href: '/explore' },
    { Icon: Search, name: 'Search', href: '/search' },
    { Icon: PenSquare, name: 'Creator', href: '/upload' },
    { Icon: User, name: 'Profile', href: user ? `/users/${user.uid}` : '/login' },
    { Icon: Heart, name: 'Wishlist', href: '/wishlist' },
    { Icon: Mail, name: 'Messages', href: '/messages' },
    { Icon: Bell, name: 'Notifications', href: '/notifications' },
    { Icon: Store, name: 'Shop', href: '/shop' },
    { Icon: Coins, name: 'Coin Shop', href: '/coinshop' },
    { Icon: Star, name: 'Missions', href: '/missions' },
    { Icon: Camera, name: 'Camera', href: '/camera' },
    { Icon: BarChart, name: 'Analytics', href: '/analytics' },
    { Icon: Settings, name: 'Settings', href: '/settings' },
    { Icon: UserCog, name: 'Account', href: '/account' },
    { Icon: Palette, name: 'Theme', href: '/theme' },
    { Icon: Shield, name: 'Privacy', href: '/privacy' },
    { Icon: HelpCircle, name: 'Help', href: '/help' },
    { Icon: Wallet, name: 'Wallet', href: '/wallet' },
    { Icon: Newspaper, name: 'News', href: '/news' },
    { Icon: HeartPulse, name: 'Health', href: '/health' },
    ...(canInstall ? [{ Icon: Download, name: 'Install', href: '#install' }] : []),
    { Icon: LogOut, name: 'Logout', href: '#logout' },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      {isNavigating && <PageLoader />}
      <Header />
      <main className="flex-1 pt-20 sm:pt-24 pb-16 md:pb-24">
        <div className="container mx-auto max-w-xl px-4">
          <div className="mb-6">
              <Button variant="ghost" onClick={() => router.back()} className="text-white/70 hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
              </Button>
          </div>
          <div className="flex items-center gap-4 mb-8">
            <LayoutGrid
              className="h-8 w-8 sm:h-10 sm:w-10 text-primary"
              style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
            />
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">Quick Menu</h1>
              <p className="text-sm sm:text-lg text-white/70">
                Navigate to any page from here.
              </p>
            </div>
          </div>
          <div className="glass-card p-2 sm:p-4 md:p-6">
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 sm:gap-2 md:gap-4">
              {actionIcons.map(({ Icon, name, href }) => {
                const iconElement = (
                  <div
                    className="flex flex-col items-center justify-center gap-1 sm:gap-2 p-1 sm:p-2 rounded-lg hover:bg-white/5 transition-colors duration-200"
                  >
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-black/20 border border-primary/50 group-hover:border-primary">
                       <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-center text-primary/80 font-medium">{name}</span>
                  </div>
                );

                if (href === '#logout') {
                  return (
                    <button key={name} onClick={handleSignOut} className="w-full group">
                      {iconElement}
                    </button>
                  );
                }

                if (href === '#install') {
                    return (
                      <button key={name} onClick={promptInstall} className="w-full group">
                        {iconElement}
                      </button>
                    );
                }

                return (
                  <Link href={href} key={name} onClick={(e) => handleNavigation(e, href)} className="w-full group">
                    {iconElement}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

    