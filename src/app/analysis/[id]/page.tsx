'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { format } from 'date-fns';
import {
    FileText, ArrowLeft, ShieldAlert, AlertTriangle,
    Activity, CheckCircle2, DollarSign,
    TrendingUp, PieChart as PieChartIcon, BarChart3
} from 'lucide-react';
import Link from 'next/link';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import MemeReaction from '@/components/MemeReaction';

interface DocumentDetails {
    id: string;
    userId: string;
    fileName: string;
    fileType: string;
    createdAt: string;
    analysis: {
        id: string;
        summary: string;
        explanation: string;
        hiddenCharges: string;
        risks: string;
        warnings: string;
        recommendations: string;
        riskScore: number;
    } | null;
}

export default function AnalysisPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [doc, setDoc] = useState<DocumentDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoc = async () => {
            try {
                const res = await api.get(`/documents/${params.id}`);
                setDoc(res.data);
            } catch {
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchDoc();
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50 min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!doc || !doc.analysis) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 min-h-screen text-center px-4">
                <ShieldAlert className="w-16 h-16 text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800">Analysis Not Found</h2>
                <p className="text-slate-500 mt-2">We couldn&apos;t load the analysis for this document.</p>
                <Link href="/dashboard" className="mt-6 font-semibold text-blue-600 hover:text-blue-800 flex items-center transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>
            </div>
        );
    }

    const score = doc.analysis.riskScore;

    const getRiskLevel = (s: number) => {
        if (s <= 30) return { label: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-100', gradient: 'from-emerald-50/50 to-transparent', icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" /> };
        if (s <= 70) return { label: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-100', gradient: 'from-amber-50/50 to-transparent', icon: <AlertTriangle className="w-5 h-5 text-amber-600" /> };
        return { label: 'High', color: 'text-rose-600', bg: 'bg-rose-100', gradient: 'from-rose-50/50 to-transparent', icon: <Activity className="w-5 h-5 text-rose-600" /> };
    };

    const getRiskColor = (s: number) => {
        if (s <= 30) return '#10b981'; // emerald-500
        if (s <= 70) return '#eab308'; // yellow-500
        return '#ef4444'; // red-500
    };

    const riskLevel = getRiskLevel(score);
    const riskGaugeColor = getRiskColor(score);

    // Derive graph data from riskScore
    const estimatedPrincipal = 25000;
    const estimatedInterest = Math.round(estimatedPrincipal * (score / 100) * 0.65);

    // Fallbacks just to ensure valid numbers visually
    const finalPrincipal = estimatedPrincipal > 0 ? estimatedPrincipal : 10000;
    const finalInterest = estimatedInterest >= 0 ? estimatedInterest : 1500;

    const donutData = [
        { name: 'Principal', value: finalPrincipal, fill: '#3b82f6' },
        { name: 'Interest', value: finalInterest, fill: riskGaugeColor }
    ];

    const barData = [
        { name: 'Breakdown', Principal: finalPrincipal, Interest: finalInterest }
    ];

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="flex-1 bg-gradient-to-b from-slate-50 to-white min-h-screen py-8 px-6 lg:px-8">
            <style>{`
                @keyframes customFadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-custom-fade {
                    animation: customFadeIn 0.8s ease-out forwards;
                }
            `}</style>

            <div className="max-w-7xl mx-auto space-y-8 animate-custom-fade relative">

                <Link href="/dashboard" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                </Link>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight truncate max-w-2xl" title={doc.fileName}>
                            {doc.fileName}
                        </h1>
                        <p className="text-slate-500 mt-2 text-sm font-medium">
                            Analysis generated on {format(new Date(doc.createdAt), 'MMMM do, yyyy h:mm a')}
                        </p>
                    </div>
                </div>

                {/* Top Summary Section: 4 Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Risk Score Gauge Chart */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 w-full">
                            <h3 className="text-sm font-semibold text-slate-500 mb-2 flex items-center">
                                <Activity className="w-5 h-5 mr-2 text-slate-400" /> Risk Score
                            </h3>
                            <div className="h-28 w-full flex items-center justify-center relative mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart
                                        cx="50%" cy="50%"
                                        innerRadius="75%" outerRadius="100%"
                                        barSize={10}
                                        data={[{ name: 'Score', value: score, fill: 'url(#riskGradient)' }]}
                                        startAngle={90} endAngle={-270}
                                    >
                                        <defs>
                                            <linearGradient id="riskGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor={riskGaugeColor} />
                                                <stop offset="100%" stopColor={riskGaugeColor} stopOpacity={0.8} />
                                            </linearGradient>
                                        </defs>
                                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                        <RadialBar background={{ fill: '#f1f5f9' }} dataKey="value" cornerRadius={10} animationDuration={1500} />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-3xl font-extrabold text-slate-800">{score}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Estimated Principal */}
                    <MetricCard
                        title="Estimated Principal"
                        value={formatCurrency(finalPrincipal)}
                        icon={<DollarSign className="w-6 h-6 text-blue-600" />}
                        gradient="from-blue-50/50 to-transparent"
                        iconBg="bg-blue-100"
                    />

                    {/* Card 3: Estimated Interest */}
                    <MetricCard
                        title="Estimated Interest"
                        value={formatCurrency(finalInterest)}
                        icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
                        gradient="from-indigo-50/50 to-transparent"
                        iconBg="bg-indigo-100"
                    />

                    {/* Card 4: Risk Level */}
                    <MetricCard
                        title="Risk Level"
                        value={riskLevel.label}
                        icon={riskLevel.icon}
                        gradient={riskLevel.gradient}
                        iconBg={riskLevel.bg}
                        valueColor={riskLevel.color}
                    />
                </div>

                {/* Meme Reaction Section */}
                <MemeReaction
                    summary={doc.analysis.summary}
                    risks={doc.analysis.risks}
                    hiddenCharges={doc.analysis.hiddenCharges}
                    riskScore={doc.analysis.riskScore}
                />

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Chart: Cost Breakdown Donut Chart */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative group hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2 mb-6">
                            <PieChartIcon className="w-5 h-5 text-slate-500" />
                            <h3 className="text-lg font-bold text-slate-800">Cost Breakdown</h3>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={donutData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {donutData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        formatter={(value: any) => formatCurrency(value || 0)}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right Chart: Payment Breakdown Bar Chart */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative group hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2 mb-6">
                            <BarChart3 className="w-5 h-5 text-slate-500" />
                            <h3 className="text-lg font-bold text-slate-800">Payment Breakdown</h3>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        tickFormatter={(val: any) => `$${val / 1000}k`}
                                        tick={{ fill: '#64748b' }}
                                    />
                                    <RechartsTooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        formatter={(value: any) => formatCurrency(value || 0)}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    <Bar dataKey="Principal" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={45} animationDuration={1000} />
                                    <Bar dataKey="Interest" fill={riskGaugeColor} radius={[6, 6, 0, 0]} barSize={45} animationDuration={1000} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Analysis Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ContentCard
                        icon={<FileText className="w-5 h-5 text-blue-600" />}
                        iconBg="bg-blue-100"
                        title="Summary"
                        content={doc.analysis.summary}
                    />
                    <ContentCard
                        icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
                        iconBg="bg-amber-100"
                        title="Risks"
                        content={doc.analysis.risks}
                    />
                    <ContentCard
                        icon={<DollarSign className="w-5 h-5 text-rose-600" />}
                        iconBg="bg-rose-100"
                        title="Charges"
                        content={doc.analysis.hiddenCharges}
                    />
                    <ContentCard
                        icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        iconBg="bg-emerald-100"
                        title="Recommendations"
                        content={doc.analysis.recommendations}
                    />
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, gradient, iconBg, valueColor = 'text-slate-900' }: { title: string, value: string, icon: React.ReactNode, gradient: string, iconBg: string, valueColor?: string }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-center h-full">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold text-slate-500">{title}</h3>
                    <div className={`p-2.5 rounded-xl ${iconBg} transition-colors`}>
                        {icon}
                    </div>
                </div>
                <div className={`text-3xl font-extrabold tracking-tight ${valueColor}`}>
                    {value}
                </div>
            </div>
        </div>
    );
}

function ContentCard({ icon, iconBg, title, content }: { icon: React.ReactNode, iconBg: string, title: string, content: string }) {
    const paragraphs = content ? content.split('\n').filter(p => p.trim() !== '') : [];

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-5 border-b border-slate-100 pb-4">
                <div className={`p-2.5 rounded-xl ${iconBg}`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            </div>
            <div className="text-slate-600 leading-relaxed text-sm space-y-4">
                {paragraphs.length > 0 ? (
                    paragraphs.map((para, idx) => {
                        const isListItem = para.trim().startsWith('-') || para.trim().match(/^\d+\./);
                        return (
                            <p key={idx} className={isListItem ? "pl-5 relative before:content-['•'] before:absolute before:left-1 before:text-slate-400" : ""}>
                                {para.replace(/^-\s*/, '').replace(/^\d+\.\s*/, '')}
                            </p>
                        );
                    })
                ) : (
                    <p className="italic text-slate-400">No additional details provided.</p>
                )}
            </div>
        </div>
    );
}
