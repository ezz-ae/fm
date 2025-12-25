"use client";

import { useState, useEffect } from 'react';
import { 
  Activity, 
  Terminal, 
  ShieldCheck, 
  Zap, 
  Eye,
  Settings,
  Volume2,
  VolumeX,
  Play,
  Edit,
  Save,
  AlertTriangle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Experiment {
  id: string;
  name: string;
  price: number;
  active: boolean;
}

export default function ControlRoom() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [basePrice, setBasePrice] = useState(10);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  
  const [experiments, setExperiments] = useState<Experiment[]>([
    { id: 'exp_decision', name: 'Decision Lock', price: 0, active: true },
    { id: 'exp_learning', name: 'Neural Learning', price: 0, active: true },
    { id: 'exp_collective', name: 'Collective Wave', price: 5, active: false }
  ]);

  useEffect(() => {
    const refreshData = () => {
      const allKeys = Object.keys(localStorage);
      const nodeKeys = allKeys.filter(k => k.startsWith('aimas_node_'));
      const nodeData = nodeKeys.map(k => {
        const data = JSON.parse(localStorage.getItem(k)!);
        // Simulate usage cost
        const usageCost = (data.intensity * 0.5) + (Math.random() * 0.2); 
        return { id: k.replace('aimas_node_', ''), usageCost, ...data };
      });
      
      setNodes(nodeData);
      setTotalRevenue(nodeKeys.length * basePrice);
      setAnomalies(nodeData.filter(n => n.usageCost > 3.0));
    };

    refreshData();
    const interval = setInterval(refreshData, 3000); 
    return () => clearInterval(interval);
  }, [basePrice]);

  const handleWipe = () => {
    if (confirm("CONFIRM PROTOCOL WIPE: This will purge all active signals.")) {
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(k => {
        if (k.startsWith('aimas_node_')) localStorage.removeItem(k);
      });
      setNodes([]);
      setAnomalies([]);
      setTotalRevenue(0);
    }
  };

  const handleZap = (id: string) => {
    localStorage.removeItem(`aimas_node_${id}`);
    setNodes(prev => prev.filter(n => n.id !== id));
    setAnomalies(prev => prev.filter(n => n.id !== id));
  };

  const updateExperimentPrice = (id: string, newPrice: number) => {
    setExperiments(prev => prev.map(ex => ex.id === id ? { ...ex, price: newPrice } : ex));
  };

  const toggleExperiment = (id: string) => {
    setExperiments(prev => prev.map(ex => ex.id === id ? { ...ex, active: !ex.active } : ex));
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-primary p-8 font-mono selection:bg-primary/20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-primary/20 pb-8 mb-12 gap-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary flex items-center justify-center text-black font-black">Ω</div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase">Control Room</h1>
            <p className="text-[10px] text-primary/40 uppercase tracking-widest">Protocol Authority</p>
          </div>
        </div>
        <div className="flex gap-12 items-center w-full md:w-auto justify-between">
           <button 
             onClick={() => setIsMuted(!isMuted)}
             className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary/40 hover:text-primary transition-colors"
           >
             {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />} 
             {isMuted ? 'Muted' : 'Sound Active'}
           </button>
           <div className="text-right">
             <p className="text-[10px] text-primary/40 uppercase">Liquidity</p>
             <p className="text-xl text-green-500">${totalRevenue}</p>
           </div>
           <div className="text-right">
             <p className="text-[10px] text-primary/40 uppercase">Signals</p>
             <p className="text-xl">{nodes.length}</p>
           </div>
        </div>
      </header>

      {anomalies.length > 0 && (
        <div className="mb-8 p-4 border border-red-500/20 bg-red-500/5 rounded-xl flex items-center justify-between animate-pulse">
           <div className="flex items-center gap-4 text-red-500">
              <AlertTriangle size={16} />
              <span className="text-xs uppercase tracking-widest font-bold">Protocol Violation Detected</span>
           </div>
           <span className="text-xs text-red-500/60 font-mono">{anomalies.length} nodes exceeding resource caps</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-primary/[0.02] border border-primary/10 rounded-xl overflow-hidden">
             <div className="bg-primary/5 p-4 flex justify-between items-center border-b border-primary/10">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
                   <Activity size={14} /> Execution Pulse
                </div>
                <button onClick={handleWipe} className="text-[10px] text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-2">
                  <RefreshCw size={10} /> Purge All Signals
                </button>
             </div>
             <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
               <table className="w-full text-left text-[11px]">
                 <thead className="bg-primary/[0.03] text-primary/30 uppercase tracking-tighter sticky top-0 bg-[#050505] z-10">
                   <tr>
                     <th className="p-4">Node</th>
                     <th className="p-4 hidden md:table-cell">Intensity</th>
                     <th className="p-4">Activity</th>
                     <th className="p-4 hidden md:table-cell">Status</th>
                     <th className="p-4">Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {nodes.length === 0 && (
                     <tr>
                       <td colSpan={5} className="p-8 text-center text-primary/20 italic">No active signals detected. Protocol waiting.</td>
                     </tr>
                   )}
                   {nodes.map((node) => (
                     <tr key={node.id} className={cn("border-t border-primary/5 hover:bg-primary/[0.01]", node.usageCost > 3.0 && "bg-red-500/[0.05]")}>
                       <td className="p-4 font-bold tracking-widest">@{node.handle}</td>
                       <td className="p-4 text-primary/60 hidden md:table-cell">{node.intensity}x</td>
                       <td className="p-4 text-primary/80 truncate max-w-[150px]">
                         {node.lastAction || 'Idle'}
                       </td>
                       <td className="p-4 hidden md:table-cell">
                         {node.usageCost > 3.0 ? (
                           <span className="text-red-500 flex items-center gap-1"><AlertTriangle size={10} /> FLAGGED</span>
                         ) : (
                           <span className="text-green-500/60">Stable</span>
                         )}
                       </td>
                       <td className="p-4 flex gap-3">
                         <button className="hover:text-primary text-primary/30"><Eye size={14} /></button>
                         <button onClick={() => handleZap(node.id)} className="hover:text-red-500 text-primary/30"><Zap size={14} /></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="border border-primary/10 p-6 rounded-xl space-y-6">
                <h3 className="text-xs uppercase tracking-widest font-bold flex items-center gap-2"><Zap size={14} /> Experience Inventory</h3>
                <div className="space-y-4">
                   {experiments.map(ex => (
                     <div key={ex.id} className="w-full text-left p-4 text-[10px] border border-primary/5 hover:border-primary/20 transition-all flex justify-between items-center bg-primary/[0.01]">
                        <span className={cn("uppercase", !ex.active && "text-primary/20")}>{ex.name}</span>
                        <div className="flex items-center gap-4">
                           <input 
                             type="number" 
                             value={ex.price}
                             onChange={(e) => updateExperimentPrice(ex.id, parseInt(e.target.value))}
                             className="bg-transparent border-b border-primary/20 w-12 text-right focus:outline-none focus:border-primary text-primary/60"
                           />
                           <button onClick={() => toggleExperiment(ex.id)} className="hover:text-primary transition-colors">
                             {ex.active ? <Activity size={12} className="text-green-500" /> : <Activity size={12} className="text-primary/20" />}
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="border border-primary/10 p-6 rounded-xl space-y-6">
                <h3 className="text-xs uppercase tracking-widest font-bold flex items-center gap-2"><ShieldCheck size={14} /> Financial Protocol</h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-center text-[10px] uppercase border-b border-primary/5 pb-4">
                      <span className="text-primary/40">Base Entry Fee</span>
                      <div className="flex items-center gap-2">
                        {isEditingPrice ? (
                          <input 
                            type="number" 
                            value={basePrice} 
                            onChange={(e) => setBasePrice(parseInt(e.target.value))}
                            className="bg-transparent w-16 text-right font-bold focus:outline-none border-b border-primary"
                            autoFocus
                          />
                        ) : (
                          <span className="font-bold">${basePrice}.00</span>
                        )}
                        <button onClick={() => setIsEditingPrice(!isEditingPrice)} className="text-primary/40 hover:text-primary">
                          {isEditingPrice ? <Save size={12} /> : <Edit size={12} />}
                        </button>
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                      <div className="flex justify-between text-[10px] text-primary/40 uppercase">
                        <span>Gateway</span>
                        <span className="text-green-500">Live</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-primary/40 uppercase">
                        <span>Usage Cap</span>
                        <span className="text-red-500 font-bold">$3.00/mo</span>
                      </div>
                   </div>

                   <button 
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    className="w-full py-3 bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-colors flex justify-center gap-2 items-center disabled:opacity-50"
                   >
                     {isDeploying ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                     {isDeploying ? "Deploying..." : "Deploy to Stripe"}
                   </button>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-black border border-primary/10 rounded-xl overflow-hidden flex flex-col h-[600px]">
           <div className="bg-primary/5 p-4 flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
              <Terminal size={14} /> System Terminal
           </div>
           <div className="flex-1 p-4 overflow-y-auto text-[10px] text-primary/60 space-y-1 font-mono">
              <p>{'>'} SYSTEM INITIALIZED...</p>
              <p>{'>'} STATUS: OBSERVING SIGNAL FLUX...</p>
              {nodes.map(n => (
                 <div key={n.id}>
                   {n.lastAction && (
                     <p className="text-green-500/80 animate-in fade-in slide-in-from-left duration-300">
                       {'>'} node_{n.id.substring(0,4)}: {n.lastAction}
                     </p>
                   )}
                   <p className="text-primary/20">
                     {'>'} node_{n.id.substring(0,4)}: cost ${n.usageCost.toFixed(2)}
                   </p>
                 </div>
              ))}
              <div className="animate-pulse text-primary/40">_</div>
           </div>
        </div>
      </div>
    </div>
  );
}
