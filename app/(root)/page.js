import Hero from '@/components/homepage/Hero'
import Offer from '@/components/homepage/Offer'
import WhatsNew from '@/components/homepage/WhatsNew'
import NewOpportunity from '@/components/homepage/NewOpportunity'
import Fellowship from '@/components/homepage/Fellowship'
import Feedback from '@/components/shared/Feedback'
import SupportUs from '@/components/shared/SupportUs'

const Homepage = () => {
  return (
    <div>
      <Hero/>
      <Offer/>
      <WhatsNew/>
      <NewOpportunity/>
      <Fellowship/>
      <Feedback/>
      <SupportUs/>
    </div>
  )
}

export default Homepage