import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Zap, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      title: 'Smart SIP Plans',
      description: 'AI-driven investment strategies tailored to your income and goals.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: 'Tax Optimization',
      description: 'Expert advice on Old vs New regimes and 80C deductions.',
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-600" />,
      title: 'Instant Insights',
      description: 'Get real-time answers to your complex financial questions.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Money<span className="text-emerald-600">Mentor</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/signup')}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Trusted by 10,000+ Indians
            </div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              Your Personal <br />
              <span className="text-emerald-600">AI Financial</span> <br />
              Mentor.
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-xl leading-relaxed">
              Stop guessing, start growing. Money Mentor uses advanced AI to create personalized investment plans, optimize your taxes, and build a secure financial future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="text-lg h-14 px-8"
                onClick={() => navigate('/signup')}
              >
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="text-lg h-14 px-8"
                onClick={() => navigate('/demo')}
              >
                Try Demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-emerald-600/10 rounded-full absolute -top-10 -right-10 w-96 h-96 blur-3xl" />
            <div className="aspect-square bg-blue-600/10 rounded-full absolute -bottom-10 -left-10 w-96 h-96 blur-3xl" />
            
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <Card className="col-span-2 p-8 transform hover:-translate-y-2 transition-transform">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
                      Estimated Savings
                    </h4>
                    <p className="text-3xl font-bold">₹1,42,500/yr</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-2xl">
                    <TrendingUp className="text-emerald-600 w-6 h-6" />
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1, delay: 1 }}
                    className="h-full bg-emerald-600"
                  />
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  Optimized for Section 80C & 80D
                </p>
              </Card>

              <Card className="p-6 bg-slate-900 text-white transform hover:-translate-y-2 transition-transform delay-75">
                <Zap className="w-8 h-8 text-emerald-400 mb-4" />
                <h4 className="font-bold mb-1">Instant SIP</h4>
                <p className="text-sm text-slate-400">Personalized fund picks based on risk.</p>
              </Card>

              <Card className="p-6 transform hover:-translate-y-2 transition-transform delay-150">
                <UserCheck className="w-8 h-8 text-emerald-600 mb-4" />
                <h4 className="font-bold text-slate-900 mb-1">Expert AI</h4>
                <p className="text-sm text-slate-500">24/7 dedicated financial support.</p>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Everything you need to grow your wealth
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We've simplified financial planning into a few easy steps. Powered by AI, designed for humans.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:border-emerald-200 transition-colors">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-4 border-slate-50 bg-slate-200 overflow-hidden"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                    alt="User"
                  />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-slate-50 bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                +10k
              </div>
            </div>
            <p className="text-slate-600 font-medium">
              Join 10,000+ users who trust Money Mentor for their financial future
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-emerald-600 w-5 h-5" />
            <span className="text-xl font-bold text-slate-900">
              Money<span className="text-emerald-600">Mentor</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 AI Money Mentor. All rights reserved. Professional advisory for the Indian market.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
