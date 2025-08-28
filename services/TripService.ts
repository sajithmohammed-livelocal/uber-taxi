import { LocationService } from './LocationService';

export interface Trip {
  id: string;
  pickup: any;
  destination: any;
  type: 'now' | 'schedule' | 'city' | 'hourly';
  status: 'requested' | 'matched' | 'in_progress' | 'completed' | 'cancelled';
  fare?: number;
  driver?: any;
  createdAt: string;
  updatedAt: string;
}

export class TripService {
  private static instance: TripService;
  private trips: Trip[] = [];

  static getInstance(): TripService {
    if (!TripService.instance) {
      TripService.instance = new TripService();
      TripService.instance.initMockData();
    }
    return TripService.instance;
  }

  private initMockData(): void {
    // Generate some mock trip history
    this.trips = [
      {
        id: '1',
        pickup: { address: 'Centre-ville, Libreville', latitude: 0.4162, longitude: 9.4673 },
        destination: { address: 'Aéroport International', latitude: 0.4586, longitude: 9.4128 },
        type: 'now',
        status: 'completed',
        fare: 8500,
        driver: { name: 'Pierre Ndong', rating: 4.9, phone: '+241 06 11 22 33' },
        createdAt: '2025-01-15T08:30:00Z',
        updatedAt: '2025-01-15T09:15:00Z',
      },
      {
        id: '2',
        pickup: { address: 'Université Omar Bongo', latitude: 0.4037, longitude: 9.4531 },
        destination: { address: 'Marché du Mont-Bouët', latitude: 0.3925, longitude: 9.4594 },
        type: 'now',
        status: 'completed',
        fare: 3200,
        driver: { name: 'Marie Ondo', rating: 4.7, phone: '+241 06 44 55 66' },
        createdAt: '2025-01-12T14:20:00Z',
        updatedAt: '2025-01-12T14:45:00Z',
      },
      {
        id: '3',
        pickup: { address: 'Centre-ville, Libreville', latitude: 0.4162, longitude: 9.4673 },
        destination: { address: 'Port-Gentil', latitude: -0.7193, longitude: 8.7815 },
        type: 'city',
        status: 'cancelled',
        fare: 45000,
        createdAt: '2025-01-10T10:00:00Z',
        updatedAt: '2025-01-10T10:05:00Z',
      },
    ];
  }

  async createTripRequest(tripData: Partial<Trip>): Promise<Trip> {
    const newTrip: Trip = {
      id: Date.now().toString(),
      pickup: tripData.pickup!,
      destination: tripData.destination!,
      type: tripData.type || 'now',
      status: 'requested',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Simulate fare calculation
    const routeInfo = await LocationService.getRouteInfo(newTrip.pickup, newTrip.destination);
    newTrip.fare = await this.calculateFare(routeInfo, newTrip.type);

    // Simulate finding driver
    setTimeout(() => {
      this.matchDriver(newTrip.id);
    }, 3000);

    this.trips.unshift(newTrip);
    return newTrip;
  }

  async getFareEstimate(pickup: any, destination: any, type: string): Promise<any> {
    const routeInfo = await LocationService.getRouteInfo(pickup, destination);
    const baseFare = await this.calculateFare(routeInfo, type);

    return {
      total: baseFare,
      baseFare: 1500,
      distance: routeInfo.distance,
      duration: routeInfo.duration,
      surgeMultiplier: 1.0,
      breakdown: {
        base: 1500,
        perKm: Math.round((baseFare - 1500) / routeInfo.distance),
        surge: 0,
      },
    };
  }

  async getTrips(filters?: { status?: string }): Promise<Trip[]> {
    let filteredTrips = [...this.trips];

    if (filters?.status && filters.status !== 'all') {
      filteredTrips = filteredTrips.filter(trip => trip.status === filters.status);
    }

    // Sort by creation date (newest first)
    filteredTrips.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return filteredTrips;
  }

  private async calculateFare(routeInfo: any, tripType: string): Promise<number> {
    const config = {
      baseFare: 1500, // CFA
      perKmRate: 350, // CFA per km
      perMinRate: 50, // CFA per minute
      minFare: 2000, // Minimum fare
      cityToCityMultiplier: 1.5,
      hourlyRate: 5000, // CFA per hour
    };

    let fare = config.baseFare;
    fare += routeInfo.distance * config.perKmRate;
    fare += routeInfo.duration * config.perMinRate;

    if (tripType === 'city') {
      fare *= config.cityToCityMultiplier;
    } else if (tripType === 'hourly') {
      fare = config.hourlyRate;
    }

    return Math.max(fare, config.minFare);
  }

  private matchDriver(tripId: string): void {
    const tripIndex = this.trips.findIndex(t => t.id === tripId);
    if (tripIndex >= 0) {
      const mockDrivers = [
        { name: 'Jean Essono', rating: 4.8, phone: '+241 06 77 88 99' },
        { name: 'Sylvie Mbadinga', rating: 4.9, phone: '+241 06 12 34 56' },
        { name: 'Paul Nze', rating: 4.6, phone: '+241 06 98 76 54' },
      ];

      this.trips[tripIndex] = {
        ...this.trips[tripIndex],
        status: 'matched',
        driver: mockDrivers[Math.floor(Math.random() * mockDrivers.length)],
        updatedAt: new Date().toISOString(),
      };
    }
  }
}

export default TripService.getInstance();