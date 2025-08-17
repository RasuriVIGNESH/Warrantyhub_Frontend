import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

export function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithToken, isAuthenticated, isLoading } = useAuth();
  const [processingAuth, setProcessingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const handleOAuth2Redirect = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        const errorMessage = searchParams.get('message');

        // Handle OAuth2 errors
        if (error) {
          const displayMessage = errorMessage || 'Authentication failed. Please try again.';
          console.error('OAuth2 Error:', error, errorMessage);
          setAuthError(displayMessage);
          toast.error(displayMessage);
          
          // Wait a moment before redirecting to show the error
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
          return;
        }

        // Handle missing token
        if (!token) {
          const message = 'No authentication token received.';
          console.error('OAuth2 Error: Missing token');
          setAuthError(message);
          toast.error(message);
          
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
          return;
        }

        console.log('OAuth2 token received, processing authentication...');
        
        try {
          // Process the token
          await loginWithToken(token);
          
          // Wait for authentication state to update
          // We'll use a more reliable method than arbitrary delays
          let attempts = 0;
          const maxAttempts = 50; // 5 seconds max wait
          
          const checkAuthState = () => {
            return new Promise((resolve) => {
              const checkInterval = setInterval(() => {
                attempts++;
                
                // Check if authentication is complete and successful
                if (isAuthenticated && !isLoading) {
                  clearInterval(checkInterval);
                  resolve(true);
                  return;
                }
                
                // Check if we've exceeded max attempts
                if (attempts >= maxAttempts) {
                  clearInterval(checkInterval);
                  resolve(false);
                  return;
                }
              }, 100);
            });
          };
          
          const authSuccess = await checkAuthState();
          
          if (authSuccess) {
            console.log('Authentication successful, redirecting to dashboard...');
            
            // Get the stored redirect path or default to dashboard
            const redirectPath = sessionStorage.getItem('oauth2_redirect_path') || '/dashboard';
            sessionStorage.removeItem('oauth2_redirect_path');
            
            toast.success('Successfully signed in!');
            navigate(redirectPath, { replace: true });
          } else {
            throw new Error('Authentication state did not update within expected time');
          }
          
        } catch (authError) {
          console.error('OAuth2 token processing error:', authError);
          
          // More specific error handling
          let errorMessage = 'Authentication failed. Please try again.';
          if (authError.message?.includes('401')) {
            errorMessage = 'Invalid authentication token. Please try signing in again.';
          } else if (authError.message?.includes('network')) {
            errorMessage = 'Network error. Please check your connection and try again.';
          }
          
          setAuthError(errorMessage);
          toast.error(errorMessage);
          
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
        }
        
      } catch (error) {
        console.error('Unexpected error in OAuth2 redirect handler:', error);
        const message = 'An unexpected error occurred during authentication.';
        setAuthError(message);
        toast.error(message);
        
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } finally {
        setProcessingAuth(false);
      }
    };

    handleOAuth2Redirect();
  }, [searchParams, navigate, loginWithToken, isAuthenticated, isLoading]);

  // Show error state if there's an error
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Authentication Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {authError}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  // Show loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {processingAuth ? 'Completing sign in...' : 'Redirecting...'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {processingAuth 
            ? 'Please wait while we complete your authentication.' 
            : 'Taking you to your dashboard...'
          }
        </p>
      </div>
    </div>
  );
}

