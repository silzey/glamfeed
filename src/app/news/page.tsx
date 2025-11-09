'use client';
import { useState } from 'react';
import { Header } from '@/components/header';
import { Newspaper, ArrowLeft, Sparkles, Heart, BrainCircuit, Grape, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { newsArticles } from '@/lib/articles';
import { PageLoader } from '@/components/page-loader';
import { cn } from '@/lib/utils';

const mainArticle = newsArticles[0];
const featuredArticles = newsArticles.slice(1, 3);
const otherArticles = newsArticles.slice(3);

const categoryIcons = [
  { name: 'News', href: '/news', Icon: Newspaper },
  { name: 'Yoga', href: '/yoga', Icon: Leaf },
  { name: 'Beauty', href: '/beauty', Icon: Sparkles },
  { name: 'Health', href: '/health', Icon: Heart },
  { name: 'Growth', href: '/growth', Icon: BrainCircuit },
  { name: 'Travel', href: '/travel', Icon: Grape },
];

export default function NewsPage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === router.pathname) {
      e.preventDefault();
      return;
    }
    setIsNavigating(true);
  };

  return (
    <>
    {isNavigating && <PageLoader />}
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="container mx-auto max-w-6xl px-4 pt-20 sm:pt-24 flex-1 pb-16 md:pb-24">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="text-white/70 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
           <div className="hidden sm:flex items-center gap-4">
              {categoryIcons.map(item => (
                   <Link href={item.href} key={item.name} onClick={(e) => handleNavigation(e, item.href)}>
                       <Button variant="ghost" size="icon" className={cn('h-12 w-12 rounded-full hover:bg-primary/20', item.name === 'News' ? 'text-primary bg-primary/10' : 'text-white/70')}>
                           <item.Icon className="h-6 w-6" />
                       </Button>
                   </Link>
              ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <Newspaper
            className="h-10 w-10 text-primary"
            style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
          />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Beauty News & Trends</h1>
            <p className="text-md sm:text-lg text-white/70">
              The latest updates from the beauty world.
            </p>
          </div>
        </div>

        <div className="sm:hidden mb-6">
            <div className="glass-card p-2">
                <div className="flex items-center justify-around">
                    {categoryIcons.map(item => (
                       <Link href={item.href} key={item.name} onClick={(e) => handleNavigation(e, item.href)}>
                           <Button variant="ghost" size="icon" className={cn('h-12 w-12 rounded-full hover:bg-primary/20', item.name === 'News' ? 'text-primary bg-primary/10' : 'text-white/70')}>
                               <item.Icon className="h-6 w-6" />
                           </Button>
                       </Link>
                    ))}
                </div>
            </div>
        </div>

        {/* Main Article */}
        <Link href={`/articles/news/${mainArticle.id}`} className="glass-card overflow-hidden group cursor-pointer block mb-6">
             <div className="relative w-full aspect-video">
                <Image
                    src={mainArticle.imageUrl}
                    alt={mainArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={mainArticle.imageHint}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end">
                    <span className="text-sm font-semibold text-primary">{mainArticle.category}</span>
                    <h2 className="text-2xl sm:text-4xl font-bold mt-2 text-white group-hover:text-primary transition-colors">{mainArticle.title}</h2>
                    <p className="text-white/80 mt-3 text-sm sm:text-base hidden md:block max-w-3xl">{mainArticle.excerpt}</p>
                </div>
             </div>
        </Link>
        
        {/* Featured Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {featuredArticles.map((article) => (
             <Link href={`/articles/news/${article.id}`} key={article.id} className="glass-card overflow-hidden group cursor-pointer block">
                <div className="relative w-full aspect-video">
                  <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={article.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-primary">{article.category}</span>
                  <h3 className="text-lg font-bold mt-1 text-white group-hover:underline leading-tight">{article.title}</h3>
                </div>
              </Link>
          ))}
        </div>

        {/* Other Articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherArticles.map((article) => (
                 <Link href={`/articles/news/${article.id}`} key={article.id} className="glass-card overflow-hidden group cursor-pointer block">
                    <div className="relative w-full aspect-[4/3]">
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            data-ai-hint={article.imageHint}
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    </div>
                    <div className="p-4">
                        <span className="text-xs font-semibold text-primary">{article.category}</span>
                        <h3 className="text-md font-bold mt-1 text-white group-hover:underline leading-tight">{article.title}</h3>
                        <p className="text-sm text-white/70 mt-2 line-clamp-2">{article.excerpt}</p>
                    </div>
                </Link>
            ))}
        </div>
      </main>
    </div>
    </>
  );
}
