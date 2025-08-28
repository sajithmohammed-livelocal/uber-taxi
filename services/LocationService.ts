export class LocationService {
  private static instance: LocationService;
  private currentLocation: any = null;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async getCurrentLocation(): Promise<any> {
    // Mock location for Libreville, Gabon
    const mockLocation = {
      latitude: 0.4162,
      longitude: 9.4673,
      address: 'Centre-ville, Libreville, Gabon',
    };

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.currentLocation = mockLocation;
    return mockLocation;
  }

  async searchPlaces(query: string): Promise<any[]> {
    // Mock places in Gabon
    const mockPlaces = [
      {
        id: '1',
        name: 'Aéroport International Léon-M\'ba',
        address: 'Aéroport International, Libreville, Gabon',
        latitude: 0.4586,
        longitude: 9.4128,
        type: 'airport',
      },
      {
        id: '2',
        name: 'Port-Gentil',
        address: 'Port-Gentil, Ogooué-Maritime, Gabon',
        latitude: -0.7193,
        longitude: 8.7815,
        type: 'city',
      },
      {
        id: '3',
        name: 'Université Omar Bongo',
        address: 'Boulevard Triomphal Omar Bongo, Libreville',
        latitude: 0.4037,
        longitude: 9.4531,
        type: 'university',
      },
      {
        id: '4',
        name: 'Marché du Mont-Bouët',
        address: 'Mont-Bouët, Libreville, Gabon',
        latitude: 0.3925,
        longitude: 9.4594,
        type: 'market',
      },
    ];

    // Filter based on query
    const filtered = mockPlaces.filter(place =>
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.address.toLowerCase().includes(query.toLowerCase())
    );

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return filtered;
  }

  async getRouteInfo(origin: any, destination: any): Promise<any> {
    // Calculate approximate distance (simplified)
    const distance = this.calculateDistance(
      origin.latitude,
      origin.longitude,
      destination.latitude,
      destination.longitude
    );

    // Mock route info
    return {
      distance: Math.round(distance * 100) / 100,
      duration: Math.round(distance * 3), // Assume 3 minutes per km
      polyline: [], // Would contain route coordinates
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in kilometers
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export default LocationService.getInstance();