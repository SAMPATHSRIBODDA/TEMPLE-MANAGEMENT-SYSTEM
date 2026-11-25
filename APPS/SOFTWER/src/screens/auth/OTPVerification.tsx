import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length === 6) {
      // Mock success, redirect to login
      navigate('/login');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
      <Link to="/login" className="absolute top-8 left-8 sm:static sm:inline-flex flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Link>
      
      <div className="flex justify-center mb-6">
        <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
          <ShieldCheck className="h-8 w-8 text-orange-600" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
      <p className="text-gray-500 mb-8">We've sent a 6-digit code to <br/><span className="font-medium text-gray-800">{email}</span></p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-center gap-2 sm:gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-0 outline-none transition-all bg-gray-50 focus:bg-white"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={otp.join('').length !== 6}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify Code
        </button>
      </form>
      
      <p className="mt-8 text-sm text-gray-500">
        Didn't receive the code? <button className="text-orange-600 hover:text-orange-700 font-medium">Resend Code</button>
      </p>
    </div>
  );
}
