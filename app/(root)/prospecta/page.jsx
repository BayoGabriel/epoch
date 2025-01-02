import DeadlineTracker from '@/components/prospecta/DeadlineTracker'
import Hero from '@/components/prospecta/Hero'
import SubmitOpportunity from '@/components/prospecta/Submit'
import Weekly from '@/components/prospecta/Weekly'
import SupportUs from '@/components/shared/SupportUs'

const Prospecta = () => {
  return (
    <div>
      <Hero/>
      <SubmitOpportunity/>
      <DeadlineTracker/>
      <Weekly/>
      <SupportUs/>
    </div>
  )
}

export default Prospecta