'use client';
import { Header } from '@/components/header';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
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
          <FileText
            className="h-10 w-10 text-primary"
            style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
          />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Terms of Service</h1>
            <p className="text-md sm:text-lg text-white/70">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="glass-card p-6 md:p-8 prose prose-invert prose-p:text-white/80 prose-headings:text-white prose-strong:text-white/90 max-w-none">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p>
            Welcome to Shezso ("we", "our", "us"). These Terms of Service ("Terms") govern your use of our mobile application and website (collectively, the "Service"). By creating an account or using our Service, you agree to be bound by these Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-6">2. User Accounts</h2>
          <p>
            You must be at least 13 years old to create an account. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>

          <h2 className="text-2xl font-semibold mt-6">3. User Conduct and Content</h2>
          <p>
            You are solely responsible for the text, photos, reviews, and other content ("User Content") that you post on the Service. You agree not to post User Content that is illegal, offensive, defamatory, or infringes on any third-party rights. We reserve the right, but are not obligated, to remove or modify User Content for any reason, including User Content that we believe violates these Terms.
          </p>
          <p>
            By posting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content in connection with the Service.
          </p>

          <h2 className="text-2xl font-semibold mt-6">4. Hardware and App Permissions</h2>
          <p>
            To provide the full functionality of our Service, you may be asked to grant permissions for the app to access your device's camera, microphone, and storage. By agreeing to these Terms, you consent to:
          </p>
          <ul>
            <li><strong>Camera & Microphone Access:</strong> Allowing the app to use your camera and microphone for features such as creating video reviews or taking photos of products.</li>
            <li><strong>Cache and Storage:</strong> Allowing the app to store data on your device (cache) to improve performance and user experience.</li>
            <li><strong>Add to Home Screen (PWA):</strong> Consenting to the app's Progressive Web App (PWA) being added to your device's home screen for easier access.</li>
          </ul>
          <p>
            You can manage these permissions in your device settings, but disabling them may limit your ability to use certain features of the Service.
          </p>

          <h2 className="text-2xl font-semibold mt-6">5. Prohibited Activities</h2>
          <p>
            You agree not to engage in any of the following prohibited activities: (a) using any automated system to access the Service; (b) engaging in any activity that interferes with or disrupts the Service; (c) impersonating another person or otherwise misrepresenting your affiliation with a person or entity.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6">6. Termination</h2>
          <p>
            We may terminate or suspend your account at our sole discretion, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6">7. Disclaimers and Limitation of Liability</h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, regarding the operation or availability of the Service. In no event shall Shezso be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Service.
          </p>

          <h2 className="text-2xl font-semibold mt-6">8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Service after any such change constitutes your acceptance of the new Terms.
          </p>
        </div>
      </main>
    </div>
  );
}
