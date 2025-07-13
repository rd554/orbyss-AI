"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { uploadResume, tailorResume, getUserProfile, updateUserProfile, getRecommendations, getBehaviorAnalysis, learnFromAction } from '@/lib/utils';
import { useRef } from 'react';

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // New: handle file selection and upload
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
    <>
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
              <Button onClick={() => getProfileMutation.mutate('test-user')} disabled={getProfileMutation.isPending} className="w-full bg-accent text-white hover:bg-accent/80 transition">
                {getProfileMutation.isPending ? 'Loading...' : 'Get Profile'}
              </Button>
              <Button onClick={() => updateProfileMutation.mutate({ userId: 'test-user', profileData: { name: 'Test User', skills: ['React', 'Node'] } })} disabled={updateProfileMutation.isPending} className="w-full bg-accent text-white hover:bg-accent/80 transition">
                {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
              </Button>
              <Button onClick={() => getRecommendationsMutation.mutate('test-user')} disabled={getRecommendationsMutation.isPending} className="w-full bg-accent text-white hover:bg-accent/80 transition">
                {getRecommendationsMutation.isPending ? 'Loading...' : 'Get Recommendations'}
              </Button>
              <Button onClick={() => getBehaviorAnalysisMutation.mutate('test-user')} disabled={getBehaviorAnalysisMutation.isPending} className="w-full bg-accent text-white hover:bg-accent/80 transition">
                {getBehaviorAnalysisMutation.isPending ? 'Loading...' : 'Get Behavior Analysis'}
              </Button>
              <Button onClick={() => learnFromActionMutation.mutate({ userId: 'test-user', action: { type: 'test', detail: 'Clicked button' } })} disabled={learnFromActionMutation.isPending} className="w-full bg-accent text-white hover:bg-accent/80 transition">
                {learnFromActionMutation.isPending ? 'Learning...' : 'Learn From Action'}
              </Button>
            </div>
            {/* Resume Management */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <Button onClick={() => fileInputRef.current?.click()} disabled={uploadResumeMutation.isPending} className="w-full bg-accent text-white hover:bg-accent/80 transition">
                {uploadResumeMutation.isPending ? 'Uploading...' : 'Upload Resume'}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              <Button onClick={() => tailorResumeMutation.mutate({ userId: 'test-user', resumeId: 'resume-1', jobDescription: 'Software Engineer at TestCorp' })} disabled={tailorResumeMutation.isPending} className="w-full bg-accent text-white hover:bg-accent/80 transition">
                {tailorResumeMutation.isPending ? 'Tailoring...' : 'Tailor Resume'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <nav className="bg-surface/60 backdrop-blur-sm border-b border-border shadow-card flex justify-between items-center px-6 py-4">
        <div className="text-primary font-bold flex items-center gap-2">
          {/* Hamburger menu */}
          <button onClick={() => setSidebarOpen(true)} className="mr-4 text-white text-2xl focus:outline-none">
            <span className="sr-only">Open sidebar</span>
            &#9776;
          </button>
          <img src="/orbyss_logo.png" className="h-8 w-8 aspect-square object-cover rounded-full bg-accent/10" alt="Orbyss Logo" />
          Orbyss AI
        </div>
        <div className="flex gap-6 text-secondary text-sm">
          <span className="hover:text-accent transition cursor-pointer">History</span>
          <span className="hover:text-accent transition cursor-pointer">Settings</span>
        </div>
      </nav>
      {children}
    </>
  );
} 