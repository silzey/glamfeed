'use client';
import { socialIcons } from '@/components/social-icons';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const SharePage = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 pt-24">
            <div className="w-full max-w-4xl mb-8">
                 <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground -ml-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </div>
            <h1 className="text-4xl font-bold text-primary mb-8">Share to Social Media</h1>
            <p className="text-muted-foreground mb-16 max-w-2xl text-center">
                Share your amazing reviews and posts with your friends and followers on your favorite social media platforms.
            </p>
            
            <Card className="w-full max-w-4xl glass-card">
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {socialIcons.map((item) => {
                        const Icon = item.icon;
                        let href = '#';
                        let target = '_blank';

                        if (item.name === 'Admin') {
                            href = '/admin';
                            target = '_self';
                        } else if (item.name === 'Wallet') {
                            href = '/wallet';
                            target = '_self';
                        } else if (item.name === 'Wishlist') {
                            href = '/wishlist';
                            target = '_self';
                        } else if (item.name === 'News') {
                            href = '/news';
                            target = '_self';
                        } else if (item.name === 'Yoga') {
                            href = '/yoga';
                            target = '_self';
                        }


                        return (
                            <Link
                                key={item.name}
                                href={href}
                                target={target}
                                rel="noopener noreferrer"
                                className="flex flex-col items-center justify-center gap-2 p-4 bg-secondary/30 rounded-lg transition-all transform hover:scale-105 hover:bg-primary/20 hover:text-primary border border-primary/20 hover:border-primary"
                                title={item.name}
                            >
                                <Icon className="w-8 h-8 text-primary" />
                                <span className="text-xs text-center">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
              </CardContent>
            </Card>
        </div>
    );
};

export default SharePage;
