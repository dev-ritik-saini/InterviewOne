import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { BsCodeSlash, BsGrid } from "react-icons/bs";
import toast from "react-hot-toast";

const Navbar = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const prevSignedIn = useRef(null);
  const location = useLocation();
  const pathname = location.pathname;

  // Show toast on sign in/out
  useEffect(() => {
    if (!isLoaded) return;

    if (prevSignedIn.current === false && isSignedIn) {
      toast.success(`Welcome back, ${user?.firstName || "User"}!`);
    } else if (prevSignedIn.current === true && !isSignedIn) {
      toast.success("Signed out successfully");
    }

    prevSignedIn.current = isSignedIn;
  }, [isSignedIn, isLoaded, user]);

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
        >
          <img src="/logo.svg" alt="Logo" className="h-12 w-auto" />
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight text-base-content">
              Interview<span className="text-primary">One</span>
            </h1>
          </div>
        </Link>

        {/* Right: Navigation */}
        <div className="flex items-center gap-4">
          {!isLoaded ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : isSignedIn ? (
            <>
              <Link
                to="/problems"
                className={
                  pathname.startsWith("/problems")
                    ? "btn btn-primary btn-sm gap-2"
                    : "btn btn-ghost btn-sm gap-2"
                }
              >
                <BsCodeSlash className="h-4 w-4" />
                Problems
              </Link>
              <Link
                to="/dashboard"
                className={
                  pathname.startsWith("/dashboard")
                    ? "btn btn-primary btn-sm gap-2"
                    : "btn btn-ghost btn-sm gap-2"
                }
              >
                <BsGrid className="h-4 w-4" />
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="btn btn-primary">Get Started</button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
