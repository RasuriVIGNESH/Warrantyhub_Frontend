import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import deviceService from '../services/deviceService';

export function useDevices() {
  const { isAuthenticated } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all devices
  const fetchDevices = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return [];
    }
    try {
      setLoading(true);
      setError(null);
      const data = await deviceService.getAllDevices();
  
      // ✅ Safely extract array from response
      const deviceArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.devices)
          ? data.devices
          : [];
  
      setDevices(deviceArray);
      console.log("Fetched devices:", deviceArray);
      return deviceArray;
    } catch (err) {
      setError(err.message || 'Failed to fetch devices');
      setDevices([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);
  

  // Create a new device
  const createDevice = async (deviceData) => {
    try {
      setLoading(true);
      setError(null);
      const newDevice = await deviceService.createDevice(deviceData);
      setDevices(prev => [...prev, newDevice]);
      return newDevice;
    } catch (err) {
      setError(err.message || 'Failed to create device');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing device
  const updateDevice = async (deviceId, deviceData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedDevice = await deviceService.updateDevice(deviceId, deviceData);
      setDevices(prev =>
        prev.map(device =>
          device.id === deviceId ? updatedDevice : device
        )
      );
      return updatedDevice;
    } catch (err) {
      setError(err.message || 'Failed to update device');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add maintenance record
  const addMaintenanceRecord = async (deviceId, record) => {
    try {
      setLoading(true);
      setError(null);
      const updatedDevice = await deviceService.addMaintenanceRecord(deviceId, record);
      setDevices(prev =>
        prev.map(device =>
          device.id === deviceId ? updatedDevice : device
        )
      );
      return updatedDevice;
    } catch (err) {
      setError(err.message || 'Failed to add maintenance record');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a device
  const deleteDevice = async (deviceId) => {
    try {
      setLoading(true);
      setError(null);
      await deviceService.deleteDevice(deviceId);
      setDevices(prev => prev.filter(device => device.id !== deviceId));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete device');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get devices by status
  const getDevicesByStatus = useCallback((status) => {
    return devices.filter(device => device.warrantyStatus === status);
  }, [devices]);

  // Get device by ID
  const getDeviceById = useCallback((deviceId) => {
    return devices.find(device => device.id === deviceId);
  }, [devices]);

  // Load devices on mount
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    loading,
    error,
    fetchDevices,
    createDevice,
    updateDevice,
    deleteDevice,
    addMaintenanceRecord,
    getDevicesByStatus,
    getDeviceById,
  };
}

