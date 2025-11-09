
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useStorage, useFirestore } from '@/firebase';
import { Header } from '@/components/header';
import { PageLoader } from '@/components/page-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Camera, User, Loader2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

export default function EditProfilePage() {
  const { user, isUserLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const storage = useStorage();
  const firestore = useFirestore();
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('Just a beauty enthusiast sharing my honest thoughts on the latest products. ✨');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setAvatarUrl(user.avatarUrl || '');
      // Note: Bio is not currently stored in the user object from the provider.
      // You might want to add it to the user's Firestore document.
    }
  }, [user]);

  if (isUserLoading || !user || !firestore || !storage) {
    return <PageLoader />;
  }

  const handleSave = async () => {
    setIsSaving(true);
    let newAvatarUrl = avatarUrl;

    try {
        if (avatarFile) {
            const fileRef = ref(storage, `users/${user.uid}/profile.jpg`);
            await uploadBytes(fileRef, avatarFile);
            newAvatarUrl = await getDownloadURL(fileRef);
        }

        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, {
            name: name,
            username: username,
            avatarUrl: newAvatarUrl,
            // bio: bio, // Uncomment this line if you add a 'bio' field to your user documents
        });

      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
      router.push(`/users/${user.uid}`);
    } catch (error: any) {
        console.error("Profile update failed:", error);
        toast({
            variant: 'destructive',
            title: 'Update failed',
            description: error.message || 'Could not save your profile changes.',
        });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
            <User
                className="h-10 w-10 text-primary"
                style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
            />
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Edit Profile</h1>
                <p className="text-md sm:text-lg text-white/70">
                    Update your public profile information.
                </p>
            </div>
        </div>

        <div className="glass-card p-6 md:p-8 space-y-6">
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary/50">
                        <AvatarImage src={avatarUrl} alt={name} />
                        <AvatarFallback>{name ? name.charAt(0) : 'U'}</AvatarFallback>
                    </Avatar>
                    <Button asChild size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 sm:h-10 sm:w-10">
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                            <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                            <input id="avatar-upload" type="file" className="sr-only" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-white/80">Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 bg-black/40 border-white/20 placeholder:text-white/40 h-11"/>
                </div>
                 <div>
                    <label className="text-sm font-medium text-white/80">Username</label>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 bg-black/40 border-white/20 placeholder:text-white/40 h-11"/>
                </div>
                 <div>
                    <label className="text-sm font-medium text-white/80">Bio</label>
                    <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="mt-1 bg-black/40 border-white/20 placeholder:text-white/40"/>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    Save Changes
                </Button>
            </div>
        </div>
      </main>
    </div>
  );
}
