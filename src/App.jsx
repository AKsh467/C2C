import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Layout from './components/Layout';
import IdeationForm from './components/IdeationForm';
import RoadmapView from './components/RoadmapView';
import DashboardView from './components/DashboardView';
import LandingView from './components/LandingView';
import SettingsView from './components/SettingsView';
import TeamChat from './components/TeamChat';
import { generateRoadmap } from './utils/mockDataEngine';
import { generateAiRoadmap } from './utils/aiDataEngine';
import { useAuth, useUser, useClerk } from '@clerk/clerk-react';
import html2pdf from 'html2pdf.js';
import './App.css';

// Inline project switcher dropdown for the roadmap view header
function ProjectSwitcher({ roadmaps, activeRoadmap, onSelect }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--card-bg)', border: '1px solid var(--panel-border)',
          borderRadius: '10px', padding: '0.6rem 1rem', cursor: 'pointer',
          color: 'var(--text-primary)', fontSize: '1.3rem', fontWeight: 700,
          maxWidth: '480px'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {activeRoadmap.ideaName}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.5, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {open && (
        <div className="scale-in" style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: '260px',
          background: 'var(--card-bg)', border: '1px solid var(--panel-border)',
          borderRadius: '12px', boxShadow: 'var(--shadow-lg)', zIndex: 200, overflow: 'hidden'
        }}>
          <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--panel-border)' }}>
            Switch Project
          </div>
          {roadmaps.map(r => {
            const isActive = r.id === activeRoadmap.id;
            const progress = r.milestones?.length
              ? Math.round(r.milestones.reduce((a, m) => a + (m.progress || 0), 0) / r.milestones.length)
              : 0;
            return (
              <button key={r.id} onClick={() => { onSelect(r.id); setOpen(false); }} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '0.7rem 0.85rem', background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
                border: 'none', cursor: 'pointer', borderBottom: '1px solid var(--panel-border)',
                color: 'var(--text-primary)'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: isActive ? 'var(--accent-indigo)' : 'var(--text-primary)' }}>{r.ideaName}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{progress}% complete</div>
                </div>
                {isActive && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-indigo)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function App() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [roadmaps, setRoadmaps] = useState([]);

  const [activeRoadmapId, setActiveRoadmapId] = useState(null);
  const [view, setView] = useState('dashboard'); // dashboard, ideation, roadmap
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('c2c_theme') || 'dark';
  });
  const [isPdfExporting, setIsPdfExporting] = useState(false);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('c2c_theme', theme);
  }, [theme]);

  // Ambient Blur Glow tracking the mouse
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on mobile

    const glow = document.createElement('div');
    glow.className = 'ambient-glow';
    document.body.appendChild(glow);

    // Initial position off-screen
    glow.style.transform = 'translate(-2000px, -2000px)';

    let rafId;
    let targetX = -2000;
    let targetY = -2000;

    const moveGlow = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      // Use requestAnimationFrame for smooth, tear-free tracking
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // Center the glow (assumes width/height is handled by CSS)
        // We'll translate based on the element's actual dimensions
        const rect = glow.getBoundingClientRect();
        glow.style.transform = `translate(${targetX - rect.width/2}px, ${targetY - rect.height/2}px)`;
      });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = window.getComputedStyle(target).cursor.includes('pointer') || target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a';
      
      if (isClickable) {
        glow.classList.add('glow-active');
      } else {
        glow.classList.remove('glow-active');
      }
    };

    window.addEventListener('mousemove', moveGlow, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveGlow);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafId);
      if (glow.parentNode) glow.parentNode.removeChild(glow);
    };
  }, []);

  // Fetch roadmaps when signed in
  useEffect(() => {
    if (isSignedIn && isLoaded) {
      const loadData = async () => {
        const token = await getToken();
        if (!token) return;
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        fetch(`${backendUrl}/api/roadmaps`, { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.ok ? r.json() : null)
          .then(d => { if (d?.roadmaps) setRoadmaps(d.roadmaps); })
          .catch(err => console.error('Failed to load roadmaps:', err));
      };
      loadData();
    }
  }, [isSignedIn, isLoaded, getToken]);

  // Check for Shared Roadmap Links on Mount
  useEffect(() => {
    const handleSharedLink = async () => {
      const query = new URLSearchParams(window.location.search);
      const shareId = query.get('share');
      if (shareId && isAuthenticated) {
        try {
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
          const response = await fetch(`${backendUrl}/api/shared-roadmap/${shareId}`);
          if (response.ok) {
            const data = await response.json();
            const sharedRoadmap = data.roadmap;

            // Check if user is already a member, if not, join them!
            if (sharedRoadmap.teamMembers && !sharedRoadmap.teamMembers.includes(userProfile.name)) {
              try {
                const joinResponse = await fetch(`${backendUrl}/api/shared-roadmap/${shareId}/join`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: userProfile.name })
                });
                if (joinResponse.ok) {
                  const joinData = await joinResponse.json();
                  sharedRoadmap.teamMembers = joinData.teamMembers;
                }
              } catch (joinErr) {
                console.error("Failed to join roadmap:", joinErr);
              }
            }

            // Replace existing instance if already cached locally, else push to top
            setRoadmaps(prev => {
              const existingIndex = prev.findIndex(r => r.id === sharedRoadmap.id);
              if (existingIndex !== -1) {
                const newRoadmaps = [...prev];
                newRoadmaps[existingIndex] = sharedRoadmap;
                return newRoadmaps;
              }
              return [sharedRoadmap, ...prev];
            });

            setActiveRoadmapId(sharedRoadmap.id);
            setView('roadmap');

            // Notification
            setNotifications(prev => [{
              id: Date.now().toString() + '-join',
              type: 'system',
              title: 'Joined Shared Roadmap',
              message: `You successfully joined the ${sharedRoadmap.ideaName} project.`,
              time: 'Just now',
              read: false
            }, ...prev]);

          } else {
            setNotifications(prev => [{
              id: Date.now().toString() + '-join-err',
              type: 'error',
              title: 'Invalid Link',
              message: "The shared roadmap link is invalid or has expired.",
              time: 'Just now',
              read: false
            }, ...prev]);
          }
        } catch (error) {
          console.error("Failed to load shared roadmap:", error);
        } finally {
          // Clean the URL so it doesn't infinite loop on refresh
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    handleSharedLink();
  }, [isSignedIn]); // Rerun if they log in through the gated screen

  // Global Shell State
  const [searchQuery, setSearchQuery] = useState('');

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('c2c_profile');
    return saved ? JSON.parse(saved) : { name: 'Builder', bio: 'Building the next big thing.', theme: 'System Default', timezone: 'UTC' };
  });

  const [notificationsPrefs, setNotificationsPrefs] = useState(() => {
    const saved = localStorage.getItem('c2c_notif_prefs');
    return saved ? JSON.parse(saved) : { projectUpdates: true, taskAssignments: true, teamActivity: false };
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('c2c_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'welcome', type: 'system', title: 'Welcome to C2C', message: 'Your Execution platform is ready.', time: 'Just now', read: false }
    ];
  });

  const [dashboardNotes, setDashboardNotes] = useState(() => {
    const saved = localStorage.getItem('c2c_notes');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Filter out notes older than 24 hours (86400000 ms)
      const oneDayAgo = Date.now() - 86400000;
      return parsed.filter(note => note.timestamp > oneDayAgo);
    }
    return [];
  });

  // Sync Clerk user to local userProfile
  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      setUserProfile(prev => ({
        ...prev,
        name: user.fullName || user.primaryEmailAddress.emailAddress.split('@')[0],
        email: user.primaryEmailAddress.emailAddress,
        role: 'admin'
      }));
    }
  }, [user]);

  // Save to LocalStorage whenever these state pieces change

  // Roadmaps are now persisted to Supabase, not localStorage

  useEffect(() => {
    localStorage.setItem('c2c_notif_prefs', JSON.stringify(notificationsPrefs));
  }, [notificationsPrefs]);

  useEffect(() => {
    localStorage.setItem('c2c_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('c2c_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('c2c_notes', JSON.stringify(dashboardNotes));
  }, [dashboardNotes]);

  // Global Real-Time Synchronization Socket
  useEffect(() => {
    if (!isSignedIn || roadmaps.length === 0) return;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const socket = io(backendUrl);

    // Subscribe to all local roadmaps
    roadmaps.forEach(r => {
      socket.emit('join_roadmap', r.id);
    });

    socket.on('roadmap_updated', (updatedRoadmap) => {
      setRoadmaps(prev => {
        const existing = prev.find(r => r.id === updatedRoadmap.id);
        // Only trigger React state update if the data actually changed
        if (existing && JSON.stringify(existing) !== JSON.stringify(updatedRoadmap)) {
          return prev.map(r => r.id === updatedRoadmap.id ? updatedRoadmap : r);
        }
        return prev;
      });
    });

    return () => socket.disconnect();
  }, [isSignedIn, roadmaps.length]); // Re-bind socket when a new project is created or deleted

  // Find the exact active roadmap object (if any)
  const activeRoadmap = roadmaps.find(r => r.id === activeRoadmapId);

  const handleIdeaSubmit = async (formData) => {
    setIsGenerating(true);
    setGenerationError(null);

    const enrichedFormData = {
      ...formData,
      creatorName: userProfile.name
    };

    try {
      const token = await getToken();
      const generated = await generateAiRoadmap(enrichedFormData, token);

      // Persist to Supabase
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      await fetch(`${backendUrl}/api/roadmaps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ roadmap: generated })
      });

      setNotifications(prev => [{
        id: Date.now().toString() + '-ai-notif',
        type: 'success',
        title: 'AI Roadmap Generated',
        message: `Your custom AI plan for "${formData.idea}" has been saved to the cloud.`,
        time: 'Just now',
        read: false
      }, ...prev]);

      setRoadmaps(prev => [generated, ...prev]);
      setActiveRoadmapId(generated.id);
      setView('roadmap');

    } catch (error) {
      console.error("AI Generation Error:", error);
      const errorMsg = error.message.includes('Quota')
        ? "AI Quota Exceeded. Please wait a minute and try again."
        : `Could not generate plan: ${error.message}`;

      setGenerationError(errorMsg);
      setNotifications(prev => [{
        id: Date.now().toString() + '-error-notif',
        type: 'error',
        title: 'AI Generation Failed',
        message: errorMsg,
        time: 'Just now',
        read: false
      }, ...prev]);
      setView('ideation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateRoadmap = async (updatedRoadmap) => {
    setRoadmaps(prev => prev.map(r => r.id === updatedRoadmap.id ? updatedRoadmap : r));
    // Persist update to Supabase
    try {
      const token = await getToken();
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      await fetch(`${backendUrl}/api/roadmaps/${updatedRoadmap.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ roadmap: updatedRoadmap })
      });
    } catch (err) {
      console.error('Failed to persist roadmap update:', err);
    }
  };

  const handleOpenRoadmap = (id) => {
    setActiveRoadmapId(id);
    setView('roadmap');
  };

  const handleDeleteRoadmap = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setRoadmaps(prev => prev.filter(r => r.id !== id));
      if (activeRoadmapId === id) {
        setActiveRoadmapId(null);
        setView('dashboard');
      }
      // Delete from Supabase
      try {
        const token = await getToken();
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        await fetch(`${backendUrl}/api/roadmaps/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Failed to delete roadmap from DB:', err);
      }
      setNotifications(prev => [{
        id: Date.now().toString() + '-delete',
        type: 'system',
        title: 'Project Deleted',
        message: 'The project was removed from your account.',
        time: 'Just now',
        read: false
      }, ...prev]);
    }
  };

  const handleExportMarkdown = () => {
    if (!activeRoadmap) return;
    let md = `# ${activeRoadmap.ideaName}\n\n`;
    activeRoadmap.milestones.forEach((m, i) => {
      md += `## Phase ${i + 1}: ${m.title}\n\n`;
      m.tasks.forEach(t => {
        md += `### [${t.completed ? 'x' : ' '}] ${t.title}\n`;
        if (t.details) {
          md += `**What this means:** ${t.details.whatThisMeans}\n\n`;
          if (t.details.whatYouNeedToDo) {
            md += `**Steps:**\n`;
            t.details.whatYouNeedToDo.forEach(step => md += `- ${step}\n`);
            md += `\n`;
          }
          if (t.details.output) {
            md += `**Output:** ${t.details.output}\n\n`;
          }
        }
      });
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeRoadmap.ideaName.replace(/\\s+/g, '_')}_Roadmap.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    if (!activeRoadmap) return;
    
    setIsPdfExporting(true);
    // Wait a brief moment for React to render all expanded tasks
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const element = document.getElementById('roadmap-content-wrapper');
    if (!element) {
        setIsPdfExporting(false);
        return;
    }

    // Temporarily force printer-friendly styles (white bg, black text)
    element.classList.add('pdf-export-mode');

    const opt = {
      margin: 0.5,
      filename: `${activeRoadmap.ideaName.replace(/\s+/g, '_')}_Roadmap.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#FFFFFF' 
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } finally {
      // Remove styles after PDF is generated
      element.classList.remove('pdf-export-mode');
      setIsPdfExporting(false);
    }
  };

  const handleSyncCalendar = async () => {
    if (!activeRoadmap) return;
    try {
      const token = await getToken();
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      
      setNotifications(prev => [{
        id: Date.now().toString() + '-syncing',
        type: 'system',
        title: 'Syncing to Calendar...',
        message: 'Pushing tasks to your Google Calendar...',
        time: 'Just now',
        read: false
      }, ...prev]);

      const res = await fetch(`${backendUrl}/api/calendar/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ roadmap: activeRoadmap })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sync calendar');
      }

      setNotifications(prev => [{
        id: Date.now().toString() + '-sync-success',
        type: 'success',
        title: 'Calendar Synced!',
        message: data.message || 'Tasks successfully added to Google Calendar.',
        time: 'Just now',
        read: false
      }, ...prev]);

    } catch (err) {
      console.error('Calendar sync error:', err);
      setNotifications(prev => [{
        id: Date.now().toString() + '-sync-error',
        type: 'error',
        title: 'Calendar Sync Failed',
        message: err.message,
        time: 'Just now',
        read: false
      }, ...prev]);
    }
  };

  // Calculate totals across all roadmaps
  const totalIdeas = roadmaps.length;
  const activeCount = roadmaps.filter(r => r.milestones.some(m => m.progress < 100)).length;
  const completedTasks = roadmaps.reduce((total, r) => {
    return total + r.milestones.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0);
  }, 0);

  // Show nothing while Clerk loads
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="loading-dot" style={{ animationDelay: '0s' }} />
          <div className="loading-dot" style={{ animationDelay: '0.2s' }} />
          <div className="loading-dot" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <LandingView />;
  }

  return (
    <>
      <Layout
        view={view}
      setView={setView}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      userProfile={userProfile}
      notifications={notifications}
      setNotifications={setNotifications}
      notificationsPrefs={notificationsPrefs}
      setNotificationsPrefs={setNotificationsPrefs}
      onLogout={() => {
        localStorage.removeItem('c2c_roadmaps');
        localStorage.removeItem('c2c_notifications');
        localStorage.removeItem('c2c_notes');
        setRoadmaps([]);
        setActiveRoadmapId(null);
        setView('dashboard');
        signOut();
      }}
      activeRoadmap={activeRoadmap}
      activeRoadmapId={activeRoadmapId}
      roadmaps={roadmaps}
      theme={theme}
      setTheme={setTheme}
      handleOpenRoadmap={handleOpenRoadmap}
      handleDeleteRoadmap={handleDeleteRoadmap}
    >
      <div className="dashboard-content" style={{ paddingBottom: '4rem', animation: 'fadeIn 0.5s ease-out' }}>
        {view === 'dashboard' && (
          <DashboardView
            roadmaps={roadmaps}
            activeRoadmap={activeRoadmap}
            setView={setView}
            handleOpenRoadmap={handleOpenRoadmap}
            handleDeleteRoadmap={handleDeleteRoadmap}
            handleUpdateRoadmap={handleUpdateRoadmap}
            searchQuery={searchQuery}
            dashboardNotes={dashboardNotes}
            setDashboardNotes={setDashboardNotes}
            userProfile={userProfile}
          />
        )}

        {view === 'ideation' && (
          <div className="fade-in">
            <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>Start your journey</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>Define an objective to build an execution plan.</p>
            <IdeationForm onSubmit={handleIdeaSubmit} isGenerating={isGenerating} error={generationError} roadmaps={roadmaps} />
          </div>
        )}

        {view === 'roadmap' && activeRoadmap ? (
          <div className="fade-in">
            <div className="flex justify-between items-center" style={{ marginBottom: '2rem', maxWidth: '900px', margin: '0 auto 2rem' }}>
              {/* Project switcher */}
              {roadmaps.length > 1 ? (
                <div style={{ position: 'relative' }}>
                  <ProjectSwitcher
                    roadmaps={roadmaps}
                    activeRoadmap={activeRoadmap}
                    onSelect={handleOpenRoadmap}
                  />
                </div>
              ) : (
                <h1 style={{ fontSize: '2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{activeRoadmap.ideaName}</h1>
              )}
              <div className="flex items-center gap-2">
                {/* 
                <button
                  className="btn btn-secondary"
                  onClick={handleSyncCalendar}
                  style={{ color: 'var(--accent-indigo)', borderColor: 'rgba(99,102,241,0.3)' }}
                >
                  📅 Sync to Calendar
                </button>
                */}
                <div style={{ position: 'relative' }}>
                  <button className="btn btn-secondary" onClick={(e) => {
                    const el = e.currentTarget.nextElementSibling;
                    el.style.display = el.style.display === 'none' ? 'block' : 'none';
                  }}>
                    Export ▼
                  </button>
                  <div style={{
                    display: 'none', position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                    background: 'var(--card-bg)', border: '1px solid var(--panel-border)',
                    borderRadius: '8px', boxShadow: 'var(--shadow-lg)', zIndex: 100, minWidth: '150px'
                  }}>
                    <button className="btn btn-secondary" style={{ width: '100%', border: 'none', borderRadius: 0, justifyContent: 'flex-start', borderBottom: '1px solid var(--panel-border)' }} onClick={handleExportPDF}>
                      Export as PDF
                    </button>
                    <button className="btn btn-secondary" style={{ width: '100%', border: 'none', borderRadius: 0, justifyContent: 'flex-start' }} onClick={handleExportMarkdown}>
                      Export as Markdown
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleDeleteRoadmap(activeRoadmap.id)}
                  style={{ color: 'var(--danger-color)', borderColor: 'rgba(239,68,68,0.3)' }}
                >
                  🗑 Delete Project
                </button>
                <button className="btn btn-secondary" onClick={() => setView('ideation')}>+ New Idea</button>
              </div>
            </div>
            <div id="roadmap-content-wrapper">
              <RoadmapView roadmap={activeRoadmap} onUpdate={handleUpdateRoadmap} setNotifications={setNotifications} isPdfExporting={isPdfExporting} />
            </div>
          </div>
        ) : (view === 'roadmap' && !activeRoadmap && (
          <div className="fade-in">
            <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>Execution Roadmaps</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Select a project to view its roadmap.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '480px' }}>
              {roadmaps.length > 0 ? roadmaps.map(r => (
                <button key={r.id} className="btn btn-secondary" style={{ justifyContent: 'flex-start', textAlign: 'left' }} onClick={() => handleOpenRoadmap(r.id)}>
                  {r.ideaName}
                </button>
              )) : (
                <button className="btn btn-primary" onClick={() => setView('ideation')}>Create your first project</button>
              )}
            </div>
          </div>
        ))}

        {view === 'settings' && (
          <SettingsView
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            setNotifications={setNotifications}
            theme={theme}
            setTheme={setTheme}
            onLogout={() => {
              localStorage.removeItem('c2c_roadmaps');
              localStorage.removeItem('c2c_notifications');
              localStorage.removeItem('c2c_notes');
              localStorage.removeItem('c2c_notif_prefs');
              setRoadmaps([]);
              setActiveRoadmapId(null);
              setView('dashboard');
              signOut();
            }}
            notificationsPrefs={notificationsPrefs}
            setNotificationsPrefs={setNotificationsPrefs}
          />
        )}

        {view === 'team_chat' && (
          <TeamChat activeRoadmap={activeRoadmap} userProfile={userProfile} />
        )}
      </div>
    </Layout>
    </>
  );
}

export default App;
