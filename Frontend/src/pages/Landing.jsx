import { useEffect } from 'react'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import LivePreview from '../components/landing/LivePreview'
import DisasterTypeGrid from '../components/landing/DisasterTypeGrid'
import Footer from '../components/ui/Footer'
import { useIncidentStore } from '../store/useIncidentStore'
import { useSocketStore } from '../store/useSocketStore'

export default function Landing() {
  const { fetchStatsSummary, fetchStatsByType } = useIncidentStore()
  const { connect, disconnect } = useSocketStore()

  useEffect(() => {
    fetchStatsSummary()
    fetchStatsByType()
    connect()
    return () => disconnect()
  }, [])

  return (
    <main className="min-h-screen bg-deep-slate">
      <Hero />
      <Features />
      <LivePreview />
      <DisasterTypeGrid />
      <Footer />
    </main>
  )
}
