"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileUpload } from "./ui/file-upload";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Loader2
} from "lucide-react";

interface AnalysisResult {
  constitutional_analysis?: {
    compliance_status?: string;
    reasoning?: string;
    potential_issues?: string[];
    recommendations?: string[];
  };
  visualization_url?: string;
  web_intelligence_results?: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
  web_search_status?: string;
  web_search_timestamp?: string;
  analysis_status?: string;
  analysis_timestamp?: string;
  raw_firestore_data?: any;
}

interface Message {
  id: string;
  content: string;
  isAi: boolean;
  timestamp: Date;
  analysisResult?: AnalysisResult;
  error?: string;
}

export function DashboardContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [processingError, setProcessingError] = useState("");

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = async (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    
    // Process PDF files for analysis
    const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');
    
    for (const pdfFile of pdfFiles) {
      await processPdfFile(pdfFile);
    }
  };

  const processPdfFile = async (file: File) => {
    setIsProcessingPdf(true);
    setProcessingError('');

    try {
      console.log('=== FILE UPLOAD PROCESS STARTED ===');
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString()
      });

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('pdfFile', file);

      console.log('Sending file to /api/upload...');

      // Step 1: Upload the file to backend
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', uploadResponse.status);
      console.log('Upload response headers:', Object.fromEntries(uploadResponse.headers.entries()));

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      const uploadResult = await uploadResponse.json();
      console.log('Upload result:', JSON.stringify(uploadResult, null, 2));

      const { documentId } = uploadResult;

      // Add a processing message with upload details
      const processingMessage: Message = {
        id: Date.now().toString(),
        content: `📄 Analyzing document: ${file.name}\n\n` +
                `File Details:\n` +
                `• Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB\n` +
                `• Type: ${file.type}\n` +
                `• Document ID: ${documentId}\n\n` +
                `Processing... Please wait, this may take a minute or two.`,
        isAi: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, processingMessage]);

      console.log('Starting polling for document ID:', documentId);

      // Step 2: Poll for results
      pollForResults(documentId, file.name, processingMessage.id);

    } catch (error) {
      console.error('File processing error:', error);
      setProcessingError(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsProcessingPdf(false);
    }
  };

  const pollForResults = async (documentId: string, fileName: string, processingMessageId: string) => {
    console.log('Starting to poll for results for documentId:', documentId);
    
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes
    
    const interval = setInterval(async () => {
      try {
        attempts++;
        console.log(`Polling attempt ${attempts}/${maxAttempts} for status...`, documentId);
        const statusResponse = await fetch(`/api/check-status?id=${documentId}`);
        console.log('Status response:', statusResponse.status);
        
        if (statusResponse.ok) {
          const data = await statusResponse.json();
          console.log('=== COMPLETE API RESPONSE DATA ===');
          console.log('Response Status:', statusResponse.status);
          console.log('Response Headers:', Object.fromEntries(statusResponse.headers.entries()));
          console.log('Full Response Data:', JSON.stringify(data, null, 2));
          console.log('Data Type:', typeof data);
          console.log('Data Keys:', Object.keys(data));
          console.log('Has visualization_url:', !!data.visualization_url);
          console.log('Has constitutional_analysis:', !!data.constitutional_analysis);
          console.log('Has web_intelligence_results:', !!data.web_intelligence_results);
          console.log('Has raw_firestore_data:', !!data.raw_firestore_data);
          console.log('=== END API RESPONSE DATA ===');
          
          // Only proceed if we have COMPLETE constitutional analysis data with potential_issues AND recommendations
          // Check if we have complete analysis AND visualization
          const hasCompleteAnalysis = data.constitutional_analysis &&
                                    data.constitutional_analysis.compliance_status &&
                                    data.constitutional_analysis.potential_issues &&
                                    data.constitutional_analysis.recommendations &&
                                    data.constitutional_analysis.potential_issues.length > 0 &&
                                    data.constitutional_analysis.recommendations.length > 0;
          
          const hasVisualization = data.visualization_url && 
                                  typeof data.visualization_url === 'string' && 
                                  data.visualization_url.trim().length > 0 &&
                                  data.visualization_url.startsWith('http');
          const isFullyComplete = hasCompleteAnalysis && hasVisualization;
          
          console.log('=== ANALYSIS COMPLETION CHECK ===');
          console.log('Has complete constitutional analysis:', hasCompleteAnalysis);
          console.log('Constitutional analysis object:', data.constitutional_analysis);
          console.log('Has compliance status:', !!data.constitutional_analysis?.compliance_status);
          console.log('Has potential issues:', !!data.constitutional_analysis?.potential_issues);
          console.log('Potential issues length:', data.constitutional_analysis?.potential_issues?.length || 0);
          console.log('Has recommendations:', !!data.constitutional_analysis?.recommendations);
          console.log('Recommendations length:', data.constitutional_analysis?.recommendations?.length || 0);
          console.log('Has visualization:', hasVisualization);
          console.log('Visualization URL value:', data.visualization_url);
          console.log('Visualization URL type:', typeof data.visualization_url);
          console.log('Is fully complete (analysis + visualization):', isFullyComplete);
          console.log('=== END ANALYSIS CHECK ===');
          
          if (isFullyComplete) {
            console.log('Analysis AND visualization complete! Updating message with results');
            clearInterval(interval);
            
            // Update the processing message with results
            setMessages(prev => prev.map(msg => {
              if (msg.id === processingMessageId) {
                console.log('Updating message:', msg.id, 'with analysis result');
                return {
                  ...msg,
                  content: `📄 Analysis Complete for: ${fileName}`,
                  analysisResult: data,
                };
              }
              return msg;
            }));
            
            setIsProcessingPdf(false);
          } else {
            console.log('Waiting for complete analysis and visualization, continuing to poll');
            
            // Update progress message to show what we're waiting for
            const progressStatus: string[] = [];
            if (!hasCompleteAnalysis) {
              progressStatus.push('constitutional analysis');
            }
            if (!hasVisualization) {
              progressStatus.push('visualization');
            }
            
            setMessages(prev => prev.map(msg => {
              if (msg.id === processingMessageId) {
                return {
                  ...msg,
                  content: `📄 Analyzing document: ${fileName}\n\n` +
                          `File Details:\n` +
                          `• Size: ${(parseFloat(msg.content.match(/Size: ([\d.]+) MB/)?.[1] || '0') * 1024 * 1024 / (1024 * 1024)).toFixed(2)} MB\n` +
                          `• Type: PDF Document\n` +
                          `• Document ID: ${documentId}\n\n` +
                          `Processing... Please wait\n` +
                          `Waiting for: ${progressStatus.join(' and ')}\n` +
                          `Attempt ${attempts}/${maxAttempts}`,
                };
              }
              return msg;
            }));
            
            if (attempts >= maxAttempts) {
              console.log('Max attempts reached, stopping polling');
              clearInterval(interval);
              setMessages(prev => prev.map(msg => {
                if (msg.id === processingMessageId) {
                  return {
                    ...msg,
                    content: `❌ Cannot generate constitutional analysis report for: ${fileName}`,
                    error: 'Analysis data not available after maximum wait time'
                  };
                }
                return msg;
              }));
              setIsProcessingPdf(false);
            }
          }
        } else if (statusResponse.status === 404) {
          // Document not found or no analysis data
          const errorResult = await statusResponse.json();
          console.log('=== 404 ERROR RESPONSE DATA ===');
          console.log('Error result:', JSON.stringify(errorResult, null, 2));
          console.log('=== END 404 ERROR DATA ===');
          
          if (attempts >= maxAttempts) {
            console.log('Max attempts reached, analysis not found');
            clearInterval(interval);
            setMessages(prev => prev.map(msg => {
              if (msg.id === processingMessageId) {
                return {
                  ...msg,
                  content: `❌ Cannot generate constitutional analysis report for: ${fileName}`,
                  error: errorResult.message || 'No constitutional analysis data available'
                };
              }
              return msg;
            }));
            setIsProcessingPdf(false);
          }
        } else if (statusResponse.status === 202) {
          // Still processing
          const statusResult = await statusResponse.json();
          console.log('=== 202 PROCESSING RESPONSE DATA ===');
          console.log('Status result:', JSON.stringify(statusResult, null, 2));
          console.log('=== END 202 PROCESSING DATA ===');
          
          if (attempts >= maxAttempts) {
            console.log('Max attempts reached, analysis incomplete');
            clearInterval(interval);
            setMessages(prev => prev.map(msg => {
              if (msg.id === processingMessageId) {
                return {
                  ...msg,
                  content: `❌ Cannot generate constitutional analysis report for: ${fileName}`,
                  error: statusResult.message || 'Analysis could not be completed'
                };
              }
              return msg;
            }));
            setIsProcessingPdf(false);
          }
        } else {
          console.log('Status response not ok:', statusResponse.status);
          
          if (attempts >= maxAttempts) {
            console.log('Max attempts reached, failed to get status');
            clearInterval(interval);
            setProcessingError(`Failed to get analysis results for ${fileName} - Cannot generate the report`);
            setIsProcessingPdf(false);
          }
        }
      } catch (error) {
        console.error('Error polling for results:', error);
        
        if (attempts >= maxAttempts) {
          console.log('Max attempts reached due to error');
          clearInterval(interval);
          setProcessingError(`Failed to get analysis results for ${fileName} - Cannot generate the report`);
          setIsProcessingPdf(false);
        }
      }
    }, 5000); // Check every 5 seconds
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6 space-y-6">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-80 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          {/* Upload Area Skeleton */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white border-0 shadow-sm rounded-2xl">
              <CardContent className="p-10">
                <div className="text-center space-y-4">
                  <Skeleton className="h-12 w-12 mx-auto rounded-full" />
                  <Skeleton className="h-6 w-48 mx-auto" />
                  <Skeleton className="h-4 w-64 mx-auto" />
                  <div className="mt-8">
                    <Skeleton className="h-32 w-32 mx-auto rounded-2xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Content Skeleton */}
          <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-white border-0 shadow-sm rounded-2xl">
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Dynamic Content Area - Shows Upload OR Chat Messages */}
        {messages.length === 0 ? (
          // Show Upload Component when no messages - Centered
          <div className="flex items-center justify-center h-full p-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="max-w-md mx-auto"
            >
              <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Upload Legal Documents</h3>
                    <p className="text-gray-600 text-sm mb-2">Transform complex legal documents into simple insights</p>
                    <p className="text-amber-600 text-sm mb-4">Note: Only PDF files are supported</p>
                    
                    {/* Processing Status */}
                    {isProcessingPdf && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          <span className="text-sm text-blue-700">Processing PDF for analysis...</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Error Display */}
                    {processingError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{processingError}</p>
                      </div>
                    )}
                    
                    <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors rounded-lg">
                      <FileUpload onChange={handleFileUpload} />
                    </div>
                    {files.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2 text-sm text-gray-900">Uploaded Files:</h4>
                        <div className="space-y-2">
                          {files.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm border border-gray-200">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                  <span className="text-xs font-medium text-blue-800">
                                    {file.name.split('.').pop()?.toUpperCase()}
                                  </span>
                                </div>
                                <div className="text-left">
                                  <p className="font-medium text-xs text-gray-900">{file.name}</p>
                                  <p className="text-xs text-gray-600">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs text-green-600 font-medium">Ready</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          // Show Analysis Results - Clean Display
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => {
                // Only show results if we have BOTH complete analysis AND visualization
                const hasCompleteAnalysis = message.analysisResult && 
                                          message.analysisResult.constitutional_analysis &&
                                          message.analysisResult.constitutional_analysis.compliance_status &&
                                          message.analysisResult.constitutional_analysis.potential_issues &&
                                          message.analysisResult.constitutional_analysis.recommendations &&
                                          message.analysisResult.constitutional_analysis.potential_issues.length > 0 &&
                                          message.analysisResult.constitutional_analysis.recommendations.length > 0;
                
                const hasVisualization = message.analysisResult?.visualization_url && 
                                        typeof message.analysisResult.visualization_url === 'string' && 
                                        message.analysisResult.visualization_url.trim().length > 0 &&
                                        message.analysisResult.visualization_url.startsWith('http');
                
                const isFullyComplete = hasCompleteAnalysis && hasVisualization;
                
                if (isFullyComplete && message.analysisResult) {
                  const analysisResult = message.analysisResult; // Type assertion for cleaner code
                  
                  // Function to open visualization in new tab
                  const openVisualization = () => {
                    if (analysisResult.visualization_url) {
                      console.log('Opening visualization URL:', analysisResult.visualization_url);
                      window.open(analysisResult.visualization_url, '_blank');
                    } else {
                      console.error('No visualization URL available');
                    }
                  };

                  // Function to generate complete report
                  const downloadCompleteReport = () => {
                    const reportData = {
                      title: "Constitutional Analysis Report",
                      generatedOn: new Date().toLocaleString(),
                      analysisTimestamp: analysisResult.analysis_timestamp ? 
                        new Date(analysisResult.analysis_timestamp).toLocaleString() : null,
                      complianceStatus: analysisResult.constitutional_analysis?.compliance_status,
                      potentialIssues: analysisResult.constitutional_analysis?.potential_issues || [],
                      recommendations: analysisResult.constitutional_analysis?.recommendations || [],
                      webIntelligenceResults: analysisResult.web_intelligence_results || [],
                      webSearchStatus: analysisResult.web_search_status,
                      webSearchTimestamp: analysisResult.web_search_timestamp ? 
                        new Date(analysisResult.web_search_timestamp).toLocaleString() : null,
                      visualizationUrl: analysisResult.visualization_url
                    };

                    // Generate formatted text report
                    const reportText = `
CONSTITUTIONAL ANALYSIS REPORT
================================

Generated on: ${reportData.generatedOn}
Analysis completed: ${reportData.analysisTimestamp || 'N/A'}

COMPLIANCE STATUS
-----------------
${reportData.complianceStatus}

POTENTIAL CONSTITUTIONAL ISSUES
-------------------------------
${reportData.potentialIssues.map((issue, index) => 
  `${index + 1}. ${issue}`
).join('\n\n')}

RECOMMENDATIONS
---------------
${reportData.recommendations.map((rec, index) => 
  `${index + 1}. ${rec}`
).join('\n\n')}

WEB INTELLIGENCE RESULTS
------------------------
Search Status: ${reportData.webSearchStatus || 'N/A'}
Search Completed: ${reportData.webSearchTimestamp || 'N/A'}
Documents Found: ${reportData.webIntelligenceResults.length}

${reportData.webIntelligenceResults.map((result, index) => 
  `${index + 1}. ${result.title}
   Link: ${result.link}
   Summary: ${result.snippet}
`).join('\n')}

ADDITIONAL INFORMATION
----------------------
Visualization Report: ${reportData.visualizationUrl ? 'Available for download' : 'Not available'}

---
Report generated by LexBharat Constitutional Analysis Engine
                    `;

                    // Create and download the file
                    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `constitutional-analysis-complete-report-${Date.now()}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  };

                  return (
                    <div key={message.id} className="space-y-6">
                      {/* Document Analysis Header */}
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900">Constitutional Analysis Complete</h2>
                            <p className="text-sm text-gray-600 mt-1">
                              Analysis completed on {analysisResult.analysis_timestamp ? 
                                new Date(analysisResult.analysis_timestamp).toLocaleString() : 
                                new Date().toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            {analysisResult.visualization_url && (
                              <button
                                onClick={openVisualization}
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <span>View Visualization</span>
                              </button>
                            )}
                            <button
                              onClick={downloadCompleteReport}
                              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                              </svg>
                              <span>Download Complete Report</span>
                            </button>
                            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                              analysisResult.constitutional_analysis?.compliance_status?.includes('Issues') 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {analysisResult.constitutional_analysis?.compliance_status || 'Analysis Complete'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Visualization */}
                        {analysisResult.visualization_url && (
                          <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Analysis Visualization</h3>
                            <div className="mb-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                              <strong>Visualization URL:</strong> {analysisResult.visualization_url}
                            </div>
                            <img 
                              src={analysisResult.visualization_url} 
                              alt="Constitutional Analysis Report" 
                              className="w-full max-w-2xl h-auto rounded-xl shadow-sm border border-gray-200 mx-auto"
                              onLoad={() => console.log('Image loaded successfully from:', analysisResult.visualization_url)}
                              onError={() => console.error('Image failed to load from:', analysisResult.visualization_url)}
                            />
                          </div>
                        )}
                      </div>

                      {/* Potential Issues Section */}
                      {analysisResult.constitutional_analysis?.potential_issues && 
                       analysisResult.constitutional_analysis.potential_issues.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200">
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-red-800">
                              Potential Constitutional Issues ({analysisResult.constitutional_analysis.potential_issues.length})
                            </h3>
                          </div>
                          <div className="space-y-4">
                            {analysisResult.constitutional_analysis.potential_issues.map((issue, index) => (
                              <div key={index} className="p-4 bg-red-50 rounded-xl border border-red-200">
                                <div className="flex items-start space-x-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-red-200 text-red-800 rounded-full flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                  </span>
                                  <p className="text-sm text-red-800 leading-relaxed">{issue}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommendations Section */}
                      {analysisResult.constitutional_analysis?.recommendations && 
                       analysisResult.constitutional_analysis.recommendations.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200">
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285A31.372 31.372 0 0015.204 8.8.75.75 0 0114.668 8H5.332a.75.75 0 01-.536-.8 31.373 31.373 0 00-2.676-.775.75.75 0 01-.254-1.285A41.059 41.059 0 019.664 1.319zM5.847 9.658a.75.75 0 01.814.814 22.984 22.984 0 00.231 2.681.75.75 0 01-.814.814 32.266 32.266 0 00-2.681-.231.75.75 0 01-.814-.814 32.266 32.266 0 00.231-2.681.75.75 0 01.814-.814h.219zm8.306 0a.75.75 0 01.814.814 32.266 32.266 0 00.231 2.681.75.75 0 01-.814.814 22.984 22.984 0 00-2.681-.231.75.75 0 01-.814-.814 22.984 22.984 0 00.231-2.681.75.75 0 01.814-.814h.219z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-green-800">
                              Recommendations ({analysisResult.constitutional_analysis.recommendations.length})
                            </h3>
                          </div>
                          <div className="space-y-4">
                            {analysisResult.constitutional_analysis.recommendations.map((recommendation, index) => (
                              <div key={index} className="p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="flex items-start space-x-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-green-200 text-green-800 rounded-full flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                  </span>
                                  <p className="text-sm text-green-800 leading-relaxed">{recommendation}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Web Intelligence Results */}
                      {analysisResult.web_intelligence_results && analysisResult.web_intelligence_results.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-200">
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-blue-800">
                              Web Intelligence Results ({analysisResult.web_intelligence_results.length} documents found)
                            </h3>
                          </div>
                          <div className="space-y-3">
                            {analysisResult.web_intelligence_results.map((result, index) => (
                              <div key={index} className="p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors">
                                <h6 className="font-medium text-blue-800 text-sm mb-2">
                                  <a href={result.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {result.title}
                                  </a>
                                </h6>
                                <p className="text-xs text-blue-700 mb-2 leading-relaxed">{result.snippet}</p>
                                <p className="text-xs text-blue-600 truncate">{result.link}</p>
                              </div>
                            ))}
                          </div>
                          {analysisResult.web_search_timestamp && (
                            <div className="mt-4 text-xs text-blue-600 text-center">
                              Web search completed on {new Date(analysisResult.web_search_timestamp).toLocaleString()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })}
              
              {/* Show processing state if we have messages but no complete analysis yet */}
              {messages.length > 0 && !messages.some(msg => {
                const hasCompleteAnalysis = msg.analysisResult && 
                                          msg.analysisResult.constitutional_analysis &&
                                          msg.analysisResult.constitutional_analysis.compliance_status &&
                                          msg.analysisResult.constitutional_analysis.potential_issues &&
                                          msg.analysisResult.constitutional_analysis.recommendations &&
                                          msg.analysisResult.constitutional_analysis.potential_issues.length > 0 &&
                                          msg.analysisResult.constitutional_analysis.recommendations.length > 0;
                return hasCompleteAnalysis;
              }) && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-gray-700">Constitutional Analysis in Progress</span>
                  </div>
                  <p className="text-gray-600">Please wait while our agents analyze your document for constitutional compliance...</p>
                  <p className="text-sm text-gray-500 mt-2">This process may take several minutes to complete.</p>
                </div>
              )}
              
              {/* Loading State */}
              {(isProcessingPdf && messages.length === 0) && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-gray-700">Processing Document</span>
                  </div>
                  <p className="text-gray-600">Constitutional analysis in progress... This may take a few minutes.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}