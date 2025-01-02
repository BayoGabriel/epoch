import Achievement from '@/components/fellowship/Achievement'
import Gain from '@/components/fellowship/Gain'
import Hero from '@/components/fellowship/Hero'
import Program from '@/components/fellowship/Program'
import Feedback from '@/components/shared/Feedback'
import Faq from '@/components/fellowship/Faq'
import React from 'react'

const FELLOWSHIP = () => {
  return (
    <div>
        <Hero/>
        <Gain/>
        <Program/>
        <Achievement/>
        <Feedback/>
        <Faq/>
    </div>
  )
}

export default FELLOWSHIP