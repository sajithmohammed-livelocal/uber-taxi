import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface UseSocketOptions {
  namespace?: string;
  autoConnect?: boolean;
}

export const useSocket = (url: string, options: UseSocketOptions = {}) => {
  const { namespace = '', autoConnect = true } = options;
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastPing, setLastPing] = useState<number | null>(null);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [url, namespace, autoConnect]);

  const connect = () => {
    if (socketRef.current?.connected) {
      return socketRef.current;
    }

    const socketUrl = namespace ? `${url}/${namespace}` : url;
    
    // Mock socket for development - replace with real socket.io connection
    socketRef.current = {
      connected: true,
      on: (event: string, callback: Function) => {
        // Mock event handling for development
        if (event === 'connect') {
          setTimeout(() => callback(), 100);
        }
      },
      off: (event: string, callback?: Function) => {
        // Mock event removal
      },
      emit: (event: string, data?: any) => {
        console.log('Socket emit:', event, data);
        // Mock emit - would normally send to server
      },
      disconnect: () => {
        socketRef.current = null;
        setIsConnected(false);
      },
    } as any;

    // Simulate connection
    setTimeout(() => {
      setIsConnected(true);
      setLastPing(Date.now());
    }, 100);

    return socketRef.current;
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  };

  const emit = (event: string, data?: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event: string, callback: Function) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event: string, callback?: Function) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    lastPing,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
};

// Hook for trip-specific socket events
export const useTripSocket = (tripId?: string) => {
  const { socket, isConnected, emit, on, off } = useSocket(
    'ws://localhost:3001', // Mock socket URL
    { namespace: 'trips' }
  );

  const joinTripRoom = (tripId: string) => {
    emit('join-trip', { tripId });
  };

  const leaveTripRoom = (tripId: string) => {
    emit('leave-trip', { tripId });
  };

  const updateDriverLocation = (location: any) => {
    emit('driver-location', { tripId, location });
  };

  const updateTripStatus = (status: string) => {
    emit('trip-status', { tripId, status });
  };

  useEffect(() => {
    if (tripId && isConnected) {
      joinTripRoom(tripId);
      
      return () => {
        leaveTripRoom(tripId);
      };
    }
  }, [tripId, isConnected]);

  return {
    socket,
    isConnected,
    joinTripRoom,
    leaveTripRoom,
    updateDriverLocation,
    updateTripStatus,
    on,
    off,
  };
};