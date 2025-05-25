// app/sign-up/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp 
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
        appearance={{
          variables: { 
            colorPrimary: "#41B3A2",
        
          },
          elements: {
            formButtonPrimary: "bg-[#41B3A2] hover:bg-[#41B3A2]/90",
            footerActionLink: "text-[#41B3A2] hover:text-[#41B3A2]/80"
          }
        }}
      />
    </div>
  );
}