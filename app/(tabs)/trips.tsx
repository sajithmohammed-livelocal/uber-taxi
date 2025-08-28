import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, MapPin, Star, Filter } from 'lucide-react-native';
import { TripService } from '@/services/TripService';
import { useTranslation } from 'react-i18next';

export default function TripsScreen() {
  const { t } = useTranslation();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTrips();
  }, [filter]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const tripsData = await TripService.getTrips({ status: filter });
      setTrips(tripsData);
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTripStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      case 'in_progress': return '#F59E0B';
      case 'requested': return '#6366F1';
      default: return '#6B7280';
    }
  };

  const getTripStatusText = (status) => {
    const statusMap = {
      completed: t('tripStatus.completed'),
      cancelled: t('tripStatus.cancelled'),
      in_progress: t('tripStatus.inProgress'),
      requested: t('tripStatus.requested'),
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filterOptions = [
    { key: 'all', label: t('filters.all') },
    { key: 'completed', label: t('filters.completed') },
    { key: 'cancelled', label: t('filters.cancelled') },
    { key: 'in_progress', label: t('filters.ongoing') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('trips.title')}</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#10B981" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        style={styles.filterContainer} 
        showsHorizontalScrollIndicator={false}
      >
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.filterChip,
              filter === option.key && styles.filterChipActive
            ]}
            onPress={() => setFilter(option.key)}
          >
            <Text style={[
              styles.filterText,
              filter === option.key && styles.filterTextActive
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView 
        style={styles.tripsList}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadTrips} />
        }
      >
        {trips.map((trip) => (
          <View key={trip.id} style={styles.tripCard}>
            <View style={styles.tripHeader}>
              <View style={styles.tripRoute}>
                <View style={styles.routePoint}>
                  <View style={[styles.routeDot, { backgroundColor: '#10B981' }]} />
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routePoint}>
                  <MapPin size={12} color="#EF4444" />
                </View>
              </View>
              <View style={styles.tripDetails}>
                <Text style={styles.tripFrom} numberOfLines={1}>
                  {trip.pickup.address}
                </Text>
                <Text style={styles.tripTo} numberOfLines={1}>
                  {trip.destination.address}
                </Text>
              </View>
              <View style={styles.tripMeta}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getTripStatusColor(trip.status) + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getTripStatusColor(trip.status) }
                  ]}>
                    {getTripStatusText(trip.status)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.tripFooter}>
              <View style={styles.tripInfo}>
                <Clock size={14} color="#6B7280" />
                <Text style={styles.tripDate}>
                  {formatDate(trip.createdAt)}
                </Text>
              </View>
              
              {trip.driver && (
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{trip.driver.name}</Text>
                  <View style={styles.rating}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.ratingText}>{trip.driver.rating}</Text>
                  </View>
                </View>
              )}

              <View style={styles.fareInfo}>
                <Text style={styles.fareAmount}>{trip.fare?.toLocaleString()} CFA</Text>
              </View>
            </View>
          </View>
        ))}

        {trips.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Clock size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>{t('trips.noTrips')}</Text>
            <Text style={styles.emptyDescription}>
              {t('trips.noTripsDescription')}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  filterButton: {
    padding: 8,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  filterChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  tripsList: {
    flex: 1,
    padding: 16,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tripRoute: {
    alignItems: 'center',
    marginRight: 12,
  },
  routePoint: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#D1D5DB',
    marginVertical: 2,
  },
  tripDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tripFrom: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  tripTo: {
    fontSize: 14,
    color: '#6B7280',
  },
  tripMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tripFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tripDate: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  driverInfo: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  driverName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    marginLeft: 2,
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '500',
  },
  fareInfo: {
    alignItems: 'flex-end',
  },
  fareAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});