//app/(root)/dashboard/page.js
"use client"
import Hero from '@/components/dashboard/Hero'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'
import { useSession } from 'next-auth/react'
import React from 'react'

const Page = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div>
      {isAdmin && <AnalyticsDashboard />}
      <Hero />
    </div>
  )
}

export default Page