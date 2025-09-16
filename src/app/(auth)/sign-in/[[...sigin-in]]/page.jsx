import { SignIn } from "@clerk/nextjs";


export default function SigninInPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center p-10">
      <SignIn />
    </main>
  );
}