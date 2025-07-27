import { useParams, useNavigate } from 'react-router-dom';
import { useDevices } from '../hooks/useDevices';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MaintenanceHistory } from '../components/maintenance/MaintenanceHistory';
import { PDFExport } from '../components/export/PDFExport';
import { MobileFeatures } from '../components/mobile/MobileFeatures';
import { WarrantyRecommendations } from '../components/recommendations/WarrantyRecommendations';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Info,
  Tag,
  Tv,
  Smartphone,
  Laptop,
  Package,
  Refrigerator,
  WashingMachine,
  AirVent,
  Droplet
} from 'lucide-react';

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

export function DeviceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { devices, loading, error, addMaintenanceRecord } = useDevices();
  const device = devices.find(d => d.id === id);

  const handleAddMaintenanceRecord = async (record) => {
    try {
      await addMaintenanceRecord(id, record);
    } catch (err) {
      console.error('Failed to add maintenance record:', err);
    }
  };

  const handleImageCapture = (file) => {
    // This would be handled by your image upload logic
    console.log('Captured image:', file);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="p-6">
        <Button
          variant="ghost"
          className="mb-6 text-gray-900 dark:text-white"
          onClick={() => navigate('/devices')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Devices
        </Button>
        <Card 
          className="text-center py-12"
          onClick={() => {}}
          clickable={false}
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {error || "Device not found"}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            We couldn't find the device you're looking for.
          </p>
        </Card>
      </div>
    );
  }

  const DeviceIcon = getDeviceIcon(device);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          className="text-gray-900 dark:text-white"
          onClick={() => navigate('/devices')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Devices
        </Button>
        <PDFExport device={device} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Device Info */}
        <Card 
          className="lg:col-span-2 bg-white dark:bg-transparent border dark:border-gray-700"
          onClick={() => {}}
          clickable={false}
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <DeviceIcon className="w-10 h-10 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {/* OLD: {device.manufacturer} - {device.model} */}
                  {/* NEW: Use the name field from API, with manufacturer/model as fallback */}
                  {device.name || `${device.manufacturer} - ${device.model}`}
                </h1>
                <div className="mt-2 flex items-center gap-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${device.warrantyStatus === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                      device.warrantyStatus === 'expiring-soon' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                    {device.warrantyStatus.replace('-', ' ').charAt(0).toUpperCase() + device.warrantyStatus.slice(1).replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Serial Number</p>
                    <p className="text-gray-900 dark:text-white">{device.serialNumber || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Purchase Date</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(device.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Warranty End Date</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(device.warrantyEndDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Warranty Provider</p>
                    <p className="text-gray-900 dark:text-white">{device.warrantyProvider || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 text-gray-400 flex items-center justify-center text-xl font-bold">₹</span>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Purchase Price</p>
                    <p className="text-gray-900 dark:text-white">
                      {device.purchasePrice ? ` ₹${Number(device.purchasePrice).toLocaleString('en-IN')}` : 'Not provided'}
                    </p>
                  </div>
                </div>

                {device.warrantyDocument && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Warranty Document</p>
                      <a 
                        href={device.warrantyDocument} 
                        className="text-primary hover:text-primary/80"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {device.notes && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Notes</h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {device.notes}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Warranty Recommendations */}
        <div className="space-y-6">
          <WarrantyRecommendations device={device} />
          
          {/* Warranty Timeline */}
          <Card 
            className="bg-white dark:bg-transparent border dark:border-gray-700"
            onClick={() => {}}
            clickable={false}
          >
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Warranty Timeline
              </h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                <div className="space-y-6">
                  <div className="relative flex items-center gap-4">
                    <div className="absolute left-4 w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="ml-8">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Purchase Date
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(device.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="relative flex items-center gap-4">
                    <div className="absolute left-4 w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="ml-8">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Warranty Expires
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(device.warrantyEndDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Maintenance History */}
      <div className="mt-8">
        <MaintenanceHistory 
          device={device}
          onAddRecord={handleAddMaintenanceRecord}
        />
      </div>

      {/* Mobile Features */}
      <MobileFeatures
        device={device}
        onImageCapture={handleImageCapture}
      />
    </div>
  );
} 