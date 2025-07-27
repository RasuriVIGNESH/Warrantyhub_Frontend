import PropTypes from 'prop-types';
import { Calendar, Clock, Trash2, Edit2, FileText } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { formatDeviceType } from '../../utils/warrantyUtils';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

const statusColors = {
  'active': 'success',
  'expiring-soon': 'warning',
  'expired': 'error',
  'unknown': 'default',
};

export function DeviceCard({ device, onEdit, onDelete }) {
  console.log("DeviceCard props:", device);
  console.log("Device name specifically:", device.name); 
  console.log("Device name type:", typeof device.name); 
  const {
    name,
    type,
    brand,
    purchaseDate,
    warrantyEndDate,
    warrantyStatus,
    documents,
  } = device;

  return (
    <Card
      variant="elevated"
      className="hover:shadow-lg transition-shadow duration-200"
    >
      <Card.Header>
        <div className="flex justify-between items-start">
          <div>
            <Card.Title>{!name || name.trim() === '' || name.trim() === '-' ? 'Unnamed Device' : name}</Card.Title>
            <Card.Description>{formatDeviceType(type)} • {brand}</Card.Description>
          </div>
          <Badge color={statusColors[warrantyStatus]}>
            {warrantyStatus === 'expiring-soon' ? 'Expiring Soon' : 
             warrantyStatus === 'active' ? 'Active' :
             warrantyStatus === 'expired' ? 'Expired' : 'Unknown'}
          </Badge>
        </div>
      </Card.Header>

      <Card.Content>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Purchased: {formatDate(purchaseDate)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Clock className="h-4 w-4 mr-2" />
            <span>Warranty Ends: {formatDate(warrantyEndDate)}</span>
          </div>
          {documents?.length > 0 && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <FileText className="h-4 w-4 mr-2" />
              <span>{documents.length} Document{documents.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </Card.Content>

      <Card.Footer>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(device)}
            className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            <span className="sr-only">Edit device</span>
          </button>
          <button
            onClick={() => onDelete(device)}
            className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete device</span>
          </button>
        </div>
      </Card.Footer>
    </Card>
  );
}

DeviceCard.propTypes = {
  device: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    purchaseDate: PropTypes.string.isRequired,
    warrantyEndDate: PropTypes.string,
    warrantyStatus: PropTypes.oneOf(['active', 'expiring-soon', 'expired', 'unknown']).isRequired,
    documents: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}; 