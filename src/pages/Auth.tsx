import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Phone, IdCard, Wallet, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

interface AuthProps {
  mode: 'login' | 'signup' | 'demo';
}

const Auth = ({ mode }: AuthProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    aadhar: '',
    income: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'demo') {
      // Pre-fill demo data
      setFormData({
        fullName: 'Aditya Kumar',
        phone: '9876543210',
        aadhar: '123456789012',
        income: '12,00,000',
      });
    } else {
      setFormData({
        fullName: '',
        phone: '',
        aadhar: '',
        income: '',
      });
      setErrors({});
    }
  }, [mode]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName && mode !== 'login') newErrors.fullName = 'Name is required';
    
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }
    
    if (mode === 'signup' && !/^\d{12}$/.test(formData.aadhar)) {
      newErrors.aadhar = 'Enter a valid 12-digit Aadhar number';
    }
    
    if (mode === 'signup' && !formData.income) {
      newErrors.income = 'Annual income is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() || mode === 'demo') {
      // Save user to local storage for demo purposes
      localStorage.setItem('user', JSON.stringify(formData));
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <Card className="p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {mode === 'signup' ? 'Create your account' : mode === 'demo' ? 'Explore Demo' : 'Welcome back'}
            </h1>
            <p className="text-slate-500">
              {mode === 'signup' 
                ? 'Join 10k+ users securing their financial future'
                : mode === 'demo'
                ? 'Experience the power of AI Money Mentor'
                : 'Enter your credentials to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {(mode === 'signup' || mode === 'demo') && (
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                icon={<User className="w-5 h-5" />}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                error={errors.fullName}
              />
            )}

            <Input
              label="Phone Number"
              placeholder="+91 XXXXX XXXXX"
              icon={<Phone className="w-5 h-5" />}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
            />

            {(mode === 'signup' || mode === 'demo') && (
              <>
                <Input
                  label="Aadhar Number"
                  placeholder="12-digit number"
                  icon={<IdCard className="w-5 h-5" />}
                  value={formData.aadhar}
                  onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                  error={errors.aadhar}
                />
                <Input
                  label="Approx. Annual Income"
                  placeholder="₹ 0.00"
                  icon={<Wallet className="w-5 h-5" />}
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  error={errors.income}
                />
              </>
            )}

            <Button className="w-full h-14 text-lg mt-4 font-bold">
              {mode === 'signup' ? 'Sign Up' : mode === 'demo' ? 'Start Demo Now' : 'Login'}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            {mode === 'signup' ? (
              <p className="text-slate-500">
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="text-emerald-600 font-bold hover:underline">
                  Login here
                </button>
              </p>
            ) : mode === 'login' ? (
              <p className="text-slate-500">
                New to Money Mentor?{' '}
                <button onClick={() => navigate('/signup')} className="text-emerald-600 font-bold hover:underline">
                  Sign up for free
                </button>
              </p>
            ) : null}
          </div>
        </Card>

        {mode === 'demo' && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3 items-start">
            <div className="p-1 bg-emerald-600 rounded-lg shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm text-emerald-800 leading-relaxed">
              <strong>Demo Mode:</strong> We've pre-filled the profile for Aditya Kumar (Income: ₹12 LPA) to show you how AI Money Mentor personalizes your wealth journey.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
