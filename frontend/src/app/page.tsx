'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchJobs, applyToJob, sendDM, uploadResume, tailorResume, getUserProfile, updateUserProfile, getRecommendations, getBehaviorAnalysis, learnFromAction } from '@/lib/utils';

interface AgentMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  status?: 'pending' | 'success' | 'error';
  data?: any;
}

interface JobCard {
  id: string;
  title: string;
  company: string;
  location: string;
  platform: string;
  status: 'found' | 'applied' | 'skipped' | 'dm_sent';
  url?: string;
  description?: string;
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Job search query state (customize as needed)
  const [jobQuery, setJobQuery] = useState({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // React Query: fetch jobs
  const {
    data: jobsData,
    isLoading: jobsLoading,
    isError: jobsError,
    refetch: refetchJobs
  } = useQuery({
    queryKey: ['jobs', jobQuery],
    queryFn: () => fetchJobs(jobQuery),
    enabled: false // Only fetch on demand
  });

  // React Query mutation for applying to a job
  const applyMutation = useMutation({
    mutationFn: (data: { jobId: string; userId: string; applicationData?: any }) =>
      applyToJob(data),
    onSuccess: (data) => {
      alert('Application successful!');
    },
    onError: (error: any) => {
      alert('Failed to apply: ' + error.message);
    },
  });

  // React Query mutation for sending a DM
  const dmMutation = useMutation({
    mutationFn: (data: { userId: string; recipientId: string; message: string }) =>
      sendDM(data),
    onSuccess: (data) => {
      alert('DM sent successfully!');
    },
    onError: (error: any) => {
      alert('Failed to send DM: ' + error.message);
    },
  });

  // React Query mutation for uploading a resume
  const uploadResumeMutation = useMutation({
    mutationFn: (data: FormData) => uploadResume(data),
    onSuccess: () => alert('Resume uploaded!'),
    onError: (error: any) => alert('Failed to upload resume: ' + error.message),
  });

  // React Query mutation for tailoring a resume
  const tailorResumeMutation = useMutation({
    mutationFn: (data: { userId: string; resumeId: string; jobDescription: string }) => tailorResume(data),
    onSuccess: () => alert('Resume tailored!'),
    onError: (error: any) => alert('Failed to tailor resume: ' + error.message),
  });

  // React Query for memory/profile endpoints
  const getProfileMutation = useMutation({
    mutationFn: (userId: string) => getUserProfile(userId),
    onSuccess: (data) => alert('Profile: ' + JSON.stringify(data)),
    onError: (error: any) => alert('Failed to get profile: ' + error.message),
  });
  const updateProfileMutation = useMutation({
    mutationFn: (data: { userId: string; profileData: any }) => updateUserProfile(data),
    onSuccess: () => alert('Profile updated!'),
    onError: (error: any) => alert('Failed to update profile: ' + error.message),
  });
  const getRecommendationsMutation = useMutation({
    mutationFn: (userId: string) => getRecommendations(userId),
    onSuccess: (data) => alert('Recommendations: ' + JSON.stringify(data)),
    onError: (error: any) => alert('Failed to get recommendations: ' + error.message),
  });
  const getBehaviorAnalysisMutation = useMutation({
    mutationFn: (userId: string) => getBehaviorAnalysis(userId),
    onSuccess: (data) => alert('Behavior Analysis: ' + JSON.stringify(data)),
    onError: (error: any) => alert('Failed to get behavior analysis: ' + error.message),
  });
  const learnFromActionMutation = useMutation({
    mutationFn: (data: { userId: string; action: any }) => learnFromAction(data),
    onSuccess: () => alert('Learned from action!'),
    onError: (error: any) => alert('Failed to learn from action: ' + error.message),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: prompt,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsProcessing(true);
    setProgress(0);

    // Simulate agent processing
    const agentMessage: AgentMessage = {
      id: (Date.now() + 1).toString(),
      type: 'agent',
      content: 'Processing your request...',
      timestamp: new Date(),
      status: 'pending'
    };

    setMessages(prev => [...prev, agentMessage]);

    // Simulate API call
    try {
      // This would be replaced with actual API calls
      await simulateAgentProcessing(prompt);
      
      // Update agent message with success
      setMessages(prev => prev.map(msg => 
        msg.id === agentMessage.id 
          ? { ...msg, content: 'Request completed successfully!', status: 'success' }
          : msg
      ));

      // Fetch jobs from backend
      setJobQuery({ prompt });
      await refetchJobs();
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === agentMessage.id 
          ? { ...msg, content: 'Error processing request', status: 'error' }
          : msg
      ));
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const simulateAgentProcessing = async (prompt: string) => {
    const steps = [
      'Analyzing command...',
      'Searching job platforms...',
      'Found 12 matching jobs',
      'Applying to 7 positions...',
      'Sending 3 DMs to recruiters...',
      'Completed successfully!'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(((i + 1) / steps.length) * 100);
      
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.type === 'agent') {
          return prev.map(msg => 
            msg.id === lastMessage.id 
              ? { ...msg, content: steps[i] }
              : msg
          );
        }
        return prev;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('userId', 'test-user');
      uploadResumeMutation.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary px-6 py-8">
      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-40 transition-all ${sidebarOpen ? 'visible' : 'invisible'}`}
        onClick={() => setSidebarOpen(false)}
        style={{ background: sidebarOpen ? 'rgba(0,0,0,0.4)' : 'transparent' }}
      >
        <div
          className={`fixed top-0 left-0 h-full w-80 bg-slate-900 shadow-lg z-50 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
            <span className="text-lg font-bold text-white">Menu</span>
            <button onClick={() => setSidebarOpen(false)} className="text-white text-2xl">×</button>
          </div>
          <div className="p-4 space-y-6">
            {/* Memory/Profile */}
            <div className="space-y-2">
              <Button onClick={() => getProfileMutation.mutate('test-user')} disabled={getProfileMutation.isPending} className="w-full">
                {getProfileMutation.isPending ? 'Loading...' : 'Get Profile'}
              </Button>
              <Button onClick={() => updateProfileMutation.mutate({ userId: 'test-user', profileData: { name: 'Test User', skills: ['React', 'Node'] } })} disabled={updateProfileMutation.isPending} className="w-full">
                {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
              </Button>
              <Button onClick={() => getRecommendationsMutation.mutate('test-user')} disabled={getRecommendationsMutation.isPending} className="w-full">
                {getRecommendationsMutation.isPending ? 'Loading...' : 'Get Recommendations'}
              </Button>
              <Button onClick={() => getBehaviorAnalysisMutation.mutate('test-user')} disabled={getBehaviorAnalysisMutation.isPending} className="w-full">
                {getBehaviorAnalysisMutation.isPending ? 'Loading...' : 'Get Behavior Analysis'}
              </Button>
              <Button onClick={() => learnFromActionMutation.mutate({ userId: 'test-user', action: { type: 'test', detail: 'Clicked button' } })} disabled={learnFromActionMutation.isPending} className="w-full">
                {learnFromActionMutation.isPending ? 'Learning...' : 'Learn From Action'}
              </Button>
            </div>
            {/* Resume Management */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <Button onClick={() => fileInputRef.current?.click()} disabled={uploadResumeMutation.isPending} className="w-full">
                {uploadResumeMutation.isPending ? 'Uploading...' : 'Upload Resume'}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              <Button onClick={() => tailorResumeMutation.mutate({ userId: 'test-user', resumeId: 'resume-1', jobDescription: 'Software Engineer at TestCorp' })} disabled={tailorResumeMutation.isPending} className="w-full">
                {tailorResumeMutation.isPending ? 'Tailoring...' : 'Tailor Resume'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Header is now in layout.tsx */}
      <div className="max-w-4xl mx-auto mb-8">
        {/* Search Bar with Blur + Accent Button */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 bg-surface/60 backdrop-blur-sm px-4 py-3 rounded-lg border border-border shadow-card"
        >
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Find remote PM jobs in FinTech and DM recruiters'"
            className="flex-1 bg-transparent text-primary placeholder-secondary outline-none border-none shadow-none"
            disabled={isProcessing}
          />
          <Button
            type="submit"
            disabled={isProcessing || !prompt.trim()}
            className="bg-accent hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            {isProcessing ? 'Processing...' : 'Send'}
          </Button>
        </form>
      </div>
      {/* Progress Bar */}
      {isProcessing && (
        <div className="max-w-4xl mx-auto mb-8">
          <Progress value={progress} className="h-2 bg-slate-800" />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Agent Thread */}
        <div className="lg:col-span-2">
          <Card className="bg-surface/60 backdrop-blur-sm border border-border rounded-lg shadow-card p-6 hover:shadow-md hover:border-accent transition duration-300">
            <CardHeader>
              <CardTitle className="text-primary font-semibold flex items-center gap-2">
                {/* Removed brain emoji icon */}
                Agent Output Thread
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-secondary mt-2">Start a conversation with Orbyss AI to begin your job search automation</div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex space-x-3 ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.type === 'agent' && (
                          <img
                            src="/orbyss_logo.png"
                            className="w-8 h-8 aspect-square object-cover rounded-full bg-accent/10"
                            alt="Orbyss Logo"
                          />
                        )}
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-slate-700 text-slate-200'
                              : 'bg-slate-700 text-slate-200'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          {message.status && (
                            <Badge
                              className={`mt-2 ${
                                message.status === 'success'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-slate-600 text-white'
                              }`}
                            >
                              {message.status}
                            </Badge>
                          )}
                        </div>
                        {message.type === 'user' && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-slate-600">👤</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
        {/* Job Cards */}
        <div>
          <Card className="bg-surface/60 backdrop-blur-sm border border-border rounded-lg shadow-card p-6 hover:shadow-md hover:border-accent transition duration-300">
            <CardHeader>
              <CardTitle className="text-primary font-semibold flex items-center gap-2">
                <div className="bg-accent/10 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-accent text-xl">📄</span>
                </div>
                Job Cards
                {jobsLoading ? (
                    <Badge variant="secondary" className="ml-auto">Loading...</Badge>
                  ) : jobsError ? (
                    <Badge variant="destructive" className="ml-auto">Error</Badge>
                  ) : jobsData?.data?.length > 0 ? (
                    <Badge variant="secondary" className="ml-auto">
                      {jobsData.data.length}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="ml-auto">
                      0
                    </Badge>
                  )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                  <div className="text-slate-400 text-center py-8">Loading jobs...</div>
                ) : jobsError ? (
                  <div className="text-red-400 text-center py-8">Error loading jobs</div>
                ) : (jobsData?.data?.length === 0 || !jobsData?.data) ? (
                  <div className="text-slate-400 text-center py-8">No jobs found yet</div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {jobsData.data.map((job: JobCard) => (
                      <div
                        key={job.id}
                        className="p-3 bg-slate-700/50 rounded-lg border border-slate-600"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-white text-sm">
                              {job.title}
                            </h4>
                            <p className="text-slate-400 text-xs">{job.company}</p>
                            <p className="text-slate-400 text-xs">{job.location}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                job.status === 'applied'
                                  ? 'default'
                                  : job.status === 'dm_sent'
                                  ? 'secondary'
                                  : 'outline'
                              }
                              className="text-xs"
                            >
                              {job.status === 'applied' && '✅ Applied'}
                              {job.status === 'found' && '🔍 Found'}
                              {job.status === 'skipped' && '❌ Skipped'}
                              {job.status === 'dm_sent' && '💬 DM Sent'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {job.platform}
                            </Badge>
                            <Button
                              size="sm"
                              className="ml-2"
                              disabled={applyMutation.isPending}
                              onClick={() => applyMutation.mutate({ jobId: job.id, userId: 'test-user' })}
                            >
                              {applyMutation.isPending ? 'Applying...' : 'Apply'}
                            </Button>
                            <Button
                              size="sm"
                              className="ml-2"
                              disabled={dmMutation.isPending}
                              onClick={() => dmMutation.mutate({ userId: 'test-user', recipientId: job.id, message: `Hi, I'm interested in the ${job.title} role at ${job.company}.` })}
                            >
                              {dmMutation.isPending ? 'Sending...' : 'Send DM'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
