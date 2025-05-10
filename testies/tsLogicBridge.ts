// tsLogicBridge.ts
// Lightweight entry script to expose TypeScript logic (e.g. CSV import, analytics)
// so that Python voiceAgent can "curl" or "subprocess" it.
// Usage (from Python):
//   result = subprocess.check_output(['npm','run','logic','--',JSON.stringify({cmd:"ingest",csv:"..."})])
// The script reads a single JSON argument from process.argv[2] and prints JSON.

import { readFileSync } from 'fs';
import { csvToShipments } from './src/utils/csvToShipments';
import { computeShipmentInsights } from './src/lib/analytics/shipmentTabData';
import { Shipment } from './src/types/deeptrack';

interface BridgeRequest {
  cmd: 'ingest' | 'insights';
  csv?: string; // when cmd === 'ingest'
  dataPath?: string; // optional path to CSV
  jsonData?: Shipment[]; // when cmd === 'insights'
}

function main() {
  try {
    const rawArg = process.argv[2] || '{}';
    const req: BridgeRequest = JSON.parse(rawArg);

    if (req.cmd === 'ingest') {
      let csvText = req.csv ?? '';
      if (!csvText && req.dataPath) {
        csvText = readFileSync(req.dataPath, 'utf-8');
      }
      const shipments = csvToShipments(csvText);
      console.log(JSON.stringify({ ok: true, shipments }));
    } else if (req.cmd === 'insights') {
      const shipments = req.jsonData ?? [];
      const metrics = computeShipmentInsights(shipments);
      console.log(JSON.stringify({ ok: true, metrics }));
    } else {
      console.error(JSON.stringify({ ok: false, error: 'Unknown cmd' }));
      process.exit(1);
    }
  } catch (err: any) {
    console.error(JSON.stringify({ ok: false, error: err?.message || String(err) }));
    process.exit(1);
  }
}

main();
