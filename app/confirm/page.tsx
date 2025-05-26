"use client";
import Link from "next/link";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export default function ConfirmPage() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative overflow-hidden">
      <Confetti width={dimensions.width} height={dimensions.height} numberOfPieces={250} recycle={false} />
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center z-10">
        <svg className="mx-auto mb-4 w-16 h-16 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4 -4m5 2a9 9 0 1 1 -18 0a9 9 0 0 1 18 0z" />
        </svg>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">Email Confirmed!</h1>
        <p className="text-gray-700 mb-6 text-base sm:text-lg">Your email has been confirmed! Welcome to the club.</p>
        <Link href="/" className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-6 py-3 transition-colors duration-200 w-full sm:w-auto">Return to Home</Link>
      </div>
    </div>
  );
} 