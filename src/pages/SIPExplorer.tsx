import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Calculator, 
  Shield, 
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../components/ui/Button';


interface SIP {
  id: number;
  name: string;
  category: 'Government' | 'Private';
  risk: 'Low' | 'Medium' | 'High' | 'Very High';
  minInvestment: number;
  lockIn: string;
  expectedReturn: string;
  description: string;
  taxBenefits: string;
}

const SIPExplorer = () => {
  const navigate = useNavigate();
  const [sips, setSips] = useState<SIP[]>([]);
  const [filteredSips, setFilteredSips] = useState<SIP[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');
  const [selectedForComparison, setSelectedForComparison] = useState<SIP[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInput, setCalcInput] = useState({ monthly: 5000, years: 10, rate: 12 });
  const [aiInsight, setAiInsight] = useState<{id: number, text: string} | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    fetch('/api/sips')
      .then(res => res.json())
      .then(data => {
        setSips(data);
        setFilteredSips(data);
      });
  }, []);

  useEffect(() => {
    let result = sips.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    if (filterType !== 'All') result = result.filter(s => s.category === filterType);
    if (filterRisk !== 'All') result = result.filter(s => s.risk === filterRisk);
    setFilteredSips(result);
  }, [search, filterType, filterRisk, sips]);

  const calculateWealth = () => {
    const P = calcInput.monthly;
    const n = calcInput.years * 12;
    const i = (calcInput.rate / 100) / 12;
    const totalAmount = P * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const investedAmount = P * n;
    const wealthGained = totalAmount - investedAmount;
    return { 
      invested: Math.round(investedAmount).toLocaleString('en-IN'), 
      gained: Math.round(wealthGained).toLocaleString('en-IN'), 
      total: Math.round(totalAmount).toLocaleString('en-IN') 
    };
  };

  const handleAiInsight = async (sip: SIP) => {
    if (aiInsight?.id === sip.id) {
      setAiInsight(null);
      return;
    }
    
    setLoadingInsight(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `Explain why ${sip.name} is a good or bad fit for someone with an income of ₹${user.income}. Keep it short and specific to this fund.`, 
          userProfile: user 
        }),
      });
      const data = await response.json();
      setAiInsight({ id: sip.id, text: data.text });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInsight(false);
    }
  };

  const wealth = calculateWealth();

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/chat')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Sparkles className="text-emerald-600 w-6 h-6" />
              SIP Explorer
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex" onClick={() => setShowCalculator(!showCalculator)}>
              <Calculator className="w-4 h-4 mr-2" />
              Wealth Calculator
            </Button>
            {selectedForComparison.length > 0 && (
              <Button onClick={() => setShowCalculator(false)}>
                Compare ({selectedForComparison.length})
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Filters */}
          <div className="flex flex-col md:row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search funds or categories..."
                className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
              </select>
              <select 
                className="h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none"
                value={filterRisk}
                onChange={e => setFilterRisk(e.target.value)}
              >
                <option value="All">All Risks</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredSips.map(sip => (
                <motion.div
                  key={sip.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card className={cn(
                    "relative overflow-hidden group cursor-pointer border-2 transition-all h-full",
                    selectedForComparison.find(s => s.id === sip.id) ? "border-emerald-500 bg-emerald-50/10" : "border-transparent"
                  )}>
                     <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className={cn(
                            "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-2 inline-block",
                            sip.category === 'Government' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                          )}>
                            {sip.category}
                          </span>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {sip.name}
                          </h3>
                        </div>
                        <div className="text-right">
                           <div className="text-2xl font-black text-emerald-600 leading-none">{sip.expectedReturn}</div>
                           <div className="text-[10px] text-slate-500 font-bold uppercase">Exp. Return</div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                           <Shield className="w-4 h-4 text-slate-400" />
                           <div className="text-sm">
                              <p className="text-[10px] text-slate-500 uppercase font-medium">Risk Profile</p>
                              <p className="font-bold text-slate-700">{sip.risk}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <Layers className="w-4 h-4 text-slate-400" />
                           <div className="text-sm">
                              <p className="text-[10px] text-slate-500 uppercase font-medium">Min Investment</p>
                              <p className="font-bold text-slate-700">₹{sip.minInvestment}</p>
                           </div>
                        </div>
                     </div>

                     <div className="p-4 bg-slate-50 rounded-2xl mb-6">
                        <p className="text-sm text-slate-600 italic">"{sip.description}"</p>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <button 
                           onClick={() => handleAiInsight(sip)}
                           className="flex items-center gap-2 text-emerald-600 font-bold text-sm hover:underline"
                        >
                           <Sparkles className="w-4 h-4" />
                           AI Insights
                        </button>
                        <Button 
                          variant={selectedForComparison.find(s => s.id === sip.id) ? 'secondary' : 'outline'}
                          className="h-9 px-4 text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedForComparison.find(s => s.id === sip.id)) {
                              setSelectedForComparison(prev => prev.filter(s => s.id !== sip.id));
                            } else if (selectedForComparison.length < 3) {
                              setSelectedForComparison(prev => [...prev, sip]);
                            }
                          }}
                        >
                          {selectedForComparison.find(s => s.id === sip.id) ? 'Selected' : 'Compare'}
                        </Button>
                     </div>

                     {/* AI Insight Overlay */}
                     <AnimatePresence>
                        {(aiInsight?.id === sip.id || (loadingInsight && aiInsight === null)) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 p-4 bg-emerald-600 text-white rounded-2xl relative"
                          >
                             <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-emerald-300" />
                                <span className="text-xs font-bold uppercase tracking-widest">Personalized Logic</span>
                             </div>
                             {loadingInsight ? (
                               <div className="flex items-center gap-2 py-2">
                                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
                                  <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-100" />
                                  <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-200" />
                               </div>
                             ) : (
                               <p className="text-sm leading-relaxed">{aiInsight?.text}</p>
                             )}
                          </motion.div>
                        )}
                     </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* SIP Calculator Sidebar */}
        <div className={cn(
          "w-full lg:w-96 transition-all duration-500",
          showCalculator ? "translate-x-0 opacity-100" : "lg:hidden opacity-0 translate-x-12"
        )}>
          <Card className="sticky top-28 border-emerald-100 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="text-emerald-600 w-5 h-5" />
                  Compounding Calculator
               </h3>
               <button onClick={() => setShowCalculator(false)} className="lg:hidden text-slate-400">
                  <X className="w-6 h-6" />
               </button>
            </div>

            <div className="space-y-8">
               <div className="space-y-4">
                  <div className="flex justify-between">
                     <label className="text-sm font-bold text-slate-600">Monthly Investment</label>
                     <span className="text-emerald-600 font-bold">₹{calcInput.monthly.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="500" max="100000" step="500"
                    className="w-full accent-emerald-600"
                    value={calcInput.monthly}
                    onChange={e => setCalcInput({...calcInput, monthly: parseInt(e.target.value)})}
                  />
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between">
                     <label className="text-sm font-bold text-slate-600">Investment Tenure</label>
                     <span className="text-emerald-600 font-bold">{calcInput.years} Years</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="40" step="1"
                    className="w-full accent-emerald-600"
                    value={calcInput.years}
                    onChange={e => setCalcInput({...calcInput, years: parseInt(e.target.value)})}
                  />
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between">
                     <label className="text-sm font-bold text-slate-600">Expected Return (p.a.)</label>
                     <span className="text-emerald-600 font-bold">{calcInput.rate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="30" step="0.5"
                    className="w-full accent-emerald-600"
                    value={calcInput.rate}
                    onChange={e => setCalcInput({...calcInput, rate: parseFloat(e.target.value)})}
                  />
               </div>

               <div className="pt-8 border-t border-slate-100 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total Invested</p>
                        <p className="text-lg font-bold text-slate-900">₹{wealth.invested}</p>
                     </div>
                     <div className="p-4 bg-emerald-50 rounded-2xl">
                        <p className="text-[10px] text-emerald-600 uppercase font-bold mb-1">Wealth Gained</p>
                        <p className="text-lg font-bold text-emerald-700">₹{wealth.gained}</p>
                     </div>
                  </div>
                  <div className="p-6 bg-slate-900 rounded-3xl text-center">
                     <p className="text-xs text-slate-400 uppercase font-bold mb-2 tracking-widest">Estimated Total Value</p>
                     <p className="text-4xl font-extrabold text-white">₹{wealth.total}</p>
                  </div>
               </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Comparison Drawer */}
      <AnimatePresence>
        {selectedForComparison.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"
          >
             <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-700 shadow-[0_-20px_50px_rgba(0,0,0,0.3)] p-4 flex items-center justify-between gap-4">
                <div className="flex flex-1 gap-4 overflow-x-auto no-scrollbar">
                   {selectedForComparison.map(sip => (
                     <div key={sip.id} className="min-w-[150px] bg-slate-800 p-3 rounded-xl border border-slate-700 flex justify-between items-center">
                        <div>
                          <p className="text-[8px] text-emerald-400 font-bold uppercase truncate">{sip.name}</p>
                          <p className="text-xs text-white font-bold">{sip.expectedReturn}</p>
                        </div>
                        <button onClick={() => setSelectedForComparison(prev => prev.filter(s => s.id !== sip.id))}>
                          <X className="w-4 h-4 text-slate-500 hover:text-white" />
                        </button>
                     </div>
                   ))}
                   {Array.from({ length: 3 - selectedForComparison.length }).map((_, i) => (
                     <div key={i} className="min-w-[150px] border border-dashed border-slate-700 p-3 rounded-xl flex items-center justify-center">
                        <p className="text-[10px] text-slate-600 font-bold">Add fund to compare</p>
                     </div>
                   ))}
                </div>
                <div className="flex gap-2">
                   <Button variant="ghost" className="text-white hover:bg-slate-800" onClick={() => setSelectedForComparison([])}>Clear</Button>
                   <Button className="whitespace-nowrap">Compare Details</Button>
                </div>
             </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SIPExplorer;
