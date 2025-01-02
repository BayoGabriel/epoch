import Hero from '@/components/about/Hero'
import Mission from '@/components/about/MV'
import MVP from '@/components/about/MVP'
import Volunteer from '@/components/about/Volunteer'
import WhyWeCare from '@/components/about/WhyWeCare'
import SupportUs from '@/components/shared/SupportUs'
import Team from '@/components/shared/Team'
import React from 'react'

const About = () => {
  return (
    <>
        <Hero/>
        <Mission/>
        <Team/>
        <WhyWeCare/>
        <MVP/>
        <Volunteer/>
        <SupportUs/>
    </>
  )
}

export default About