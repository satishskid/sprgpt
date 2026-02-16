import { SignIn, SignedOut } from "@clerk/nextjs";
import dynamic from 'next/dynamic';

const SignInComponent = dynamic(() => Promise.resolve(SignIn), {
  ssr: false,
  loading: () => <div className="text-white">Loading...</div>
});

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-grid flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-dots"></div>
      <div className="max-w-md w-full relative z-10">
        <SignedOut>
          <SignInComponent 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700"
              }
            }}
            fallbackRedirectUrl="/dashboard"
          />
        </SignedOut>
      </div>
    </div>
  );
}
