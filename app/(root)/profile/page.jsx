"use client"
import React, { useState } from 'react'
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ 
        redirect: false // We'll handle redirection manually
      });
      
      // Show success toast
      
      
      // Redirect to homepage
      router.push('/');
    } catch (error) {
      // Show error toast
      console.error('Logout failed. Please try again.');
      console.error('Logout failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      {!session ? (
        <>
          <div className='flex flex-col gap-8'>
            <span>
              You are not logged in!
            </span>
            <Link 
              href="/" 
              className="primarybtn"
            >
              Go to Home page
            </Link>
          </div>
        </>
      ) : (
        <>
          {/* <button 
            onClick={handleSignOut} 
            className="primarybtn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </button> */}
          
        </>
      )}
    </div>
  )
}

export default Page