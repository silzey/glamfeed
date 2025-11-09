
export type Article = {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  imageHint: string;
  category: string;
  author: string;
  date: string;
};

export const yogaArticles: Article[] = [
  {
    id: 'deepen-your-practice',
    title: '5 Ways to Deepen Your Yoga Practice',
    excerpt: 'Move beyond the physical postures and explore the philosophical and spiritual dimensions of yoga to enrich your life on and off the mat.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop',
    imageHint: 'woman yoga pose',
    category: 'Mindfulness',
    author: 'Elena Sage',
    date: '2024-05-20',
  },
  {
    id: 'morning-yoga-routine',
    title: 'The Perfect 15-Minute Morning Yoga Routine',
    excerpt: 'Start your day with energy and clarity. This short and effective routine is designed to awaken your body and focus your mind.',
    imageUrl: 'https://images.unsplash.com/photo-1591291621220-9092a7cc3f10?q=80&w=2187&auto=format&fit=crop',
    imageHint: 'yoga morning',
    category: 'Practice',
    author: 'Leo Ascent',
    date: '2024-05-18',
  },
  {
    id: 'benefits-of-meditation',
    title: 'Unlocking Stillness: The Core Benefits of Meditation',
    excerpt: 'Discover how a consistent meditation practice can reduce stress, improve concentration, and foster a deeper sense of well-being.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-4e652a97b975?q=80&w=2070&auto=format&fit=crop',
    imageHint: 'meditation outdoors',
    category: 'Mindfulness',
    author: 'Serena Peace',
    date: '2024-05-15',
  },
    {
    id: 'beginner-poses',
    title: 'Essential Yoga Poses for Absolute Beginners',
    excerpt: 'New to yoga? These foundational poses will help you build strength, increase flexibility, and start your practice with confidence.',
    imageUrl: 'https://images.unsplash.com/photo-1575052814086-c389226cd8b2?q=80&w=2070&auto=format&fit=crop',
    imageHint: 'beginner yoga',
    category: 'Practice',
    author: 'Alex Foundation',
    date: '2024-05-12',
  },
  {
    id: 'yoga-for-stress-relief',
    title: 'Flow and Let Go: Yoga for Stress Relief',
    excerpt: 'Learn how specific yoga sequences and breathing techniques can calm your nervous system and melt away the stresses of daily life.',
    imageUrl: 'https://images.unsplash.com/photo-1607748862156-71a68aa736a6?q=80&w=2070&auto=format&fit=crop',
    imageHint: 'stress relief yoga',
    category: 'Wellness',
    author: 'Hannah Bloom',
    date: '2024-05-10',
  },
  {
    id: 'mindful-eating',
    title: 'Nourish Your Body: An Introduction to Mindful Eating',
    excerpt: 'Transform your relationship with food by bringing the principles of mindfulness to your meals. Savor every bite and listen to your body.',
    imageUrl: 'https://images.unsplash.com/photo-1542844378-4795c453b754?q=80&w=2070&auto=format&fit=crop',
    imageHint: 'healthy food',
    category: 'Wellness',
    author: 'Gia Harvest',
    date: '2024-05-08',
  },
  {
    id: 'history-of-yoga',
    title: 'From Ancient Roots: A Brief History of Yoga',
    excerpt: 'Explore the fascinating origins of yoga, from its ancient beginnings in India to its evolution into the global phenomenon it is today.',
    imageUrl: 'https://images.unsplash.com/photo-1599905291214-d57a27625145?q=80&w=2070&auto=format&fit=crop',
    imageHint: 'ancient temple',
    category: 'Philosophy',
    author: 'Rohan Vedas',
    date: '2024-05-05',
  },
];


export const newsArticles: Article[] = [
  {
    id: 'summer-beauty-trends',
    title: 'Top 5 Beauty Trends to Try This Summer',
    excerpt: 'From glossy lips to bold eyeshadows, discover the hottest beauty trends that are taking over this summer.',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080&auto=format&fit=crop',
    imageHint: 'summer beauty',
    category: 'Trends',
    author: 'Julia Styles',
    date: '2024-06-01',
  },
  {
    id: 'skincare-mistakes',
    title: 'Are You Making These Common Skincare Mistakes?',
    excerpt: 'A leading dermatologist breaks down the most common mistakes people make in their skincare routines and how to fix them for healthier skin.',
    imageUrl: 'https://images.unsplash.com/photo-1552046122-03184de85e08?q=80&w=2187&auto=format&fit=crop',
    imageHint: 'skincare routine',
    category: 'Skincare',
    author: 'Dr. Anya Sharma',
    date: '2024-05-28',
  },
  {
    id: 'celebrity-interview',
    title: 'Exclusive: Celebrity MUA Shares Red Carpet Secrets',
    excerpt: 'We sit down with a world-renowned makeup artist to get the inside scoop on how she preps A-listers for the red carpet.',
    imageUrl: 'https://images.unsplash.com/photo-1616099079201-3837a8951859?q=80&w=2187&auto=format&fit=crop',
    imageHint: 'makeup artist',
    category: 'Interviews',
    author: 'Chloe Reporter',
    date: '2024-05-25',
  },
    {
    id: 'new-product-launch',
    title: 'The Viral Foundation That’s Selling Out Everywhere',
    excerpt: 'A new foundation has taken the internet by storm. We investigate if it lives up to the hype and where you can get your hands on it.',
    imageUrl: 'https://images.unsplash.com/photo-1590152994408-e43543534125?q=80&w=2187&auto=format&fit=crop',
    imageHint: 'foundation product',
    category: 'Products',
    author: 'Ben Filter',
    date: '2024-05-22',
  },
  {
    id: 'diy-face-masks',
    title: 'Natural Glow: 3 DIY Face Masks You Can Make at Home',
    excerpt: 'Get radiant skin with these simple and effective DIY face masks using ingredients you probably already have in your kitchen.',
    imageUrl: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2070&auto=format&fit=crop',
    imageHint: 'DIY facemask',
    category: 'DIY Beauty',
    author: 'Aisha Green',
    date: '2024-05-19',
  },
];
