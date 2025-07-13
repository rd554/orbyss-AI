import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchJobs(query: Record<string, string | number | boolean>) {
  const params = new URLSearchParams(
    Object.fromEntries(Object.entries(query).map(([k, v]) => [k, String(v)]))
  ).toString();
  const res = await fetch(`http://localhost:5000/api/jobs?${params}`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
}

export async function applyToJob(data: { jobId: string; userId: string; applicationData?: any }) {
  const res = await fetch('http://localhost:5000/api/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to apply to job');
  return res.json();
}

export async function bulkApply(data: { jobs: string[]; userId: string }) {
  const res = await fetch('http://localhost:5000/api/apply/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to bulk apply');
  return res.json();
}

export async function sendDM(data: { userId: string; recipientId: string; message: string }) {
  const res = await fetch('http://localhost:5000/api/dm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to send DM');
  return res.json();
}

export async function bulkSendDM(data: { userId: string; recipients: string[]; message: string }) {
  const res = await fetch('http://localhost:5000/api/dm/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to send bulk DMs');
  return res.json();
}

export async function uploadResume(data: FormData) {
  const res = await fetch('http://localhost:5000/api/resume/upload', {
    method: 'POST',
    body: data,
  });
  if (!res.ok) throw new Error('Failed to upload resume');
  return res.json();
}

export async function getResume(userId: string, resumeId: string) {
  const res = await fetch(`http://localhost:5000/api/resume?userId=${userId}&resumeId=${resumeId}`);
  if (!res.ok) throw new Error('Failed to get resume');
  return res.json();
}

export async function updateResume(data: { userId: string; resumeId: string; resumeData: any }) {
  const res = await fetch('http://localhost:5000/api/resume/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update resume');
  return res.json();
}

export async function tailorResume(data: { userId: string; resumeId: string; jobDescription: string }) {
  const res = await fetch('http://localhost:5000/api/resume/tailor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to tailor resume');
  return res.json();
}

export async function deleteResume(data: { userId: string; resumeId: string }) {
  const res = await fetch('http://localhost:5000/api/resume/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to delete resume');
  return res.json();
}

export async function getResumeList(userId: string) {
  const res = await fetch(`http://localhost:5000/api/resume/list?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to get resume list');
  return res.json();
}

export async function getUserProfile(userId: string) {
  const res = await fetch(`http://localhost:5000/api/memory/profile?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to get user profile');
  return res.json();
}

export async function updateUserProfile(data: { userId: string; profileData: any }) {
  const res = await fetch('http://localhost:5000/api/memory/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user profile');
  return res.json();
}

export async function getRecommendations(userId: string) {
  const res = await fetch(`http://localhost:5000/api/memory/recommendations?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to get recommendations');
  return res.json();
}

export async function getBehaviorAnalysis(userId: string) {
  const res = await fetch(`http://localhost:5000/api/memory/behavior?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to get behavior analysis');
  return res.json();
}

export async function learnFromAction(data: { userId: string; action: any }) {
  const res = await fetch('http://localhost:5000/api/memory/learn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to learn from action');
  return res.json();
}
