'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { 
  Upload,
  FileText,
  MessageSquare,
  Shield,
  CheckCircle,
  Globe,
  Scale,
  Brain,
  Clock,
  ArrowRight,
  Play,
  Cloud,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    gsap.fromTo(".hero-title", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
    gsap.fromTo(".hero-search", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.5 });
    gsap.fromTo(".hero-buttons", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 1 });
    gsap.fromTo(".hero-animation", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 1.5 });

    gsap.utils.toArray<HTMLElement>(".value-prop-card").forEach((card, i) => {
      gsap.fromTo(card, { opacity: 0, y: 50 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
        },
        delay: i * 0.2
      });
    });

    gsap.utils.toArray<HTMLElement>(".how-it-works-step").forEach((step, i) => {
      gsap.fromTo(step, { opacity: 0, y: 50 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: step,
          start: "top 80%",
        },
        delay: i * 0.2
      });
    });
  }, []);
  const valueProps = [
    {
      icon: <div className="flex items-center gap-2"><FileText className="w-5 h-5" /><ArrowRight className="w-4 h-4" /><MessageSquare className="w-5 h-5" /></div>,
      title: "Plain Language Summaries",
      description: "Convert complex legal jargon into clear, simple explanations anyone can understand"
    },
    {
      icon: <div className="flex items-center gap-2"><Scale className="w-5 h-5" /><ArrowRight className="w-4 h-4" /><Shield className="w-5 h-5" /></div>,
      title: "Risk Assessment & Fraud Detection",
      description: "Identify potential legal risks and fraud patterns with AI-powered analysis"
    },
    {
      icon: <div className="flex items-center gap-2"><Scale className="w-5 h-5" /><ArrowRight className="w-4 h-4" /><CheckCircle className="w-5 h-5" /></div>,
      title: "Constitutional Compliance Checks",
      description: "Ensure your documents comply with Indian constitutional and legal requirements"
    },
    {
      icon: <div className="flex items-center gap-2"><Globe className="w-5 h-5" /><ArrowRight className="w-4 h-4" /><MessageSquare className="w-5 h-5" /></div>,
      title: "Multilingual Support",
      description: "Supporting all major Indian languages with cultural context understanding"
    }
  ];

  const steps = [
    { icon: <Upload className="w-8 h-8" />, title: "Upload Document", description: "Drag & drop or paste your legal document" },
    { icon: <Brain className="w-8 h-8" />, title: "AI Analysis", description: "Multi-agent AI processes your document" },
    { icon: <Shield className="w-8 h-8" />, title: "Risk & Compliance Check", description: "Comprehensive legal review" },
    { icon: <FileText className="w-8 h-8" />, title: "Visual Reports & Insights", description: "Clear, actionable results" }
  ];

  const differentiators = [
    { label: "Indian Law Specialized", color: "bg-blue-100 text-blue-800" },
    { label: "Multi-Agent AI", color: "bg-green-100 text-green-800" },
    { label: "Constitutional Awareness Engine", color: "bg-yellow-100 text-yellow-800" },
    { label: "Real-time Updates", color: "bg-red-100 text-red-800" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">{/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-xl text-gray-900">LegalAI Demystifier</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Features</Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm font-medium">How it Works</Link>
              <Link href="#security" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Security</Link>
              <Link href="/chat" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                <MessageSquare className="w-4 h-4 inline-block mr-1" />
                Legal Chat
              </Link>
              <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-normal text-gray-900 mb-6 leading-tight hero-title">
            Transform complex Indian legal documents into simple insights
          </h1>
          
          {/* Google-style Search Bar */}
          <div className="max-w-2xl mx-auto mb-8 hero-search">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                placeholder="Upload or paste your legal document to simplify"
                onClick={() => router.push('/dashboard')}
                readOnly
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                  <Link href="/dashboard">
                    <Upload className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 hero-buttons">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 shadow-md hover:shadow-lg transition-shadow">
              <Link href="/dashboard">
                <Upload className="w-5 h-5 mr-2" />
                Upload Document
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 rounded-full px-8 py-3 hover:bg-gray-50">
              <Play className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>

          {/* Subtle Animation Placeholder */}
          <div className="max-w-lg mx-auto hero-animation">
            <div className="bg-gray-100 rounded-2xl p-8 relative overflow-hidden">
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Legal Document</p>
                </div>
                <ArrowRight className="w-6 h-6 text-blue-600 animate-pulse" />
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Simple Insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Value Propositions */}
      <section className="py-20 bg-gray-50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-normal text-gray-900 mb-4">Why choose LegalAI Demystifier?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Making Indian law accessible to everyone with AI-powered analysis</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => (
              <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow rounded-2xl value-prop-card">
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-4 text-blue-600">
                    {prop.icon}
                  </div>
                  <CardTitle className="text-lg font-medium text-gray-900">{prop.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 text-sm leading-relaxed">{prop.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white" id="how-it-works">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-normal text-gray-900 mb-4">How it works</h2>
            <p className="text-xl text-gray-600">Simple process, powerful results</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative how-it-works-step">
                <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-600">{step.icon}</div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-gray-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Differentiators */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-normal text-gray-900 mb-8">What makes us unique</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {differentiators.map((diff, index) => (
              <Badge key={index} className={`${diff.color} border-0 px-4 py-2 text-sm font-medium rounded-full`}>
                {diff.label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Demo Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-normal text-gray-900 mb-4">See the transformation</h2>
            <p className="text-xl text-gray-600">From complex legal text to simple insights</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Original Legal Text */}
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Original Legal Document
              </h3>
              <Card className="bg-gray-50 border border-gray-200 rounded-2xl">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-700 leading-relaxed font-mono">
                    "WHEREAS the party of the first part (hereinafter referred to as 'Lessor') being the absolute owner and in lawful possession of the premises situated at... hereby agrees to lease, demise and let unto the party of the second part (hereinafter referred to as 'Lessee') the said premises for a term of..."
                  </p>
                  <div className="mt-4 text-xs text-gray-500">Complex legal jargon • Hard to understand • 847 words</div>
                </CardContent>
              </Card>
            </div>

            {/* Simplified Summary */}
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                AI-Simplified Summary
              </h3>
              <Card className="bg-green-50 border border-green-200 rounded-2xl">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong>This is a rental agreement</strong> where the property owner agrees to rent their property to a tenant. The key points are the rental period, monthly rent amount, and basic responsibilities of both parties.
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-green-700">Plain language • Easy to understand • 32 words</div>
                    <Badge className="bg-green-100 text-green-800 border-0">Risk Score: Low</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-xl text-gray-900">LegalAI Demystifier</span>
            </div>
            
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <span className="text-sm text-gray-600">Powered by</span>
              <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full">
                <Cloud className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Google Cloud</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-8 mb-4 md:mb-0">
              <Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm">About</Link>
              <Link href="/features" className="text-gray-600 hover:text-gray-900 text-sm">Features</Link>
              <Link href="/security" className="text-gray-600 hover:text-gray-900 text-sm">Security</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-sm">Contact</Link>
            </div>
            
            <p className="text-gray-500 text-sm">&copy; 2025 LegalAI Demystifier. Making law accessible.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
