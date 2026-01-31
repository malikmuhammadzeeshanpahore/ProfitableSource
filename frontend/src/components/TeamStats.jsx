import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function TeamStats({ userId }) {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStats() {
            try {
                const r = await api.getReferralStats()
                if (r) setStats(r)
            } catch (e) {
                console.error('Failed to load team stats', e)
            } finally {
                setLoading(false)
            }
        }
        loadStats()
    }, [userId])

    if (loading) {
        return <div className="text-center text-text-dim py-8">Loading team statistics...</div>
    }

    if (!stats) {
        return <div className="text-center text-text-dim py-8">No team data available</div>
    }

    const { levels, teamInvestment, referralEarnings, commissionBreakdown } = stats

    return (
        <div className="space-y-6">
            {/* Team Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-4 border-accent/20">
                    <div className="text-[10px] text-text-dim font-black uppercase tracking-widest mb-1">Total Team</div>
                    <div className="text-2xl font-black text-white">{levels?.total || 0}</div>
                </div>
                <div className="glass-card p-4 border-accent/20">
                    <div className="text-[10px] text-text-dim font-black uppercase tracking-widest mb-1">Direct Referrals</div>
                    <div className="text-2xl font-black text-accent">{levels?.level1 || 0}</div>
                </div>
                <div className="glass-card p-4 border-accent/20">
                    <div className="text-[10px] text-text-dim font-black uppercase tracking-widest mb-1">Team Investment</div>
                    <div className="text-2xl font-black text-white">Rs {teamInvestment || 0}</div>
                </div>
                <div className="glass-card p-4 border-accent/20">
                    <div className="text-[10px] text-text-dim font-black uppercase tracking-widest mb-1">Total Earnings</div>
                    <div className="text-2xl font-black text-accent">Rs {referralEarnings || 0}</div>
                </div>
            </div>

            {/* Level Breakdown */}
            <div>
                <h4 className="text-sm font-bold text-text-dim uppercase tracking-wider mb-3">Team Levels</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="glass-card p-3 bg-white/5">
                        <div className="text-[10px] text-accent font-bold mb-1">Level A (Direct)</div>
                        <div className="text-lg font-bold text-white">{levels?.level1 || 0} members</div>
                    </div>
                    <div className="glass-card p-3 bg-white/5">
                        <div className="text-[10px] text-text-dim font-bold mb-1">Level B</div>
                        <div className="text-lg font-bold text-white">{levels?.level2 || 0} members</div>
                    </div>
                    <div className="glass-card p-3 bg-white/5">
                        <div className="text-[10px] text-text-dim font-bold mb-1">Level C</div>
                        <div className="text-lg font-bold text-white">{levels?.level3 || 0} members</div>
                    </div>
                    <div className="glass-card p-3 bg-white/5">
                        <div className="text-[10px] text-text-dim font-bold mb-1">Level D</div>
                        <div className="text-lg font-bold text-white">{levels?.level4 || 0} members</div>
                    </div>
                </div>
            </div>

            {/* Commission Breakdown */}
            <div>
                <h4 className="text-sm font-bold text-text-dim uppercase tracking-wider mb-3">Commission Breakdown</h4>
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 glass-card bg-accent/5 border-accent/20">
                        <div className="flex items-center gap-2">
                            <div className="text-xs font-bold text-accent">Level A (10%)</div>
                        </div>
                        <div className="text-sm font-bold text-white">Rs {commissionBreakdown?.levelA || 0}</div>
                    </div>
                    <div className="flex items-center justify-between p-3 glass-card bg-white/5">
                        <div className="flex items-center gap-2">
                            <div className="text-xs font-bold text-text-dim">Level B (5%)</div>
                        </div>
                        <div className="text-sm font-bold text-white">Rs {commissionBreakdown?.levelB || 0}</div>
                    </div>
                    <div className="flex items-center justify-between p-3 glass-card bg-white/5">
                        <div className="flex items-center gap-2">
                            <div className="text-xs font-bold text-text-dim">Level C (2%)</div>
                        </div>
                        <div className="text-sm font-bold text-white">Rs {commissionBreakdown?.levelC || 0}</div>
                    </div>
                    <div className="flex items-center justify-between p-3 glass-card bg-white/5">
                        <div className="flex items-center gap-2">
                            <div className="text-xs font-bold text-text-dim">Level D (0.2%)</div>
                        </div>
                        <div className="text-sm font-bold text-white">Rs {commissionBreakdown?.levelD || 0}</div>
                    </div>
                </div>
            </div>

            <div className="glass-card p-4 bg-accent/5 border-accent/20">
                <p className="text-xs text-text-secondary leading-relaxed">
                    <strong>Note:</strong> You earn commission only on the <strong>first deposit</strong> of each referred user. Commission rates: Level A (10%), Level B (5%), Level C (2%), Level D (0.2%).
                </p>
            </div>
        </div>
    )
}
