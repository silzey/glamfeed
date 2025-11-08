

'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/firebase';
import { useFirestore } from '@/firebase/hooks/use-firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2, Eye, EyeOff, Check, ShieldCheck, Bell, Users, LayoutDashboard, FileText, Settings, LogOut, Ban, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AppUser, Post, Report } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PageLoader } from '@/components/page-loader';


type AdminPanel = 'Dashboard' | 'Users' | 'Posts' | 'Reports' | 'Notifications' | 'Settings' | 'CRM';

export default function AdminPage() {
  const { user: authUser, signOut, isUserLoading } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [activePanel, setActivePanel] = useState<AdminPanel>('Dashboard');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  
  const [loading, setLoading] = useState(true);
  
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const isAdminUser = authUser?.email === 'kim@admincenral.com';
  
  const postAuthors = useMemo(() => {
    const authors = new Map<string, AppUser>();
    users.forEach(user => {
        authors.set(user.uid, user);
    });
    return authors;
  }, [users]);


  useEffect(() => {
    if (isUserLoading || !firestore) {
      return;
    }
    if(!isAdminUser) {
        setLoading(false);
        return;
    }

    setLoading(true);

    const unsubUsers = onSnapshot(query(collection(firestore, 'users'), orderBy('username', 'desc')), (snap) => {
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
  }, [firestore, isAdminUser, isUserLoading]);

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

  if (loading || isUserLoading) {
    return <PageLoader />;
  }

  if (!isAdminUser) {
    return <div className="flex items-center justify-center min-h-screen bg-black text-white">Access Denied.</div>;
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'CRM', icon: Users },
    { name: 'Users', icon: Users },
    { name: 'Posts', icon: FileText },
    { name: 'Reports', icon: Ban },
    { name: 'Notifications', icon: Bell },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen w-full bg-black text-white">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 h-screen bg-black/50 border-r border-primary/20 shadow-lg fixed">
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
            <div className="px-2 py-4">
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
                        <div className="glass-card p-4 overflow-x-auto">
                           <table className="w-full text-white text-sm">
                                <thead className="border-b border-white/10">
                                    <tr className="text-left">
                                        <th className="p-3">Post</th>
                                        <th className="p-3">Author</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map(p => {
                                        const author = postAuthors.get(p.userId);
                                        return (
                                            <tr key={p.id} className="border-b border-white/10 last:border-0 hover:bg-white/5">
                                                <td className="p-3 flex items-center gap-3">
                                                    <img src={p.photoUrl} className="h-10 w-10 rounded-md object-cover" alt="Post content"/>
                                                    <span className="truncate max-w-xs">{p.caption || 'No caption'}</span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <img src={author?.avatarUrl} className="h-6 w-6 rounded-full object-cover" alt={author?.name}/>
                                                        <span>{author?.name || 'Unknown'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    {p.visible === false ? 
                                                        <span className="font-bold text-red-500">Hidden</span> : 
                                                        <span className="text-green-400">Visible</span>}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-1 justify-end">
                                                        <Button size="sm" variant="ghost" onClick={() => togglePostVisibility(p.id, p.visible === false)}>
                                                           {p.visible === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                        </Button>
                                                        <Button size="sm" variant="destructive" onClick={() => deletePost(p.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                           </table>
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
            </div>
        </main>
    </div>
  );
}



    