import PropTypes from 'prop-types';
import { clsx } from 'clsx';

const sizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const colors = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  white: 'text-white',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
};

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className,
  label = 'Loading...',
}) {
  return (
    <div
      role="status"
      className={clsx('inline-flex items-center', className)}
    >
      <svg
        className={clsx(
          'animate-spin',
          sizes[size],
          colors[color]
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && (
        <span className="sr-only">
          {label}
        </span>
      )}
    </div>
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(Object.keys(sizes)),
  color: PropTypes.oneOf(Object.keys(colors)),
  className: PropTypes.string,
  label: PropTypes.string,
}; 