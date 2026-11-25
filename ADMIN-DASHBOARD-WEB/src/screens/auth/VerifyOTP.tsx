import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

export const VerifyOTP = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 5) {
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
    if (otp.some(digit => digit === '')) return;
    setIsLoading(true);
    setTimeout(() => {
      navigate('/reset-password');
    }, 1500);
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Verify your email</h3>
          <ShieldCheck className="text-success h-5 w-5" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We've sent a 6-digit code to admin@templeos.com</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-white/40 dark:border-gray-700/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.some(d => d === '')}
          className="w-full h-12 flex justify-center items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <>
              Verify Code <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
        
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Didn't receive the code? <button type="button" className="font-semibold text-primary hover:text-primary/80 cursor-pointer">Resend</button>
        </p>
      </form>
    </div>
  );
};
