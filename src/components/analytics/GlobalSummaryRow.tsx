import React from 'react'

export default function GlobalSummaryRow({ summary }) {
  const cardClass = "bg-[#0A1A2F]/80 text-white rounded-lg p-4 shadow-md border border-[#00FFD1]/30"

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className={cardClass}>
        <div className="text-sm text-gray-400">Total Shipments</div>
        <div className="text-3xl font-bold text-[#00FFD1]">{summary.totalShipments}</div>
      </div>
      <div className={cardClass}>
        <div className="text-sm text-gray-400">Total Weight (KG)</div>
        <div className="text-3xl font-bold text-[#00FFD1]">{summary.totalWeightKg.toLocaleString()}</div>
      </div>
      <div className={cardClass}>
        <div className="text-sm text-gray-400">Total Volume (CBM)</div>
        <div className="text-3xl font-bold text-[#00FFD1]">{summary.totalVolumeCbm.toFixed(1)}</div>
      </div>
      <div className={cardClass}>
        <div className="text-sm text-gray-400">Distinct Destinations</div>
        <div className="text-3xl font-bold text-[#00FFD1]">{summary.distinctDestinations}</div>
      </div>
      <div className={cardClass}>
        <div className="text-sm text-gray-400">Distinct Forwarders</div>
        <div className="text-3xl font-bold text-[#00FFD1]">{summary.distinctForwarders}</div>
      </div>
      <div className={cardClass}>
        <div className="text-sm text-gray-400">Avg Cost / KG (USD)</div>
        <div className="text-3xl font-bold text-[#00FFD1]">{summary.avgCostPerKg.toFixed(2)}</div>
      </div>
    </div>
  )
}
