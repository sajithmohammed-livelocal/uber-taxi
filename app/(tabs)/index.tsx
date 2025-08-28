import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Search, Clock, Car, Shield, Star } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LocationService } from '@/services/LocationService';
import { TripService } from '@/services/TripService';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [showDestinationInput, setShowDestinationInput] = useState(false);
  const [tripType, setTripType] = useState('now');
  const [fareEstimate, setFareEstimate] = useState(null);

  useEffect(() => {
    LocationService.getCurrentLocation().then(setCurrentLocation);
  }, []);

  const tripTypes = [
    { id: 'now', label: t('tripTypes.now'), icon: Car },
    { id: 'schedule', label: t('tripTypes.schedule'), icon: Clock },
    { id: 'city', label: t('tripTypes.cityToCity'), icon: MapPin },
    { id: 'hourly', label: t('tripTypes.hourly'), icon: Star },
  ];

  const handleDestinationSelect = async (place) => {
    setDestination(place);
    if (currentLocation) {
      const estimate = await TripService.getFareEstimate(
        currentLocation,
        place,
        tripType
      );
      setFareEstimate(estimate);
    }
  };

  const handleRequestRide = async () => {
    if (!destination) {
      Alert.alert(t('alerts.error'), t('alerts.selectDestination'));
      return;
    }

    try {
      const trip = await TripService.createTripRequest({
        pickup: currentLocation,
        destination: destination,
        type: tripType,
      });
      
      // Navigate to trip tracking screen
      Alert.alert(t('alerts.success'), t('alerts.tripRequested'));
    } catch (error) {
      Alert.alert(t('alerts.error'), t('alerts.requestFailed'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.sosButton}>
          <Shield size={20} color="#EF4444" />
          <Text style={styles.sosText}>{t('buttons.sos')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        {currentLocation && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            showsMyLocationButton={false}
          >
            <Marker
              coordinate={currentLocation}
              title={t('labels.yourLocation')}
            />
          </MapView>
        )}
        
        <View style={styles.mapOverlay}>
          <TouchableOpacity 
            style={styles.whereToButton}
            onPress={() => setShowDestinationInput(true)}
          >
            <Search size={20} color="#6B7280" />
            <Text style={styles.whereToText}>
              {destination || t('placeholders.whereTo')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showDestinationInput && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('placeholders.searchDestination')}
            value={destination}
            onChangeText={setDestination}
            autoFocus={true}
          />
          <ScrollView style={styles.suggestions}>
            {/* Mock suggestions */}
            {['Centre-ville Libreville', 'Aéroport International', 'Port-Gentil', 'Université Omar Bongo'].map((place, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleDestinationSelect(place)}
              >
                <MapPin size={16} color="#10B981" />
                <Text style={styles.suggestionText}>{place}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.bottomSheet}>
        <ScrollView horizontal style={styles.tripTypeContainer} showsHorizontalScrollIndicator={false}>
          {tripTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.tripTypeButton,
                tripType === type.id && styles.tripTypeButtonActive
              ]}
              onPress={() => setTripType(type.id)}
            >
              <type.icon size={20} color={tripType === type.id ? '#FFFFFF' : '#10B981'} />
              <Text style={[
                styles.tripTypeText,
                tripType === type.id && styles.tripTypeTextActive
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {fareEstimate && (
          <View style={styles.fareEstimate}>
            <Text style={styles.fareLabel}>{t('labels.estimatedFare')}</Text>
            <Text style={styles.fareAmount}>{fareEstimate.total} CFA</Text>
            <Text style={styles.fareBreakdown}>
              {t('labels.basefare')}: {fareEstimate.baseFare} CFA • 
              {t('labels.distance')}: {fareEstimate.distance}km
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.requestButton, !destination && styles.requestButtonDisabled]}
          onPress={handleRequestRide}
          disabled={!destination}
        >
          <Text style={styles.requestButtonText}>
            {t('buttons.requestRide')}
          </Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  sosText: {
    marginLeft: 4,
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 12,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
  },
  whereToButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  whereToText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#6B7280',
    flex: 1,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    maxHeight: 300,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  suggestions: {
    marginTop: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#374151',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tripTypeContainer: {
    marginBottom: 20,
  },
  tripTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10B981',
    backgroundColor: '#FFFFFF',
  },
  tripTypeButtonActive: {
    backgroundColor: '#10B981',
  },
  tripTypeText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
  },
  tripTypeTextActive: {
    color: '#FFFFFF',
  },
  fareEstimate: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  fareLabel: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  fareAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#065F46',
    marginTop: 4,
  },
  fareBreakdown: {
    fontSize: 12,
    color: '#059669',
    marginTop: 4,
  },
  requestButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});