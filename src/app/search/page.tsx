'use client';
import { useState } from 'react';
import { Header } from '@/components/header';
import { Search, X, ArrowLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import searchCategories from '@/lib/search-categories.json';

type CategoryData = {
  [key: string]: string[] | CategoryData;
};

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const renderCategories = (data: CategoryData) => {
      return Object.entries(data).map(([key, value]) => {
          if (Array.isArray(value)) {
              return (
                  <div key={key}>
                      <h4 className="font-semibold text-white/90 mb-2">{key}</h4>
                      <div className="flex flex-wrap gap-2">
                          {value.map(item => (
                              <Button key={item} variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white h-8 rounded-full">
                                  {item}
                              </Button>
                          ))}
                      </div>
                  </div>
              );
          } else {
              return (
                  <Accordion type="single" collapsible className="w-full" key={key}>
                      <AccordionItem value={key} className="border-b-0">
                          <AccordionTrigger className="py-2 hover:no-underline font-semibold text-white/90 text-base">
                              {key}
                          </AccordionTrigger>
                          <AccordionContent className="pl-4 border-l border-white/20 ml-2 space-y-4">
                              {renderCategories(value)}
                          </AccordionContent>
                      </AccordionItem>
                  </Accordion>
              );
          }
      });
    };

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 pt-20 sm:pt-24 flex-1 pb-16 md:pb-24">
        <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-white/70 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
        <div className="flex items-center gap-4 mb-8">
            <Search
                className="h-10 w-10 text-primary"
                style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
            />
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Search</h1>
                <p className="text-md sm:text-lg text-white/70">
                Find reviews, products, and trends.
                </p>
            </div>
        </div>

        <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
            <Input 
                placeholder="What are you looking for?"
                className="pl-12 pr-12 h-14 text-lg bg-black/40 border-white/20 placeholder:text-white/40 focus-visible:ring-offset-0 focus-visible:ring-primary"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
                 <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full" onClick={() => setQuery('')}>
                    <X className="h-5 w-5 text-white/50"/>
                 </Button>
            )}
        </div>

        <div className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Browse Categories</h2>
             <div className="space-y-2">
                {Object.entries(searchCategories.categories).map(([mainCategory, subCategories]) => (
                    <Accordion type="single" collapsible className="w-full" key={mainCategory}>
                        <AccordionItem value={mainCategory} className="border-white/10">
                            <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                                {mainCategory}
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pl-2 space-y-3">
                                {renderCategories(subCategories as CategoryData)}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}
