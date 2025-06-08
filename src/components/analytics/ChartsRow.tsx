import { GlassContainer } from '@/components/ui/glass-effects'

export default function ChartsRow({ charts }) {
  const block = "bg-[#0A1A2F]/80 text-white rounded-lg p-4 shadow-md border border-[#00FFD1]/30"

  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      <GlassContainer className={block}>
        <h3 className="text-[#00FFD1] text-lg font-semibold mb-2">Shipments by Mode</h3>
        <pre className="text-white">{JSON.stringify(charts.shipmentsByMode, null, 2)}</pre>
      </GlassContainer>

      <GlassContainer className={block}>
        <h3 className="text-[#00FFD1] text-lg font-semibold mb-2">Monthly Trend</h3>
        <pre className="text-white">{JSON.stringify(charts.monthlyTrend, null, 2)}</pre>
      </GlassContainer>

      <GlassContainer className={block}>
        <h3 className="text-[#00FFD1] text-lg font-semibold mb-2">Forwarder Cost Distribution</h3>
        <pre className="text-white">{JSON.stringify(charts.forwarderCosts, null, 2)}</pre>
      </GlassContainer>

      <GlassContainer className={block}>
        <h3 className="text-[#00FFD1] text-lg font-semibold mb-2">Delivery Delays</h3>
        <pre className="text-white">{JSON.stringify(charts.delays, null, 2)}</pre>
      </GlassContainer>
    </div>
  )
}
