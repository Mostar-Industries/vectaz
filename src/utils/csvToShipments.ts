import { Shipment } from "@/types/deeptrack";

/**
 * Convert a CSV string (with the provided base schema) to an array of Shipment objects.
 * Missing DeepTrack-specific fields are filled with neutral defaults so that
 * downstream analytics continue to work without runtime errors.
 *
 * Expected CSV header:
 * origin_country,origin_longitude,origin_latitude,destination_country,destination_longitude,destination_latitude
 */
export function csvToShipments(csvText: string): Shipment[] {
  if (!csvText) return [];

  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length <= 1) return [];

  const header = lines[0].split(",").map((h) => h.trim());

  const indexOf = (key: string) => header.indexOf(key);

  const get = (values: string[], key: string) => values[indexOf(key)] ?? "";

  const shipments: Shipment[] = lines.slice(1).filter(Boolean).map((line, idx) => {
    const values = line.split(",").map((v) => v.trim());

    const origin_country = get(values, "origin_country");
    const origin_longitude = parseFloat(get(values, "origin_longitude"));
    const origin_latitude = parseFloat(get(values, "origin_latitude"));
    const destination_country = get(values, "destination_country");
    const destination_longitude = parseFloat(get(values, "destination_longitude"));
    const destination_latitude = parseFloat(get(values, "destination_latitude"));

    const today = new Date();
    const collection = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10);
    const arrival = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2);

    const request_reference = `BASE_${idx.toString().padStart(4, "0")}`;

    const shipment: Shipment = {
      request_reference,
      origin_country,
      origin_latitude,
      origin_longitude,
      destination_country,
      destination_latitude,
      destination_longitude,
      // Defaults and neutral placeholders for required fields
      id: request_reference, // Assuming request_reference can serve as a temporary ID
      expected_delivery_date: null,
      created_at: today.toISOString(),
      updated_at: today.toISOString(),
      status: 'delivered',
      date_of_collection: collection.toISOString().split("T")[0],
      cargo_description: "General cargo",
      item_category: "Unspecified",
      freight_carrier: "Unknown Carrier",
      weight_kg: 0,
      volume_cbm: 0,
      initial_quote_awarded: "N/A",
      final_quote_awarded_freight_forwader_Carrier: "N/A",
      comments: "Imported from base CSV",
      date_of_arrival_destination: arrival.toISOString().split("T")[0],
      delivery_status: "Delivered",
      mode_of_shipment: "Road",
      forwarder_quotes: {},
    };

    return shipment;
  });

  return shipments;
}
