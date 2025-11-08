'use client';
import {
  Palette,
  PlusCircle,
  Search,
  User,
  LogOut,
} from 'lucide-react';
import { Logo } from '@/components/logo';
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
import { useUser, useAuth } from '@/firebase';


export function Header() {
  const { user: authUser } = useUser()
  const auth = useAuth()
  const router = useRouter();

  const handleSignOut = () => {
    if (auth) {
      auth.signOut();
    }
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-5xl items-center px-4">
        <div className="mr-auto flex items-center gap-4">
          <Logo />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Link href="/upload" passHref>
            <Button variant="ghost" size="icon" aria-label="Create new review">
              <PlusCircle className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/theme" passHref>
            <Button variant="ghost" size="icon" aria-label="Customize theme">
              <Palette className="h-5 w-5" />
            </Button>
          </Link>
          {authUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border-2 border-primary/50">
                    {authUser.photoURL && <AvatarImage src={authUser.photoURL} alt={authUser.displayName || 'User'} />}
                    <AvatarFallback>
                      {authUser.displayName ? authUser.displayName.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {authUser.displayName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {authUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              aria-label="User profile"
              onClick={() => router.push('/login')}
            >
              <User className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
