'use client';
import { useState } from "react";
import { useAuth, useFirestore, useStorage, FirestorePermissionError, errorEmitter } from "@/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function FeedUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { user } = useAuth();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const router = useRouter();

  const handleUpload = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!file || !firestore || !storage) {
      toast({ variant: 'destructive', title: 'Please choose a photo!' });
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const fileName = `${user.uid}_${Date.now()}`;
      const fileRef = ref(storage, `feed/${fileName}`);

      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          toast({ variant: 'destructive', title: 'Upload failed', description: error.message });
          setUploading(false);
        },
        async () => {
          const photoUrl = await getDownloadURL(uploadTask.snapshot.ref);
          
          const feedCollection = collection(firestore, "feed");

          addDocumentNonBlocking(feedCollection, {
            userId: user.uid,
            photoUrl,
            caption,
            visible: true,
            createdAt: serverTimestamp(),
            likeCount: 0,
            commentCount: 0,
          });

          toast({ title: 'Post uploaded successfully!' });
          setFile(null);
          setCaption("");
          setUploading(false);
          setProgress(0);
          
          // Clear file input
          const fileInput = document.getElementById('file-input') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        }
      );
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({ variant: 'destructive', title: 'Upload failed', description: error.message });
      setUploading(false);
    }
  };
  
  if (!user) {
      return (
        <div className="container mx-auto max-w-md py-8 mt-16">
            <div className="glass-card p-4 sm:p-6 text-center">
                <h2 className="text-lg font-semibold mb-2 text-white">Join the conversation!</h2>
                <p className="text-white/70 mb-4">Sign in to share your own reviews.</p>
                <Button onClick={() => router.push('/login')} className="bg-primary text-primary-foreground hover:bg-primary/90">Sign In to Post</Button>
            </div>
        </div>
      )
  }

  return (
    <div className="container mx-auto max-w-md py-8 mt-16">
        <div className="glass-card p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4 text-white">Create a new post</h2>

        <div className="space-y-4">
            <Input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="bg-black/40 border-white/20 file:text-primary file:font-semibold placeholder:text-white/40"
            />

            <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="bg-black/40 border-white/20 placeholder:text-white/40 focus-visible:ring-offset-0 focus-visible:ring-primary"
            />

            {uploading && <Progress value={progress} className="h-2"/>}

            <Button
            disabled={uploading || !file}
            onClick={handleUpload}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
            {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Post"}
            </Button>
        </div>
        </div>
    </div>
  );
}
