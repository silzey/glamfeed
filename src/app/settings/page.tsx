
'use client';

import { Header } from '@/components/header';
import { Settings, Palette, Bell, Shield, Info, ArrowLeft, User as UserIcon, Volume2, ChevronRight, Edit } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useAuth, useStorage, useFirestore } from '@/firebase';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const settingsItems = [
    { href: '/settings', Icon: Palette, title: 'Appearance', description: 'Customize the app\'s look and feel.' },
    { href: '/sound', Icon: Volume2, title: 'Sound', description: 'Manage audio and sound preferences.' },
    { href: '/settings', Icon: Bell, title: 'Notifications', description: 'Choose what you want to be notified about.' },
    { href: '/settings', Icon: Shield, title: 'Privacy & Safety', description: 'Control your data and account privacy.' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, isUserLoading } = useAuth();
  const storage = useStorage();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleProfilePicUpload = async () => {
    if (!profilePicFile || !user || !storage || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'Please select a file and ensure you are logged in.',
      });
      return;
    }

    setIsUploading(true);
    const fileRef = ref(storage, `users/${user.uid}/profile.jpg`);
    
    try {
      await uploadBytes(fileRef, profilePicFile);
      const downloadURL = await getDownloadURL(fileRef);
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        avatarUrl: downloadURL
      });
      
      toast({
        title: 'Success!',
        description: 'Your profile picture has been updated. It may take a moment to reflect across the app.',
      });
      
      // Force a reload of the page to show the new avatar
      window.location.reload();

    } catch (error: any) {
      console.error("Profile picture upload failed:", error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error.message || 'Could not upload your profile picture.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <div className="mb-8">
            <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground -ml-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
        <div className="flex items-center gap-4 mb-8">
            <div className="bg-primary/10 p-3 rounded-xl">
                <Settings
                    className="h-6 w-6 text-primary"
                />
            </div>
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                    Customize your profile and app appearance.
                </p>
            </div>
        </div>

        <div className="space-y-8">

             <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                     <Avatar className="h-16 w-16 border-2 border-primary/50">
                        <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'}/>
                        <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <Input id="profile-pic-upload" type="file" accept="image/jpeg,image/png" onChange={(e) => setProfilePicFile(e.target.files?.[0] || null)} className="bg-black/40 border-white/20 file:text-primary file:font-semibold flex-1"/>
                         <div className="flex gap-2">
                             <Button onClick={handleProfilePicUpload} disabled={isUploading || !profilePicFile} size="sm">
                                {isUploading ? <Loader2 className="animate-spin" /> : 'Save Photo'}
                            </Button>
                             <Button variant="outline" size="sm" asChild>
                                <Link href="/profile/edit">
                                    <Edit className="mr-2 h-4 w-4"/>
                                    Edit Name & Bio
                                </Link>
                             </Button>
                        </div>
                    </div>
                </div>
              </CardContent>
            </Card>

            {settingsItems.map((item) => (
              <Card className="glass-card" key={item.title}>
                  <CardContent className="p-4">
                      <Link href={item.href} passHref>
                          <div className="flex items-center gap-4">
                              <item.Icon className="h-6 w-6 text-muted-foreground"/>
                              <div className="flex-1">
                                  <p className="font-semibold">{item.title}</p>
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground"/>
                          </div>
                      </Link>
                  </CardContent>
              </Card>
            ))}
        </div>
      </main>
    </div>
  );
}
