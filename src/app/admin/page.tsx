
'use client';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useAuth } from '@/firebase';
import { useFirestore, useStorage } from '@/firebase/hooks/use-firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2, Eye, EyeOff, Check, ShieldCheck, Bell, Users, LayoutDashboard, FileText, Settings, LogOut, Ban, Award, Newspaper, Leaf, Wallet, Landmark, LifeBuoy, HeartPulse, Compass, Banknote, Store, Coins, LineChart, Mic, Image as ImageIcon, Video, Link as LinkIcon, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AppUser, Post, Report } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PageLoader } from '@/components/page-loader';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ReviewCard } from '@/components/review-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';


type AdminPanel = 'Dashboard' | 'Users' | 'Posts' | 'Reports' | 'Notifications' | 'Settings' | 'CRM' | 'CMS (News)' | 'CMS (Yoga)' | 'Wallets' | 'Banking' | 'Support' | 'Terms' | 'CMS (Health)' | 'CMS (Explore)' | 'Cashout' | 'Shop' | 'Coin Shop' | 'Analytics' | 'Podcast';

export default function AdminPage() {
  const { user: authUser, signOut, isUserLoading } = useAuth();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const [activePanel, setActivePanel] = useState<AdminPanel>('Posts');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  
  const [loading, setLoading] = useState(true);
  
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // New Post State
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostFile, setNewPostFile] = useState<File | null>(null);
  const [newPostMediaUrl, setNewPostMediaUrl] = useState('');
  const [newPostCtaText, setNewPostCtaText] = useState('');
  const [newPostCtaLink, setNewPostCtaLink] = useState('');
  const [newPostType, setNewPostType] = useState<string>('standard');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const isAdminUser = authUser?.email === 'reellookz@gmail.com';
  
  useEffect(() => {
    if (isUserLoading || !firestore) {
      return;
    }
    if(!authUser || !isAdminUser) {
        setLoading(false);
        return;
    }

    setLoading(true);

    const unsubUsers = onSnapshot(query(collection(firestore, 'users'), orderBy('createdAt', 'desc')), (snap) => {
      const arr: AppUser[] = [];
      snap.forEach((d) => arr.push({ uid: d.id, ...d.data() } as AppUser));
      setUsers(arr);
    });

    const unsubPosts = onSnapshot(query(collection(firestore, 'feed'), orderBy('createdAt', 'desc')), (snap) => {
      const arr: Post[] = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() } as Post));
      setPosts(arr);
    });

    const unsubReports = onSnapshot(query(collection(firestore, 'reports'), orderBy('createdAt', 'desc')), (snap) => {
      const arr: Report[] = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() } as Report));
      setReports(arr);
    });

    setLoading(false);
    return () => {
      unsubUsers();
      unsubPosts();
      unsubReports();
    };
  }, [firestore, authUser, isUserLoading, isAdminUser]);

  // --- Post Actions ---
  const togglePostVisibility = async (postId: string, visible: boolean) => {
    if (!firestore) return;
    await updateDoc(doc(firestore, 'feed', postId), { visible: visible });
    toast({ title: visible ? 'Post is now visible' : 'Post has been hidden' });
  };
  const deletePost = async (postId: string) => {
    if (!firestore) return;
    await deleteDoc(doc(firestore, 'feed', postId));
    toast({ title: 'Post deleted' });
  };
  
const handleCreatePost = async () => {
    if (!firestore || !authUser || !storage) return;
    if (!newPostFile && !newPostMediaUrl) {
        toast({ variant: 'destructive', title: 'Please provide media', description: 'Upload a file or enter a media URL.' });
        return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const createPostDocument = async (mediaUrl: string) => {
        const postData: Omit<Post, 'id'> = {
            userId: authUser.uid,
            caption: newPostCaption,
            mediaUrl: mediaUrl,
            createdAt: serverTimestamp(),
            visible: false, // Save as draft
            likesCount: 0,
            commentsCount: 0,
            adminUpload: true,
            postType: newPostType,
            ctaText: newPostCtaText,
            ctaLink: newPostCtaLink,
        };

        await addDoc(collection(firestore, 'feed'), postData);

        toast({ title: 'Draft created successfully!', description: 'Review and publish it below.' });
        
        // Reset form
        setNewPostCaption('');
        setNewPostFile(null);
        setNewPostMediaUrl('');
        setNewPostCtaText('');
        setNewPostCtaLink('');
        setNewPostType('standard');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    try {
        if (newPostFile) {
            const fileName = `admin_${authUser.uid}_${Date.now()}`;
            const storageRef = ref(storage, `feed/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, newPostFile);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error("Upload failed:", error);
                    toast({ variant: 'destructive', title: 'Upload failed', description: error.message });
                    setIsUploading(false); // Ensure reset on error
                },
                async () => {
                    try {
                        const finalMediaUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        await createPostDocument(finalMediaUrl);
                    } catch (err: any) {
                        toast({ variant: 'destructive', title: 'Failed to create post', description: err.message });
                    } finally {
                        setIsUploading(false);
                    }
                }
            );
        } else if (newPostMediaUrl) {
            // If it's just a URL, create the document directly.
            await createPostDocument(newPostMediaUrl);
            setIsUploading(false);
        }
    } catch (err: any) {
        toast({ variant: 'destructive', title: 'Failed to start post creation', description: err.message });
        setIsUploading(false);
    }
};


  // --- User Actions ---
  const toggleFreezeUser = async (userId: string, freeze: boolean) => {
    if (!firestore) return;
    await updateDoc(doc(firestore, 'users', userId), { isFrozen: freeze });
    toast({ title: freeze ? 'User frozen' : 'User unfrozen' });
  };
  const deleteUser = async (userId: string) => {
    if (!firestore) return;
    await deleteDoc(doc(firestore, 'users', userId));
    toast({ title: 'User deleted' });
  };
  const adjustPoints = async (userId: string, currentPoints: number, amount: number) => {
    if (!firestore) return;
    const newPoints = (currentPoints || 0) + amount;
    await updateDoc(doc(firestore, 'users', userId), { points: newPoints });
    toast({ title: `Points updated to ${newPoints}` });
  };

  // --- Broadcast / Notifications ---
  const sendBroadcast = async () => {
    if (!broadcastMessage.trim() || !firestore) return;
    await addDoc(collection(firestore, 'broadcasts'), {
      message: broadcastMessage,
      createdAt: serverTimestamp(),
      type: 'broadcast',
    });
    toast({ title: 'Broadcast sent' });
    setBroadcastMessage('');
  };

  if (isUserLoading) {
    return <PageLoader />;
  }

  if (!isAdminUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="text-white/70 mt-2">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <PageLoader />;
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Analytics', icon: LineChart },
    { name: 'CRM', icon: Users },
    { name: 'Users', icon: Users },
    { name: 'Posts', icon: FileText },
    { name: 'Reports', icon: Ban },
    { name: 'CMS (News)', icon: Newspaper },
    { name: 'CMS (Yoga)', icon: Leaf },
    { name: 'CMS (Health)', icon: HeartPulse },
    { name: 'CMS (Explore)', icon: Compass },
    { name: 'Shop', icon: Store },
    { name: 'Coin Shop', icon: Coins },
    { name: 'Wallets', icon: Wallet },
    { name: 'Banking', icon: Landmark },
    { name: 'Cashout', icon: Banknote },
    { name: 'Podcast', icon: Mic },
    { name: 'Support', icon: LifeBuoy },
    { name: 'Terms', icon: FileText },
    { name: 'Notifications', icon: Bell },
    { name: 'Settings', icon: Settings },
  ];
  
  const comingSoonPanels: AdminPanel[] = [
    'CMS (News)', 'CMS (Yoga)', 'Wallets', 'Banking', 'Support', 'Terms',
    'CMS (Health)', 'CMS (Explore)', 'Cashout', 'Shop', 'Coin Shop', 'Analytics', 'Podcast'
  ];

  return (
    <div className="flex min-h-screen w-full bg-black text-white">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 h-screen bg-black/50 border-r border-primary/20 shadow-lg fixed overflow-y-auto">
            <div className="px-6 py-4 text-2xl font-bold flex items-center gap-2">
                <ShieldCheck className="text-primary"/>
                <span>Admin</span>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2">
                {navItems.map(item => (
                    <button 
                        key={item.name}
                        onClick={() => setActivePanel(item.name as AdminPanel)}
                        className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors",
                            activePanel === item.name ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:text-primary"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                    </button>
                ))}
            </nav>
            <div className="px-2 py-4 mt-auto">
                <button onClick={() => signOut()} className="w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium hover:bg-red-500/10 hover:text-red-500">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64">
            <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">

                {activePanel === 'Dashboard' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-6">
                                <h2 className="text-lg font-bold mb-2">Total Users</h2>
                                <p className="text-4xl font-semibold">{users.length}</p>
                            </div>
                            <div className="glass-card p-6">
                                <h2 className="text-lg font-bold mb-2">Total Posts</h2>
                                <p className="text-4xl font-semibold">{posts.length}</p>
                            </div>
                            <div className="glass-card p-6">
                                <h2 className="text-lg font-bold mb-2">Active Reports</h2>
                                <p className="text-4xl font-semibold">{reports.filter(r => !r.resolved).length}</p>
                            </div>
                        </div>
                    </div>
                )}

                {(activePanel === 'Users' || activePanel === 'CRM') && (
                    <div>
                        <h1 className="text-3xl font-bold mb-6">{activePanel === 'CRM' ? 'CRM' : 'User Management'}</h1>
                        <div className="glass-card p-4 overflow-x-auto">
                            <table className="w-full text-white text-sm">
                                <thead className="border-b border-white/10">
                                    <tr className="text-left">
                                        <th className="p-3">User</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">Points</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                    <tr key={u.uid} className="border-b border-white/10 last:border-0 hover:bg-white/5">
                                        <td className="p-3 flex items-center gap-3">
                                            <img src={u.avatarUrl || '/avatar-placeholder.png'} className="h-8 w-8 rounded-full object-cover" alt={u.name || u.email}/>
                                            <span>{u.name || 'N/A'}</span>
                                        </td>
                                        <td className="p-3">{u.email}</td>
                                        <td className="p-3">{u.points || 0}</td>
                                        <td className="p-3">
                                            {u.isAdmin && <span className="font-bold text-primary mr-2">ADMIN</span>}
                                            {u.isFrozen && <span className="font-bold text-red-500">FROZEN</span>}
                                            {!u.isFrozen && !u.isAdmin && <span className="text-green-400">Active</span>}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-1 justify-end">
                                                <Button size="sm" variant="ghost" onClick={() => toggleFreezeUser(u.uid, !(u.isFrozen || false))}>
                                                    <Ban className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => adjustPoints(u.uid, u.points || 0, 10)}>
                                                    <Award className="h-4 w-4" />+10
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => adjustPoints(u.uid, u.points || 0, -10)}>
                                                     <Award className="h-4 w-4" />-10
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => deleteUser(u.uid)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                 {activePanel === 'Posts' && (
                     <div>
                        <h1 className="text-3xl font-bold mb-6">Post Management</h1>
                        
                        <section className="glass-card p-6 mb-8">
                            <h2 className="font-semibold text-xl mb-4">📢 Creator Studio</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-white/80">Media</label>
                                    <div className="flex flex-col sm:flex-row gap-2 mt-1">
                                        <Input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={(e) => {
                                                setNewPostFile(e.target.files?.[0] || null);
                                                if (e.target.files?.[0]) setNewPostMediaUrl(''); // Clear URL if file is selected
                                            }}
                                            className="bg-black/40 border-white/20 file:text-primary file:font-semibold flex-1"
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-white/50">or</span>
                                            <Input
                                                type="text"
                                                placeholder="Enter Media URL"
                                                value={newPostMediaUrl}
                                                onChange={(e) => {
                                                    setNewPostMediaUrl(e.target.value);
                                                    if (e.target.value && fileInputRef.current) {
                                                        setNewPostFile(null); // Clear file if URL is entered
                                                        fileInputRef.current.value = '';
                                                    }
                                                }}
                                                className="bg-black/40 border-white/20 flex-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-white/80">Caption</label>
                                    <Textarea
                                        placeholder="Write a caption for your post..."
                                        value={newPostCaption}
                                        onChange={(e) => setNewPostCaption(e.target.value)}
                                        className="bg-black/40 border-white/20 mt-1"
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-white/80">Call to Action (Optional)</label>
                                    <div className="flex flex-col sm:flex-row gap-2 mt-1">
                                        <Input
                                            type="text"
                                            placeholder="Button Text (e.g., 'Shop Now')"
                                            value={newPostCtaText}
                                            onChange={(e) => setNewPostCtaText(e.target.value)}
                                            className="bg-black/40 border-white/20"
                                        />
                                        <Input
                                            type="url"
                                            placeholder="https://example.com"
                                            value={newPostCtaLink}
                                            onChange={(e) => setNewPostCtaLink(e.target.value)}
                                            className="bg-black/40 border-white/20"
                                        />
                                    </div>
                                </div>

                                <div>
                                     <label className="text-sm font-medium text-white/80">Post Type</label>
                                     <Select onValueChange={setNewPostType} value={newPostType}>
                                        <SelectTrigger className="w-full sm:w-[180px] bg-black/40 border-white/20 mt-1">
                                            <SelectValue placeholder="Select post type" />
                                        </SelectTrigger>
                                        <SelectContent className="glass-card">
                                            <SelectItem value="standard">Standard</SelectItem>
                                            <SelectItem value="advertisement">Advertisement</SelectItem>
                                            <SelectItem value="promotion">Promotion</SelectItem>
                                            <SelectItem value="featured">Featured</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                {isUploading && <Progress value={uploadProgress} className="h-2" />}
                                
                                <Button onClick={handleCreatePost} disabled={isUploading} className="w-full sm:w-auto">
                                    {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving Draft...</> : "Save as Draft"}
                                </Button>
                            </div>
                        </section>

                        <h2 className="text-2xl font-bold mb-4">Live Feed Control</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map(p => (
                                <div key={p.id} className="relative group">
                                    <ReviewCard post={p} />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-20">
                                        <Button size="sm" variant="secondary" onClick={() => togglePostVisibility(p.id!, p.visible === false)}>
                                           {p.visible === false ? <><Eye className="mr-2" /> Make Visible</> : <><EyeOff className="mr-2"/> Hide Post</>}
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => deletePost(p.id!)}>
                                            <Trash2 className="mr-2" /> Delete Post
                                        </Button>
                                         <p className="text-xs text-white/50 absolute bottom-2">{p.id}</p>
                                    </div>
                                    {p.visible === false && (
                                        <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">HIDDEN</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                 {activePanel === 'Reports' && (
                     <div>
                        <h1 className="text-3xl font-bold mb-6">Report Queue</h1>
                         <div className="glass-card p-4">
                            <p className="text-white/60">Report management UI coming soon.</p>
                         </div>
                    </div>
                )}

                 {activePanel === 'Notifications' && (
                     <div>
                        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
                         <div className="glass-card p-6">
                            <h2 className="text-xl font-semibold mb-4">Send Broadcast Message</h2>
                            <div className="flex gap-2">
                                <Input placeholder="Message to all users..." value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} className="bg-black/40"/>
                                <Button onClick={sendBroadcast}><Bell className="mr-2 h-4 w-4" /> Send</Button>
                            </div>
                        </div>
                    </div>
                )}
                 {activePanel === 'Settings' && (
                     <div>
                        <h1 className="text-3xl font-bold mb-6">Settings</h1>
                         <div className="glass-card p-4">
                            <p className="text-white/60">Global settings UI coming soon.</p>
                         </div>
                    </div>
                )}
                
                {comingSoonPanels.includes(activePanel as AdminPanel) && (
                    <div>
                        <h1 className="text-3xl font-bold mb-6">{activePanel}</h1>
                        <div className="glass-card p-4">
                            <p className="text-white/60">This section is under construction.</p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    </div>
  );
}

    

    

    

    

    

    