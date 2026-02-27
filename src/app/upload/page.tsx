'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { UploadCloud, File, AlertCircle, Loader2 } from 'lucide-react';

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleFileSelection = (selectedFile: File) => {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(selectedFile.type)) {
            toast.error('Please upload a valid PDF or DOCX file.');
            return;
        }
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('document', file);

        try {
            const toastId = toast.loading('Uploading and analyzing with Gemini AI... This might take a few seconds.');
            const res = await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Analysis complete!', { id: toastId });
            router.push(`/analysis/${res.data.document.id}`);
        } catch (err: any) {
            toast.dismiss();
            toast.error(err.response?.data?.error || 'Failed to process document');
            if (err.response?.status === 401) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Analyze Document</h1>
                    <p className="mt-3 text-lg text-slate-600">
                        Upload your insurance policy, loan agreement, or any financial contract.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-12">

                    <div
                        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.docx"
                            onChange={handleChange}
                        />

                        {!file ? (
                            <div className="flex flex-col items-center cursor-pointer" onClick={() => inputRef.current?.click()}>
                                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                                    <UploadCloud className="w-10 h-10 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-1">Click to upload or drag and drop</h3>
                                <p className="text-sm text-slate-500">PDF or DOCX (Max 10MB)</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="p-4 bg-blue-100 rounded-full mb-4">
                                    <File className="w-10 h-10 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-1">{file.name}</h3>
                                <p className="text-sm text-slate-500 mb-6 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setFile(null)}
                                        disabled={loading}
                                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={loading}
                                        className="px-6 py-2 flex items-center text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-colors disabled:opacity-70"
                                    >
                                        {loading ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                                        ) : (
                                            'Analyze Document'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex items-start space-x-3 text-sm text-slate-600 bg-amber-50 rounded-xl p-4 border border-amber-100">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p>
                            Your document is securely processed. We do not use your documents to train any models. The output is powered by Google Gemini AI.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
