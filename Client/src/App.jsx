import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold">Welcome to InterviewOne</h1>

      <SignedOut>
        <SignInButton mode="modal"></SignInButton>
        <SignUpButton mode="modal" />
      </SignedOut>

      <SignedIn>
        <SignOutButton />
      </SignedIn>

      <UserButton />
    </>
  );
}

export default App;
