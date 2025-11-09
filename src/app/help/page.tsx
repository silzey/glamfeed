'use client';

import { Header } from '@/components/header';
import { HelpCircle, BookUser, MessageSquare, ShieldCheck, User, PenSquare, Star, Heart, Compass, Search, Coins, LayoutGrid, ArrowLeft } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

const faqItems = [
    {
        question: "How do I post a review?",
        answer: "Navigate to the 'Creator' page from the main menu. Fill out the product name, your rating, and your review text. You can also upload a photo. Once you're done, click 'Submit Review'."
    },
    {
        question: "Why was my review rejected?",
        answer: "Our AI moderation system automatically checks for content that violates our policies, such as offensive language, spam, or irrelevant content. If your review was rejected, it likely contained one of these elements."
    },
    {
        question: "Can I edit or delete my review?",
        answer: "Currently, editing and deleting reviews is not supported directly through the app. Please contact support for assistance."
    },
    {
        question: "How do I change my profile information?",
        answer: "You can update your profile information, including your name and bio, on the 'Profile' page, accessible from the main menu."
    },
    {
        question: "How do I earn coins?",
        answer: "You can earn coins by completing missions, posting high-quality reviews, getting likes on your content, and participating in community events. Check the 'Missions' page for specific tasks."
    },
    {
        question: "What can I use coins for?",
        answer: "Coins can be spent in the 'Coin Shop' on exclusive products and digital items, or they can be converted to real money on the 'Cash Out' page once you meet the requirements."
    },
    {
        question: "What is the minimum amount for a cash-out?",
        answer: "You need a minimum of 10,000 coins to be eligible for a cash-out. You also need to have a verified account and not be on a 30-day cooldown from a previous withdrawal."
    },
    {
        question: "How do I verify my account?",
        answer: "Account verification is currently handled by our support team. Please contact us through the 'Contact Support' form to begin the process. This helps keep our community safe."
    },
    {
        question: "What are user levels (Bronze, Silver, Gold)?",
        answer: "User levels are a way to recognize your contributions to the community. You advance to higher levels by earning more coins. Higher levels may unlock special perks in the future!"
    },
    {
        question: "How does the AI moderation work?",
        answer: "We use a sophisticated AI model to analyze the text and images of all submitted reviews. It checks for relevance, offensive content, and spam to ensure our platform remains safe and helpful for everyone."
    },
    {
        question: "Can I follow other users?",
        answer: "Yes! When you find a creator whose content you enjoy, you can visit their profile and click the 'Follow' button. Their latest reviews will then appear more prominently in your feed."
    },
    {
        question: "What are bookmarks for?",
        answer: "Bookmarking a review saves it to your personal collection. It's a great way to keep track of products you're interested in or reviews you found particularly helpful."
    },
    {
        question: "How do I report a post or comment?",
        answer: "If you see content that violates our community policies, you can click the three-dot menu on the post or comment and select 'Report'. Our team will review the content."
    },
    {
        question: "How do I change the app's theme?",
        answer: "You can customize the app's appearance, including the accent color and light/dark mode, by navigating to 'Settings' and then selecting 'Theme'."
    }
];

const policies = [
    "Be Respectful: No personal attacks, harassment, or hate speech.",
    "Stay Relevant: Keep reviews and comments focused on cosmetics and accessories.",
    "No Spam: Do not post unauthorized advertisements or promotional content.",
    "Be Honest: Provide genuine and authentic feedback on products.",
    "No Misinformation: Do not share false or misleading claims about products or their effects.",
    "Protect Privacy: Do not share private information about yourself or others.",
    "No Medical Advice: Do not provide or ask for medical advice regarding skin conditions or health issues.",
    "Disclose Sponsorships: Clearly disclose any paid or sponsored content.",
    "One Account Per Person: Do not create multiple accounts to manipulate ratings or reviews.",
    "No Impersonation: Do not impersonate other individuals, brands, or entities.",
    "Keep it Clean: Do not post sexually explicit, violent, or otherwise graphic content.",
    "Constructive Criticism Only: When providing negative feedback, be constructive and specific.",
    "No Review Swapping: Do not offer to exchange positive reviews with other users.",
    "Respect Copyright: Only post content that you have the right to share.",
    "No Affiliate Links: Do not post unsolicited affiliate marketing links in reviews or comments.",
    "Report Violations: If you see content that violates these rules, please report it.",
    "No Bullying: Cyberbullying in any form will result in an immediate account suspension.",
    "Stay On-Topic in Comments: Keep comment discussions relevant to the original review.",
    "No Fake Engagement: Do not use bots or services to artificially inflate likes or comments.",
    "Be a Good Community Member: Foster a positive and supportive environment for everyone.",
    "No Illegal Content: Do not post content that promotes illegal acts or substances.",
    "Authentic Photos Only: Ensure uploaded photos are your own and accurately represent the product.",
    "Value Diversity: Embrace and respect the diverse backgrounds and opinions of our community.",
    "Listen to Moderators: Follow the guidance of our AI and human moderators."
];


export default function HelpPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 pt-20 sm:pt-24 flex-1 pb-16 md:pb-24">
        <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-white/70 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
        <div className="flex items-center gap-4 mb-8">
          <HelpCircle
            className="h-10 w-10 text-primary"
            style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
          />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Help Center</h1>
            <p className="text-md sm:text-lg text-white/70">
              Find answers to your questions and get support.
            </p>
          </div>
        </div>
        
        <div className="glass-card p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                
                <AccordionItem value="item-0" className="border-white/10">
                    <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                        <div className="flex items-center gap-3">
                            <BookUser className="h-6 w-6 text-primary"/>
                            Getting Started
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-white/80 space-y-4 pt-2">
                        <p>Welcome to GlamFeed! Here’s how to get the most out of our community:</p>
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <h4 className="font-semibold text-white">1. Set Up Your Profile</h4>
                                <p className="text-sm">Head to the Profile page to add a photo and a short bio. Let the community know who you are!</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <PenSquare className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <h4 className="font-semibold text-white">2. Create Your First Post</h4>
                                <p className="text-sm">Got a product you love (or hate)? Go to the Creator page, rate it, write your thoughts, and share it with everyone.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <Heart className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <h4 className="font-semibold text-white">3. Engage with Others</h4>
                                <p className="text-sm">Explore reviews from other users. Like, comment, and bookmark posts you find helpful.</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                 
                <AccordionItem value="item-guide" className="border-white/10">
                    <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                        <div className="flex items-center gap-3">
                            <LayoutGrid className="h-6 w-6 text-primary"/>
                            User Guide
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-white/80 space-y-4 pt-2">
                        <p>This guide explains all the sections of the GlamFeed app.</p>
                        
                        <div className="flex items-start gap-3">
                            <Compass className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <h4 className="font-semibold text-white">Explore</h4>
                                <p className="text-sm">Discover new trends, products, and creators. The Explore feed shows you a wide variety of content from across the community.</p>
                            </div>
                        </div>

                         <div className="flex items-start gap-3">
                            <Search className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <h4 className="font-semibold text-white">Search</h4>
                                <p className="text-sm">Look for specific products, hashtags, or users. Use the search bar to find exactly what you're looking for.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <PenSquare className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <h4 className="font-semibold text-white">Creator</h4>
                                <p className="text-sm">Share your own reviews! On the Creator page, you can rate products, write your thoughts, and upload photos to contribute to the community.</p>
                            </div>
                        </div>

                         <div className="flex items-start gap-3">
                            <User className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <h4 className="font-semibold text-white">Profile</h4>
                                <p className="text-sm">This is your personal space. View your posts, edit your bio, and see your follower stats.</p>
                            </div>
                        </div>
                        
                         <div className="flex items-start gap-3">
                            <Coins className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <h4 className="font-semibold text-white">Coin Program & Coin Shop</h4>
                                <p className="text-sm">Engage with the community by posting reviews and commenting to earn Coins. You can then spend your Coins in the exclusive Coin Shop to get real products and special items.</p>
                            </div>
                        </div>

                         <div className="flex items-start gap-3">
                            <Star className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <h4 className="font-semibold text-white">Reviews</h4>
                                <p className="text-sm">The main feed where you can see all the latest reviews from the community. Scroll through to find your next favorite product.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <Heart className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <h4 className="font-semibold text-white">Likes & Bookmarks</h4>
                                <p className="text-sm">Keep track of posts you've liked or saved for later. It's a great way to build a personal wishlist.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <HelpCircle className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <h4 className="font-semibold text-white">Settings</h4>
                                <p className="text-sm">Customize your experience. Change your theme, manage notifications, adjust privacy settings, and more.</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-1" className="border-white/10">
                    <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="h-6 w-6 text-primary"/>
                            Contact Support
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-white/80 pt-2">
                        <p className="mb-4">Have a question or need to report an issue? Fill out the form below and our team will get back to you as soon as possible.</p>
                        <form className="space-y-4">
                            <Input placeholder="Your Email" className="bg-black/40 border-white/20 placeholder:text-white/40 h-11"/>
                            <Input placeholder="Subject" className="bg-black/40 border-white/20 placeholder:text-white/40 h-11"/>
                            <Textarea placeholder="Describe your issue..." rows={5} className="bg-black/40 border-white/20 placeholder:text-white/40"/>
                            <Button className="w-full glass-button">Submit Ticket</Button>
                        </form>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-white/10">
                    <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                         <div className="flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-primary"/>
                            Community Policies
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-white/80 space-y-2 pt-2">
                        <p>To keep our community safe, positive, and authentic, all members must adhere to the following guidelines:</p>
                        <ul className="list-disc list-inside space-y-2 text-sm columns-1 sm:columns-2">
                            {policies.map((policy, index) => (
                                <li key={index}><strong>{policy.split(':')[0]}:</strong>{policy.split(':')[1]}</li>
                            ))}
                        </ul>
                        <p className="text-sm pt-2">Violating these rules may result in content removal or account suspension.</p>
                    </AccordionContent>
                </AccordionItem>

                 <AccordionItem value="item-3" className="border-white/10">
                    <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                         <div className="flex items-center gap-3">
                            <HelpCircle className="h-6 w-6 text-primary"/>
                           Frequently Asked Questions
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-white/80 pt-2">
                         <Accordion type="single" collapsible className="w-full">
                            {faqItems.map((item, index) => (
                                <AccordionItem value={`faq-${index}`} key={index} className="border-white/10">
                                    <AccordionTrigger className="hover:no-underline text-left text-sm">{item.question}</AccordionTrigger>
                                    <AccordionContent className="text-white/70 text-sm">
                                    {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
      </main>
    </div>
  );
}
