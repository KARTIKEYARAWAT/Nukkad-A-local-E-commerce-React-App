import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Smartphone, ArrowLeft, Chrome, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleEnabled, setIsGoogleEnabled] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Fix for process.env issue
  const API_BASE_URL = (() => {
    try {
      return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    } catch (error) {
      return 'http://localhost:5000/api';
    }
  })();

  // Check if user is already logged in or handle OAuth callback
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
      return;
    }
    
    // Handle OAuth callback
    const urlToken = searchParams.get('token');
    const urlUser = searchParams.get('user');
    const urlError = searchParams.get('error');
    
    if (urlError === 'oauth_failed') {
      setError('Google login failed. Please try again.');
      return;
    }
    
    if (urlError === 'oauth_not_configured') {
      setError('Google login is not configured yet. Please use email/phone and password or OTP login.');
      return;
    }
    
    if (urlToken && urlUser) {
      try {
        const userData = JSON.parse(decodeURIComponent(urlUser));
        
        // Store the data
        localStorage.setItem('token', urlToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('OAuth login successful:', userData);
        
        // Dispatch auth change event for Navigation component
        window.dispatchEvent(new CustomEvent('authChanged', { 
          detail: { 
            type: 'login', 
            user: userData 
          } 
        }));
        
        setSuccess('Login successful! Redirecting...');
        
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Small delay to ensure state updates
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } catch (error) {
        console.error('Error parsing OAuth callback data:', error);
        setError('Login failed. Please try again.');
      }
    }
  }, [navigate, searchParams]);

  // Check Google OAuth status
  useEffect(() => {
    const checkGoogleOAuth = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/google/status`);
        setIsGoogleEnabled(response.data.configured);
      } catch (error) {
        console.error('Failed to check Google OAuth status:', error);
        setIsGoogleEnabled(false);
      }
    };
    
    checkGoogleOAuth();
  }, [API_BASE_URL]);

  // Password login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        emailOrPhone: email, // Change from 'email' to 'emailOrPhone'
        password
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Dispatch auth change event
        window.dispatchEvent(new CustomEvent('authChanged', { detail: { type: 'login' } }));
        
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        setError(error.response.data?.message || 'Login failed');
      } else if (error.request) {
        setError('Unable to connect to server. Please check if the server is running.');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP
  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        phone
      });

      if (response.data.success) {
        setOtpSent(true);
        setSuccess('OTP sent successfully! Check the server console for the OTP code.');
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('OTP error:', error);
      
      if (error.response) {
        setError(error.response.data?.message || 'Failed to send OTP');
      } else if (error.request) {
        setError('Unable to connect to server. Please check if the server is running.');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        phone,
        otp
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setError(response.data.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      
      if (error.response) {
        setError(error.response.data?.message || 'OTP verification failed');
      } else if (error.request) {
        setError('Unable to connect to server. Please check if the server is running.');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // OAuth login handler
  const handleGoogleLogin = () => {
    if (!isGoogleEnabled) {
      setError('Google login is not configured. Please use email/phone and password or OTP login.');
      return;
    }
    
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-primary rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-secondary rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-accent rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-floating border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to your account to continue shopping
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Google Login Button */}
            <div className="mb-6">
              <Button 
                variant="outline" 
                className={`w-full ${!isGoogleEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleGoogleLogin}
                disabled={isLoading || !isGoogleEnabled}
              >
                <Chrome className="h-4 w-4 mr-2" />
                {isGoogleEnabled ? 'Continue with Google' : 'Continue with Google (Not Available)'}
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <Alert className="mb-4 border-destructive">
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4 border-green-500">
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="password" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </TabsTrigger>
                <TabsTrigger value="otp" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  OTP
                </TabsTrigger>
              </TabsList>

              <TabsContent value="password" className="space-y-4">
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailOrPhone">Email / Mobile Number</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="emailOrPhone"
                        type="text"
                        placeholder="Enter your email or phone number"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-gradient-primary hover:scale-105 transition-smooth"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="otp" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your 10-digit phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="pl-10"
                      maxLength={10}
                      disabled={otpSent}
                    />
                  </div>
                </div>

                {!otpSent ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleSendOTP}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">OTP Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        maxLength={6}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Check the server console for the OTP code
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp('');
                          setSuccess('');
                        }}
                      >
                        Change Number
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 bg-gradient-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          'Verify & Sign In'
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;