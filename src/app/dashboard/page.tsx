'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { format } from 'date-fns';
import { FileText, ArrowRight, UploadCloud, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Document {
    id: string;
    fileName: string;
    createdAt: string;
    analysis: {
        riskScore: number;
        summary: string;
    } | null;
}

export default function DashboardPage() {
    const router = useRouter();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await api.get('/documents');
                setDocuments(res.data);
            } catch (err) {
                console.error('Failed to fetch documents', err);
                // If unauthorized, redirect to login
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchDocuments();
    }, [router]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Your Dashboard</h1>
                        <p className="mt-1 text-slate-600">Review and manage your analyzed financial documents.</p>
                    </div>
                    <Link href="/upload" className="mt-4 sm:mt-0 flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-colors">
                        <UploadCloud className="w-5 h-5 mr-2" />
                        Analyze New Document
                    </Link>
                </div>

                {documents.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <FileText className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                        <h3 className="text-xl font-medium text-slate-900">No documents yet</h3>
                        <p className="mt-2 text-slate-500 mb-6">Upload your first insurance policy or loan agreement to get started.</p>
                        <Link href="/upload" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800">
                            Upload Document <ArrowRight className="ml-1 w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map((doc) => (
                            <div key={doc.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3 truncate shrink">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-900 truncate" title={doc.fileName}>
                                            {doc.fileName}
                                        </h3>
                                    </div>
                                    {doc.analysis && (
                                        <div className={`shrink-0 flex items-center px-2 py-1 rounded-full text-xs font-bold ${doc.analysis.riskScore > 70 ? 'bg-rose-100 text-rose-700' :
                                                doc.analysis.riskScore > 40 ? 'bg-amber-100 text-amber-700' :
                                                    'bg-emerald-100 text-emerald-700'
                                            }`}>
                                            Score: {doc.analysis.riskScore}
                                        </div>
                                    )}
                                </div>

                                <p className="text-sm text-slate-500 mb-4 flex-grow line-clamp-3">
                                    {doc.analysis ? doc.analysis.summary : 'Analysis pending...'}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                    <span className="text-xs text-slate-400 font-medium">
                                        {format(new Date(doc.createdAt), 'MMM d, yyyy')}
                                    </span>
                                    <Link href={`/analysis/${doc.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center group-hover:translate-x-1 transition-transform">
                                        View Details <ArrowRight className="ml-1 w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
