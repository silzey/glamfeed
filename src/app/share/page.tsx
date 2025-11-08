'use client';
import { socialIcons } from '@/components/social-icons';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SharePage = () => {
    const router = useRouter();
    const radius = 180; // Radius of the circle
    const iconSize = 48; // Size of the icons

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
            <div className="w-full max-w-2xl mb-8">
                 <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground -ml-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </div>
            <h1 className="text-4xl font-bold text-primary mb-16">Share to Social Media</h1>
            <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                {socialIcons.map((item, index) => {
                    const angle = (index / socialIcons.length) * 2 * Math.PI;
                    const x = radius * Math.cos(angle) - (iconSize / 2);
                    const y = radius * Math.sin(angle) - (iconSize / 2);
                    const Icon = item.icon;

                    return (
                        <a
                            key={item.name}
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute flex items-center justify-center bg-secondary rounded-full transition-transform transform hover:scale-110 hover:bg-primary"
                            style={{
                                left: `calc(50% + ${x}px)`,
                                top: `calc(50% + ${y}px)`,
                                width: `${iconSize}px`,
                                height: `${iconSize}px`,
                            }}
                            title={item.name}
                        >
                            <Icon className="w-6 h-6" />
                        </a>
                    );
                })}
                 <div className="absolute flex items-center justify-center w-24 h-24 bg-primary rounded-full">
                    <PlusCircle className="w-12 h-12 text-primary-foreground" />
                </div>
            </div>
        </div>
    );
};

export default SharePage;
