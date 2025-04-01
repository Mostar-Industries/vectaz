
import destinationCountries from '@/core/base_reference/destinationCountries.json';

// Default coordinates for African countries if specific ones are not available
// These are approximate center points for countries
const countryCoordinates: Record<string, [number, number]> = {
  "DR Congo": [0.0, 25.0],
  "Kenya": [1.0, 38.0],
  "Uganda": [1.0, 32.0],
  "Tanzania": [-6.0, 35.0],
  "Ethiopia": [9.0, 40.0],
  "Somalia": [5.0, 46.0],
  "South Sudan": [7.0, 30.0],
  "Sudan": [15.0, 30.0],
  "Rwanda": [-2.0, 30.0],
  "Burundi": [-3.5, 30.0],
  "Zimbabwe": [-19.0, 29.0],
  "Zambia": [-15.0, 30.0],
  "Madagascar": [-20.0, 47.0],
  "Comoros": [-12.0, 44.0],
  "Mayotte": [-12.8, 45.2],
  "Mauritius": [-20.3, 57.5],
  "Congo Brazzaville": [-0.2, 15.8],
  "Malawi": [-13.5, 34.0],
  "Senegal": [14.5, -14.5],
  "Congo Kinshasa": [-4.0, 21.0],
  "Guinea": [10.0, -10.0],
  "Benin": [9.5, 2.3],
  "Chad": [15.0, 19.0],
  "Guinea Bissau": [12.0, -15.0],
  "Togo": [8.0, 1.2],
  "Cote d'lvoire": [7.5, -5.5],
  "Central Africa Republic": [7.0, 21.0],
  "Rwanda ": [-2.0, 30.0], // Duplicate with space in original data
  "Ghana": [7.9, -1.0],
  "Nigeria": [9.0, 8.0],
  "Eritrea": [15.0, 39.0],
  "Eswatini": [-26.5, 31.5],
  "Sierra Leone": [8.5, -11.5],
  "Sao Tome": [0.3, 6.7]
};

/**
 * Get marker data for all destination countries
 */
export const getDestinationMarkers = (): Array<{
  name: string;
  coordinates: [number, number];
}> => {
  return destinationCountries.map(country => ({
    name: country,
    coordinates: countryCoordinates[country] || [0, 0]
  })).filter(marker => 
    // Filter out markers with invalid coordinates
    marker.coordinates[0] !== 0 || marker.coordinates[1] !== 0
  );
};

/**
 * Create a randomized status for demo purposes
 */
export const getRandomStatus = (): 'Delivered' | 'In Transit' | 'Delayed' => {
  const statuses: Array<'Delivered' | 'In Transit' | 'Delayed'> = ['Delivered', 'In Transit', 'Delayed'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};
