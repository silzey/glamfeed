
'use client';
import { useState } from 'react';
import { Palette, PlusCircle, LogOut, Gem, Settings, Shield, Heart, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/firebase';
import { PageLoader } from './page-loader';
import { Skeleton } from './ui/skeleton';


export function Header() {
  const { user: authUser, isUserLoading, signOut } = useAuth()
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsNavigating(true);
    router.push(href);
  };
  
  const handleSignOut = () => {
    setIsNavigating(true);
    signOut();
    router.push('/');
  };

  const handleSignInClick = () => {
    setIsNavigating(true);
    router.push('/login');
  }

  const isAdminUser = authUser?.email === 'reellookz@gmail.com';

  return (
    <>
      {isNavigating && <PageLoader />}
      <header className="fixed top-0 z-50 w-full p-2 sm:p-4">
        <div className="container mx-auto flex h-14 items-center glass-card px-4 sm:px-6">
          <Link href="/" className="mr-auto flex items-center space-x-2" onClick={(e) => handleNavigation(e, '/')}>
            <Gem className="h-8 w-8 text-primary" />
            <span className="hidden sm:inline-block text-xl font-bold text-white">GlamFeed</span>
          </Link>
          
          <div className="flex items-center justify-end space-x-2 sm:space-x-4">
              {isUserLoading ? (
                <>
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-24 rounded-full" />
                </>
              ) : authUser ? (
                <>
                  <Link href="/settings" passHref>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-primary border border-primary/50 hover:bg-primary/10" onClick={(e) => handleNavigation(e, '/settings')}>
                        <Palette className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/share" passHref>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-primary border border-primary/50 hover:bg-primary/10" onClick={(e) => handleNavigation(e, '/share')}>
                        <Gem className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/upload" passHref>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-primary border border-primary/50 hover:bg-primary/10" onClick={(e) => handleNavigation(e, '/upload')}>
                          <PlusCircle className="h-5 w-5" />
                      </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full"
                      >
                        <Avatar className="h-10 w-10 border-2 border-primary/50">
                            {authUser.avatarUrl && <AvatarImage src={authUser.avatarUrl} alt={authUser.name || ''} />}
                            <AvatarFallback>{authUser.name ? authUser.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 glass-card mt-2" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none text-white">
                            {authUser.name}
                          </p>
                          <p className="text-xs leading-none text-white/70">
                            {authUser.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/20"/>
                       <DropdownMenuItem asChild className="text-white/80 focus:bg-white/10 focus:text-white cursor-pointer">
                        <Link href="/share" onClick={(e) => handleNavigation(e, '/share')}>
                            <Gem className="mr-2 h-4 w-4" />
                            <span>Share</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild className="text-white/80 focus:bg-white/10 focus:text-white cursor-pointer">
                        <Link href="/wishlist" onClick={(e) => handleNavigation(e, '/wishlist')}>
                            <Heart className="mr-2 h-4 w-4" />
                            <span>Wishlist</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-white/80 focus:bg-white/10 focus:text-white cursor-pointer">
                        <Link href="/wallet" onClick={(e) => handleNavigation(e, '/wallet')}>
                            <Wallet className="mr-2 h-4 w-4" />
                            <span>Wallet</span>
                        </Link>
                      </DropdownMenuItem>
                       {isAdminUser && (
                        <DropdownMenuItem asChild className="text-white/80 focus:bg-white/10 focus:text-white cursor-pointer">
                          <Link href="/admin" onClick={(e) => handleNavigation(e, '/admin')}>
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Admin</span>
                          </Link>
                        </DropdownMenuItem>
                       )}
                       <DropdownMenuItem asChild className="text-white/80 focus:bg-white/10 focus:text-white cursor-pointer">
                        <Link href="/settings" onClick={(e) => handleNavigation(e, '/settings')}>
                           <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-primary focus:bg-white/10 focus:text-primary cursor-pointer">
                       <Link href="/upload" onClick={(e) => handleNavigation(e, '/upload')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>Create Post</span>
                      </Link>
                    </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/20"/>
                      <DropdownMenuItem onClick={handleSignOut} className="text-white/80 focus:bg-white/10 focus:text-white cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                  <>
                      <Link href="/settings" passHref>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-primary border border-primary/50 hover:bg-primary/10" onClick={(e) => handleNavigation(e, '/settings')}>
                              <Palette className="h-5 w-5" />
                          </Button>
                      </Link>
                      <Link href="/share" passHref>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-primary border border-primary/50 hover:bg-primary/10" onClick={(e) => handleNavigation(e, '/share')}>
                            <Gem className="h-5 w-5" />
                        </Button>
                      </Link>
                       <Link href="/upload" passHref>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-primary border border-primary/50 hover:bg-primary/10" onClick={(e) => handleNavigation(e, '/upload')}>
                              <PlusCircle className="h-5 w-5" />
                          </Button>
                      </Link>
                      <Button onClick={handleSignInClick} className="glass-button h-10 px-4 rounded-full text-sm">
                          Sign In
                      </Button>
                  </>
              )}
          </div>
        </div>
      </header>
    </>
  );
}

    