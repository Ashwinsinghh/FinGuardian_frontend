'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface MemeReactionProps {
    summary: string;
    risks: string;
    hiddenCharges: string;
    riskScore: number;
}

export default function MemeReaction({ summary, risks, hiddenCharges, riskScore }: MemeReactionProps) {
    const [reaction, setReaction] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchMeme = async () => {
            try {
                const res = await fetch('/api/meme', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ summary, risks, hiddenCharges, riskScore })
                });

                if (!res.ok) throw new Error('Failed to fetch meme');

                const data = await res.json();
                setReaction(data.reply);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMeme();
    }, [summary, risks, hiddenCharges, riskScore]);

    if (error) return null;

    return (
        <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-6 border border-orange-200 shadow-sm transition-transform hover:scale-[1.01] animate-in fade-in duration-500">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                Chatpata AI Reaction <span className="ml-2">🌶️🔥</span>
            </h3>

            {isLoading ? (
                <div className="flex items-center space-x-2 text-orange-500 py-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Cooking some spicy reactions...</span>
                </div>
            ) : (
                <div className="text-slate-800 font-medium leading-relaxed whitespace-pre-line text-[16px]">
                    {reaction.replace(/['"]/g, '')}
                </div>
            )}
        </div>
    );
}
