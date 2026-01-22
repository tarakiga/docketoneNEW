"use client"

import { motion } from "framer-motion"
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface CaffeineChartProps {
    data: any[]
    sleepGoalHour: number
}

export function CaffeineDecayChart({ data, sleepGoalHour }: CaffeineChartProps) {
    if (!data.length) return null

    return (
        <motion.div 
            className="bg-black/40 backdrop-blur-xl p-6 h-[400px] w-full rounded-2xl border border-white/10 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="mb-6 flex justify-between items-center">
                 <h3 className="text-slate-400 uppercase tracking-widest text-xs font-bold">Decay Projection (24h)</h3>
                 <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_currentColor]"></span> Current</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/20"></span> Sleep Goal</div>
                 </div>
            </div>
            
            <ResponsiveContainer width="100%" height="100%" maxHeight={320}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorCaffeineNeon" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                    <XAxis 
                        dataKey="label" 
                        stroke="#64748b" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        minTickGap={30} 
                    />
                    <YAxis 
                        stroke="#64748b" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `${value}`} 
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(5, 5, 10, 0.9)', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            borderRadius: '12px',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 4px 30px rgba(0,0,0,0.8)'
                        }}
                        itemStyle={{ color: '#e2e8f0' }}
                        labelStyle={{ color: '#22d3ee', fontWeight: 'bold', marginBottom: '8px' }}
                    />
                    {/* Sleep Line Reference */}
                    <ReferenceLine x={data.find(d => d.isSleep)?.label} stroke="#ffffff30" strokeDasharray="3 3" label={{ value: "Bedtime", fill: "#ffffff50", fontSize: 10, position: "insideTopRight" }} />
                    
                    <Area 
                        type="monotone" 
                        dataKey="caffeine" 
                        stroke="#22d3ee" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorCaffeineNeon)" 
                        animationDuration={1500}
                        animationEasing="ease-out"
                        filter="drop-shadow(0 0 6px rgba(34,211,238,0.3))" 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    )
}
