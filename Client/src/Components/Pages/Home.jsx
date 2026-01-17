import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiPlay, FiCheck } from "react-icons/fi";
import {
  BsCameraVideo,
  BsCodeSlash,
  BsPeople,
  BsLightning,
  BsShield,
  BsGlobe,
} from "react-icons/bs";
import { SignInButton } from "@clerk/clerk-react";
import Footer from "../Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
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

          {/* Right: CTA */}
          <SignInButton mode="modal">
            <button className="btn btn-primary">Get Started</button>
          </SignInButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24 overflow-hidden">
        {/* Background Hero Image - positioned to blend with content */}
        <div className="absolute right-0 top-0 w-full lg:w-3/5 h-full pointer-events-none">
          <img
            src="/hero.png"
            alt="Coding Interview"
            className="w-full h-full object-contain object-right opacity-90"
          />
        </div>

        {/* Content overlaying the image */}
        <div className="relative z-20 max-w-2xl space-y-6">
          {/* Heading */}
          <div>
            <h1 className="text-5xl lg:text-7xl font-bold text-base-content leading-tight  whitespace-nowrap">
              Built for Interviews <br />
              <span className="text-primary"> Designed for Practice</span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-lg text-base-content/70 max-w-max">
            Do you need a platform to ace your technical interviews? Here's the
            super easy platform for collaborative coding. Connect face-to-face,
            code in real-time, and make it successful!
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/80 backdrop-blur-sm">
              <BsCameraVideo className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Live Video Chat</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/80 backdrop-blur-sm">
              <BsCodeSlash className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Code Editor</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/80 backdrop-blur-sm">
              <BsPeople className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Collaboration</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/problem" className="btn btn-primary btn-lg">
              Start Coding Now
              <FiArrowRight className="h-5 w-5 ml-1" />
            </Link>
            <button className="btn btn-outline btn-lg">
              <FiPlay className="h-5 w-5 mr-1" />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-6">
            <div>
              <h3 className="text-3xl font-bold text-primary">10K+</h3>
              <p className="text-sm text-base-content/60">Active Users</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-primary">50K+</h3>
              <p className="text-sm text-base-content/60">Sessions</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-primary">99.9%</h3>
              <p className="text-sm text-base-content/60">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-base-content mb-4">
              Everything You Need to
              <span className="text-primary"> Succeed</span>
            </h2>
            <p className="text-base-content/60 max-w-2xl mx-auto">
              Powerful features designed to make your coding interviews seamless
              and productive
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* HD Video Call */}
            <div className="bg-base-200 rounded-2xl p-8 border border-base-300 hover:border-primary/30 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <BsCameraVideo className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-base-content mb-3">
                HD Video Call
              </h3>
              <p className="text-base-content/60">
                Crystal clear video and audio for seamless communication during
                interviews
              </p>
            </div>

            {/* Live Code Editor */}
            <div className="bg-base-200 rounded-2xl p-8 border border-base-300 hover:border-primary/30 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <BsCodeSlash className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-base-content mb-3">
                Live Code Editor
              </h3>
              <p className="text-base-content/60">
                Collaborate in real-time with syntax highlighting and multiple
                language support
              </p>
            </div>

            {/* Easy Collaboration */}
            <div className="bg-base-200 rounded-2xl p-8 border border-base-300 hover:border-primary/30 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <BsPeople className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-base-content mb-3">
                Easy Collaboration
              </h3>
              <p className="text-base-content/60">
                Share your screen, discuss solutions, and learn from each other
                in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why InterviewOne Section */}
      <section className="py-20 px-6 bg-base-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-base-content">
                Why <span className="text-primary">InterviewOne</span>?
              </h2>
              <p className="text-lg text-base-content/70">
                We built InterviewOne to solve the real challenges developers
                face during technical interviews. Our platform is designed with
                both interviewers and candidates in mind.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BsLightning className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content mb-1">
                      Lightning Fast Setup
                    </h4>
                    <p className="text-base-content/60 text-sm">
                      Get started in seconds. No complex configurations or
                      installations required.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BsShield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content mb-1">
                      Secure & Private
                    </h4>
                    <p className="text-base-content/60 text-sm">
                      Enterprise-grade security ensures your code and
                      conversations stay private.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BsGlobe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content mb-1">
                      Works Everywhere
                    </h4>
                    <p className="text-base-content/60 text-sm">
                      Browser-based platform works on any device, anywhere in
                      the world.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Stats/Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-base-100 rounded-2xl p-6 border border-base-300">
                <h3 className="text-4xl font-bold text-primary mb-2">50+</h3>
                <p className="text-base-content/60">Programming Languages</p>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 border border-base-300">
                <h3 className="text-4xl font-bold text-primary mb-2">24/7</h3>
                <p className="text-base-content/60">Platform Availability</p>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 border border-base-300">
                <h3 className="text-4xl font-bold text-primary mb-2">
                  &lt;100ms
                </h3>
                <p className="text-base-content/60">Code Sync Latency</p>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 border border-base-300">
                <h3 className="text-4xl font-bold text-primary mb-2">Free</h3>
                <p className="text-base-content/60">To Get Started</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-12 border border-primary/20">
            <h2 className="text-4xl lg:text-5xl font-bold text-base-content mb-4">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="text-lg text-base-content/70 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already using InterviewOne to
              practice, prepare, and succeed in their technical interviews.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Start Coding Now
                <FiArrowRight className="h-5 w-5 ml-1" />
              </Link>
              <Link to="/about" className="btn btn-outline btn-lg">
                Learn More
              </Link>
            </div>
            <p className="text-sm text-base-content/50 mt-6">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
