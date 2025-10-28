"use client";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left Side - Text */}
          <div className="space-y-6 md:space-y-7">
            <h1 className="text-5xl md:text-6xl leading-tight font-bold text-neutral-900">
              Accessible transport, made simple.
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 max-w-xl">
              Safe, affordable, and inclusive rides for everyone.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/rider"
                className="btn-primary text-base md:text-lg px-6 md:px-8 py-3"
              >
                Book a Ride
              </Link>
              <Link
                href="#how-it-works"
                className="border-2 border-brand-700 text-brand-700 px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-neutral-100"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Side - Illustration Placeholder */}
          <div className="map-container flex items-center justify-center min-h-[260px] md:min-h-[360px]">
            <div className="text-6xl">🚐</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-neutral-100 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            <div className="text-center mx-auto max-w-xs">
              <div className="w-16 h-16 bg-brand-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="font-semibold mb-2">
                Enter pickup and destination
              </h3>
            </div>
            <div className="text-center mx-auto max-w-xs">
              <div className="w-16 h-16 bg-brand-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🚐</span>
              </div>
              <h3 className="font-semibold mb-2">Choose accessible vehicle</h3>
            </div>
            <div className="text-center mx-auto max-w-xs">
              <div className="w-16 h-16 bg-brand-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold mb-2">
                Track your ride in real-time
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Transport for Everyone */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Transport designed for everyone.
            </h2>
            <p className="text-lg text-neutral-600 md:hidden">
              We work with councils and care providers to make every trip safe
              and dignified.
            </p>
          </div>
          <div>
            <p className="hidden md:block text-lg text-neutral-600 mb-8 max-w-2xl">
              We work with councils and care providers to make every trip safe
              and dignified.
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center mx-auto">
                <div className="w-12 h-12 bg-brand-700 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-xl">♿</span>
                </div>
                <p className="text-sm font-medium">
                  Wheelchair-accessible vehicles
                </p>
              </div>
              <div className="text-center mx-auto">
                <div className="w-12 h-12 bg-brand-700 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-xl">👥</span>
                </div>
                <p className="text-sm font-medium">
                  Assistance-trained drivers
                </p>
              </div>
              <div className="text-center mx-auto">
                <div className="w-12 h-12 bg-brand-700 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-xl">🛡️</span>
                </div>
                <p className="text-sm font-medium">24/7 Safety and support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-neutral-100 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12">
            What our riders say
          </h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="card-white">
              <div className="flex gap-1 mb-3">
                {"⭐⭐⭐⭐⭐".split("").map((s, i) => (
                  <span key={i} className="text-yellow-400">
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-neutral-600 mb-4">
                "Always reliable and the drivers are so understanding."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-700 rounded-full"></div>
                <span className="font-medium">Sarah</span>
              </div>
            </div>
            <div className="card-white">
              <div className="flex gap-1 mb-3">
                {"⭐⭐⭐⭐⭐".split("").map((s, i) => (
                  <span key={i} className="text-yellow-400">
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-neutral-600 mb-4">
                "Best accessible transport service I've ever used."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-700 rounded-full"></div>
                <span className="font-medium">James</span>
              </div>
            </div>
            <div className="card-white">
              <div className="flex gap-1 mb-3">
                {"⭐⭐⭐⭐⭐".split("").map((s, i) => (
                  <span key={i} className="text-yellow-400">
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-neutral-600 mb-4">
                "Comfortable and affordable. Highly recommend!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-700 rounded-full"></div>
                <span className="font-medium">Rebecca</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-sm">
              <Link href="#" className="hover:text-brand-700">
                Support
              </Link>
              <Link href="#" className="hover:text-brand-700">
                Privacy
              </Link>
              <Link href="#" className="hover:text-brand-700">
                Terms
              </Link>
              <Link href="#" className="hover:text-brand-700">
                Accessibility
              </Link>
            </div>
            <p className="text-sm text-neutral-600">admin@havenride.co.uk</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
