'use client';
import React, { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import AdminRow from '@/components/admin-row';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2, Eye, EyeOff, Check, ShieldCheck, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AppUser, Post, Report } from '@/lib/types';


export default function AdminPage() {
  const { user: authUser } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [users, setUsers] = useState<AppUser[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [adminEmail, setAdminEmail] = useState('');
  const [isMakingAdmin, setIsMakingAdmin] = useState(false);

  const [feedBlackout, setFeedBlackout] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  useEffect(() => {
    if (!firestore) return;
    if (!isAdmin) {
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
  }, [firestore, isAdmin]);
  
  useEffect(() => {
    if (!firestore || !authUser) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    let mounted = true;
    const check = async () => {
      const uRef = doc(firestore, 'users', authUser.uid);
      const uSnap = await getDoc(uRef);
      if (!mounted) return;
      setIsAdmin(!!uSnap.data()?.isAdmin);
      setLoading(false);
    };
    check();
    return () => { mounted = false; };
  }, [firestore, authUser]);

  const makeAdminClientSide = async (email: string) => {
    if (!firestore) return;
    setIsMakingAdmin(true);
    try {
      const found = users.find(u => u.email === email);
      if (!found) throw new Error('User document not found for that email.');
      const uRef = doc(firestore, 'users', found.uid);
      await updateDoc(uRef, { isAdmin: true });
      toast({ title: 'Success', description: `${email} marked as admin.` });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message || 'Failed to set admin flag' });
    } finally {
      setIsMakingAdmin(false);
    }
  };

  const toggleVisibility = async (postId: string, visible: boolean) => {
    if (!firestore) return;
    try {
      const pRef = doc(firestore, 'feed', postId);
      await updateDoc(pRef, { visible });
      toast({ title: 'Visibility updated' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const deletePost = async (postId: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'feed', postId));
      toast({ title: 'Post deleted' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const resolveReport = async (reportId: string, postId?: string, deletePostAlso = false) => {
    if (!firestore) return;
    try {
      const rRef = doc(firestore, 'reports', reportId);
      await updateDoc(rRef, { resolved: true, resolvedAt: new Date() });
      if (deletePostAlso && postId) {
        await deleteDoc(doc(firestore, 'feed', postId));
      }
      toast({ title: 'Report resolved' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
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
    await updateDoc(doc(firestore, 'users', userId), { points: (currentPoints || 0) + amount });
    toast({ title: `Points updated` });
  };

  // --- Feed Blackout ---
  const toggleFeedBlackout = async () => {
    setFeedBlackout(!feedBlackout);
    // In a real app, this would likely write to a global config document in Firestore
    toast({ title: feedBlackout ? 'Feed restored' : 'Feed blacked out (simulated)' });
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

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-black text-white">Loading...</div>;
  if (!isAdmin) return <div className="flex items-center justify-center min-h-screen bg-black text-white">Access Denied.</div>;


  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 pt-20 sm:pt-24 flex-1 pb-16 md:pb-24 space-y-6">
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">🔥 Enterprise Admin Console</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => auth && firebaseSignOut(auth)}>Sign out</Button>
          </div>
        </div>

        {/* --- Top Level Controls --- */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Feed Controls</h2>
              <Button onClick={toggleFeedBlackout} variant={feedBlackout ? 'destructive' : 'default'}>
                {feedBlackout ? 'Restore Feed' : 'Blackout Feed'}
              </Button>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Broadcast Message</h2>
              <div className="flex gap-2">
                <Input placeholder="Message to all users..." value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} className="bg-black/40"/>
                <Button onClick={sendBroadcast}><Bell className="mr-2 h-4 w-4" /> Send</Button>
              </div>
            </section>
         </div>


        <section className="glass-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold flex items-center gap-2"><ShieldCheck /> Grant Admin</h2>
              <p className="text-sm text-white/70">This writes `isAdmin: true` to the users document. Secured via Firestore Rules.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="bg-black/40" placeholder="user@example.com" />
              <Button onClick={() => makeAdminClientSide(adminEmail)} disabled={isMakingAdmin}>{isMakingAdmin ? <Loader2 className="animate-spin" /> : 'Make Admin'}</Button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-4">
            <h3 className="font-semibold mb-2">Users ({users.length})</h3>
            <div className="max-h-[600px] overflow-y-auto pr-2">
                {users.map(u => (
                  <AdminRow key={u.uid}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img src={u.avatarUrl || '/avatar-placeholder.png'} className="h-10 w-10 rounded-full object-cover" alt={u.name || u.email}/>
                          <div>
                            <div className="text-sm font-medium">{u.name || u.email}</div>
                            <div className="text-xs text-white/60">{u.email}</div>
                            <div className="text-xs mt-1 space-x-2">
                                {u.isAdmin && <span className="font-bold text-primary">ADMIN</span>}
                                {u.isFrozen && <span className="font-bold text-red-500">FROZEN</span>}
                            </div>
                             <div className="text-xs text-white/60 mt-1">Points: {u.points || 0}</div>
                          </div>
                        </div>

                         <div className="flex flex-wrap items-center gap-1 justify-end">
                            <Button size="sm" variant="outline" onClick={() => toggleFreezeUser(u.uid, !(u.isFrozen || false))}>{u.isFrozen ? <Eye /> : <EyeOff />}</Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteUser(u.uid)}><Trash2 /></Button>
                            <Button size="sm" variant="secondary" onClick={() => adjustPoints(u.uid, u.points || 0, 10)}>+10</Button>
                            <Button size="sm" variant="secondary" onClick={() => adjustPoints(u.uid, u.points || 0, -10)}>-10</Button>
                        </div>
                    </div>
                  </AdminRow>
                ))}
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="font-semibold mb-2">Recent Posts ({posts.length})</h3>
             <div className="max-h-[600px] overflow-y-auto pr-2">
                {posts.map(p => (
                  <AdminRow key={p.id} actions={<>
                    <Button size="sm" variant="ghost" onClick={() => toggleVisibility(p.id, !p.visible)} title="Toggle visibility">
                      {p.visible ? <EyeOff /> : <Eye />}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deletePost(p.id)} title="Delete post"><Trash2 /></Button>
                  </>}>
                    <div className="text-sm">{p.caption || '—'}</div>
                    <div className="text-xs text-white/60">by {p.userId} • {p.createdAt?.seconds ? new Date(p.createdAt.seconds * 1000).toLocaleString() : 'just now'}</div>
                     <div className="text-xs text-white/60">Likes: {p.likeCount || 0} • Comments: {p.commentCount || 0} • Shares: {p.shareCount || 0}</div>
                  </AdminRow>
                ))}
            </div>
          </div>

        </div>
        
        <div className="glass-card p-4">
            <h3 className="font-semibold mb-2">Reports ({reports.filter(r => !r.resolved).length})</h3>
             <div className="max-h-[400px] overflow-y-auto pr-2">
                {reports.filter(r => !r.resolved).map(r => (
                  <AdminRow key={r.id} actions={<>
                    <Button size="sm" variant="outline" onClick={() => resolveReport(r.id)} title="Resolve"><Check /></Button>
                    <Button size="sm" variant="destructive" onClick={() => resolveReport(r.id, r.postId, true)} title="Delete post & resolve"><Trash2 /></Button>
                  </>}>
                    <div className="text-sm">{r.reason || 'Flagged content'}</div>
                    <div className="text-xs text-white/60">post: {r.postId} • by {r.reporterId} • {r.resolved ? 'resolved' : 'open'}</div>
                  </AdminRow>
                ))}
            </div>
          </div>

      </main>
    </div>
  );
}
