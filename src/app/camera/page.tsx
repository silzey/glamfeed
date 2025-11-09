'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/header';
import { Camera, Zap, RefreshCw, ArrowLeft, Video, Loader2, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function CameraPage() {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [lastCapture, setLastCapture] = useState<string | null>(null);

  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    const getCameraPermission = async () => {
      setHasCameraPermission(null);
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: true,
        });
        setStream(newStream);
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera and microphone permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleFlipCamera = () => {
    if (isRecording) return;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setLastCapture(dataUrl);
            toast({
                title: "Photo Taken!",
                description: "Your photo has been captured.",
            })
        }
    }
  };

  const handleStartRecording = () => {
    if (!stream || isRecording) return;

    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      setLastCapture(videoUrl);
      toast({
        title: "Video Recorded!",
        description: "Your video has been saved.",
      });
      // In a real app, you would upload this blob.
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);

    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 59) {
          handleStopRecording();
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingTime(0);
    }
  };

  const handleCapture = () => {
    if (mode === 'photo') {
      handleTakePhoto();
    } else {
      if (isRecording) {
        handleStopRecording();
      } else {
        handleStartRecording();
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="flex-1 flex flex-col pt-16 sm:pt-20">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => router.back()} className="text-white/70 hover:text-white mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="relative w-full h-[60vh] max-h-[700px] bg-neutral-900 flex items-center justify-center overflow-hidden">
          {hasCameraPermission === null && (
            <div className="flex flex-col items-center gap-2 text-white/70">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p>Accessing Camera...</p>
            </div>
          )}

          {hasCameraPermission === false && (
             <div className="p-4 w-full max-w-sm">
                <Alert variant="destructive">
                  <AlertTitle>Permission Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera and microphone access to use this feature.
                  </AlertDescription>
                </Alert>
            </div>
          )}

          <video ref={videoRef} className={`w-full h-full object-cover ${hasCameraPermission ? '' : 'hidden'}`} autoPlay muted playsInline />
          <canvas ref={canvasRef} className="hidden" />

           {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 rounded-full px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              <p className="text-sm font-mono tracking-wider">{new Date(recordingTime * 1000).toISOString().substr(14, 5)}</p>
            </div>
          )}

          <div className="absolute top-4 left-4">
            <Button variant="ghost" size="icon" className="rounded-full bg-black/30 hover:bg-black/50 text-white">
              <Zap className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col items-center justify-around p-4 bg-black">
          <div className="flex items-center justify-center gap-8 text-sm font-medium text-white/70">
            <button onClick={() => setMode('photo')} className={cn(mode === 'photo' && "text-primary font-semibold", "cursor-pointer hover:text-white")}>PHOTO</button>
            <button onClick={() => setMode('video')} className={cn(mode === 'video' && "text-primary font-semibold", "cursor-pointer hover:text-white")}>VIDEO</button>
          </div>

          <div className="flex w-full items-center justify-around">
            <Link href="/reviews" passHref>
              <div className="h-16 w-16 rounded-md bg-neutral-800 overflow-hidden relative">
                {lastCapture && <Image src={lastCapture} alt="Last capture" fill className="object-cover" />}
              </div>
            </Link>
            <div className="flex items-center justify-center">
              <Button onClick={handleCapture} variant="outline" className={cn("h-20 w-20 rounded-full border-4 border-white bg-transparent hover:bg-white/10", isRecording && 'border-red-500')} aria-label="Take Photo" disabled={!hasCameraPermission}>
                  {isRecording && <StopCircle className="h-10 w-10 text-red-500 fill-current" />}
              </Button>
            </div>
            <Button onClick={handleFlipCamera} variant="ghost" size="icon" className="rounded-full bg-neutral-800 hover:bg-neutral-700 text-white h-16 w-16" disabled={!hasCameraPermission || isRecording}>
              <RefreshCw className="h-7 w-7" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}