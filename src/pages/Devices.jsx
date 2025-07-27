import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Loader2, 
  MoreVertical,
  Tv,
  Smartphone,
  Laptop,
  Package,
  Refrigerator,
  WashingMachine,
  AirVent,
  Droplet
} from 'lucide-react';
import { useDevices } from '../hooks/useDevices';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Menu } from '../components/ui/Menu';

const getDeviceIcon = (device) => {
  const searchText = ((device.name || '') + ' ' + (device.model || '') + ' ' + (device.manufacturer || '')).toLowerCase();
  
  if (searchText.includes('macbook') || searchText.includes('laptop') || searchText.includes('notebook')) {
    return Laptop;
  }
  if (searchText.includes('iphone') || searchText.includes('phone') || searchText.includes('smartphone') || searchText.includes('mobile')) {
    return Smartphone;
  }
  if (searchText.includes('tv') || searchText.includes('television')) {
    return Tv;
  }
  if (searchText.includes('refrigerator') || searchText.includes('fridge')) {
    return Refrigerator;
  }
  if (searchText.includes('washing') || searchText.includes('washer')) {
    return WashingMachine;
  }
  if (searchText.includes('air') || searchText.includes('ac')) {
    return AirVent;
  }
  if (searchText.includes('water') || searchText.includes('purifier')) {
    return Droplet;
  }
  return Package;
};

const DEVICE_STATUS_OPTIONS = [
  { value: 'all', label: 'Filter by status' },
  { value: 'active', label: 'Active' },
  { value: 'expiring-soon', label: 'Soon' },
  { value: 'expired', label: 'Expired' },
];

export function Devices() {
  const navigate = useNavigate();
  const { devices, loading, error, deleteDevice } = useDevices();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Filter and search devices
  const filteredDevices = devices.filter(device => {
    const matchesSearch = (device.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (device.manufacturer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (device.model || '').toLowerCase().includes(searchQuery.toLowerCase());
  
    const matchesStatus = statusFilter === 'all' || device.warrantyStatus === statusFilter;
  
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (deviceId) => {
    try {
      await deleteDevice(deviceId);
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('Failed to delete device:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Error loading devices
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Devices
        </h1>
        <Button onClick={() => navigate('/devices/new')} className="bg-blue-500 hover:bg-blue-600">
          <Plus className="w-5 h-5 mr-2" />
          Add Device
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <Input
              type="text"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search devices..."
              className="pl-12 w-full bg-gray-100 dark:bg-gray-800 border-0 h-12 text-base"
            />
          </div>
        </div>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={DEVICE_STATUS_OPTIONS}
          className="w-44 bg-gray-100 dark:bg-gray-800 border-0 h-12 text-base px-4"
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 bg-white dark:bg-gray-800">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Delete Device
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete "{deleteConfirmation.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirmation(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(deleteConfirmation.id)}
                  className="text-red-600 dark:text-red-400 font-bold"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Devices List */}
      <div className="space-y-4">
        {filteredDevices.length === 0 ? (
          <Card className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                No devices found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery || statusFilter !== 'all'
                  ? "Try adjusting your filters"
                  : "Get started by adding your first device"}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button
                  className="mt-4 bg-blue-500 hover:bg-blue-600"
                  onClick={() => navigate('/devices/new')}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Device
                </Button>
              )}
            </div>
          </Card>
        ) : (
          filteredDevices.map(device => {
            const DeviceIcon = getDeviceIcon(device);
            return (
              <Card
                key={device.id}
                className="bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border dark:border-gray-700"
              >
                <div className="flex items-center justify-between p-4">
                <div className="flex items-start gap-4 flex-1 cursor-pointer" onClick={() => navigate(`/devices/${device.id}`)}>
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <DeviceIcon className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {/* OLD: {device.manufacturer} - {device.model} */}
                      {/* NEW: Use the name field from API, with manufacturer as fallback */}
                      {device.name || `${device.manufacturer} - ${device.model}`}
                    </h3>
                    <div className="mt-1 flex items-center gap-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${device.warrantyStatus === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                          device.warrantyStatus === 'expiring-soon' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        }`}>
                        {device.warrantyStatus.replace('-', ' ').charAt(0).toUpperCase() + device.warrantyStatus.slice(1).replace('-', ' ')}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Expires: {new Date(device.warrantyEndDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                  <div className="relative">
                    <Menu
                      trigger={
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                      }
                      items={[
                        {
                          label: 'Extend Warranty',
                          onClick: () => {
                            // To be implemented later
                            console.log('Extend warranty for device:', device.id);
                          },
                        },
                        {
                          label: 'Delete',
                          onClick: () => setDeleteConfirmation(device),
                          className: 'text-red-600 dark:text-red-400',
                        },
                      ]}
                    />
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
} 