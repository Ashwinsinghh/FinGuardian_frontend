import Link from 'next/link';
import { ArrowRight, FileText, Activity, ShieldAlert, Cpu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">

      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>Powered by Gemini 1.5 Pro</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 max-w-4xl drop-shadow-sm">
          Understand Insurance and Loan Documents in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Seconds</span>
        </h1>

        <p className="text-xl text-slate-600 mb-10 max-w-2xl font-medium leading-relaxed">
          Upload any complex financial legal contract. Our AI instantly analyzes, summarizes, and highlights hidden charges and critical risks.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/signup" className="group inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-200">
            Get Started <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl text-lg font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How FinGuardian Works</h2>
            <p className="mt-4 text-lg text-slate-600">Upload your PDF. Get instant clarity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-blue-500" />}
              title="Instant Summaries"
              description="Boil down 50-page contracts into 5 easy-to-read bullet points."
            />
            <FeatureCard
              icon={<ShieldAlert className="w-8 h-8 text-rose-500" />}
              title="Uncover Hidden Charges"
              description="Identify sneaky fees, hidden premiums, and unexpected costs before you sign."
            />
            <FeatureCard
              icon={<Activity className="w-8 h-8 text-amber-500" />}
              title="Risk Scoring"
              description="Get a clear 1-100 risk score based on the aggressiveness of the contract clauses."
            />
            <FeatureCard
              icon={<Cpu className="w-8 h-8 text-indigo-500" />}
              title="AI Recommendations"
              description="Receive smart actionable advice on what to negotiate or look out for."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
      <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
