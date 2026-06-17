import React from 'react';
import { ArrowRight, CheckCircle, Zap, Users, LayoutDashboard, MousePointer2, Loader2, Sparkles } from 'lucide-react';
import { SignIn, SignUp } from '@clerk/clerk-react';

const LandingView = () => {
  const [authMode, setAuthMode] = React.useState(null); // 'signin' | 'signup' | null

  if (authMode) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
        {/* Left Side: Branding / Marketing */}
        <div className="auth-sidebar" style={{ flex: 1, flexDirection: 'column', padding: '4rem', background: 'var(--card-bg)', borderRight: '1px solid var(--panel-border)', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative Glow */}
          <div style={{ position: 'absolute', top: '10%', left: '20%', width: '300px', height: '300px', background: 'var(--accent-purple)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15, zIndex: 0 }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 1, marginBottom: 'auto' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
              C2C
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Chaos2Clarity</span>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '3rem', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
              Build your <br/><span className="gradient-text">master plan.</span>
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '3rem' }}>
              Join thousands of founders and engineers turning their chaotic ideas into actionable, step-by-step technical roadmaps.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)' }}>
                  <Zap size={20} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Instant AI Generation</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Get a complete roadmap in seconds.</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success-color)' }}>
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Actionable Milestones</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Step-by-step tasks to guide your execution.</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Tech Stack Clarity</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Optimal tools recommended for your specific idea.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
          {/* Mobile Header */}
          <div className="mobile-header" style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <button onClick={() => setAuthMode(null)} className="btn btn-ghost" style={{ padding: '0.5rem' }}>← Back</button>
          </div>
          
          <div style={{ width: '100%', maxWidth: '400px' }}>
            {authMode === 'signin' ? (
              <SignIn routing="virtual" signUpUrl={() => setAuthMode('signup')} appearance={{ elements: { rootBox: { width: '100%' }, card: { width: '100%', boxShadow: 'none', border: 'none', background: 'transparent' } } }} />
            ) : (
              <SignUp routing="virtual" signInUrl={() => setAuthMode('signin')} appearance={{ elements: { rootBox: { width: '100%' }, card: { width: '100%', boxShadow: 'none', border: 'none', background: 'transparent' } } }} />
            )}
          </div>
        </div>
      </div>
    );
  }

  const scrollToFeatures = () => {
    document.getElementById('features-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation Bar */}
      <nav style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', background: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            C2C
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Chaos2Clarity</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-ghost" onClick={() => setAuthMode('signin')}>Log In</button>
          <button className="btn btn-primary" onClick={() => setAuthMode('signup')}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Decorative Background Glows */}
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: '300px', height: '300px', background: 'var(--accent-purple)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15, zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: '300px', height: '300px', background: 'var(--accent-blue)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15, zIndex: 0 }} />

        <div className="fade-in" style={{ maxWidth: '800px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-indigo)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem' }}>
            <Zap size={16} />
            <span>AI-Powered Execution Plans</span>
          </div>
          
          <h1 style={{ fontSize: '4.5rem', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1.5px' }}>
            From Chaos <br/>to <span className="gradient-text">Absolute Clarity.</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Stop guessing what to build next. Type in your startup idea and let AI generate a complete, step-by-step technical roadmap in seconds.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => setAuthMode('signup')} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Start Building for Free <ArrowRight size={20} />
            </button>
            <button onClick={scrollToFeatures} className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              See How It Works
            </button>
          </div>
        </div>

        {/* Dynamic Storytelling Mockup Container */}
        <div className="scale-in" style={{ marginTop: '5rem', width: '100%', maxWidth: '1000px', position: 'relative', zIndex: 1, animationDelay: '0.2s' }}>
          <div className="glass-effect" style={{ borderRadius: 'var(--radius-lg)', padding: '1rem', border: '1px solid var(--panel-border)', boxShadow: 'var(--shadow-premium)' }}>
            
            {/* Fake Browser Chrome */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 2rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                app.chaos2clarity.com
              </div>
              <div style={{ width: '40px' }} />
            </div>
            
            {/* Storytelling Frame (12s total duration) */}
            <div style={{ position: 'relative', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', minHeight: '450px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              
              {/* === PHASE 1: Ideation (0s - 3.5s) === */}
              <div className="story-phase-1" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
                  <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Start your journey</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Define an objective to build an execution plan.</p>
                  
                  <div style={{ textAlign: 'left', background: 'var(--card-bg)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1rem', fontWeight: 600 }}>Your startup idea</div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div className="typewriter-box" style={{ flex: 1, padding: '0.75rem 1rem', background: 'var(--bg-color)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: 'white', display: 'flex', alignItems: 'center' }}>
                        <span className="typewriter-text">A dating app for dogs...</span>
                        <span className="cursor-blink">|</span>
                      </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
                      <button className="btn btn-primary btn-generate-anim" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Sparkles size={18} /> Generate AI Roadmap
                      </button>
                      
                      {/* Ghost Cursor clicking generate */}
                      <div className="ghost-cursor-1" style={{ position: 'absolute', zIndex: 50, color: 'white', dropShadow: '0 4px 6px rgba(0,0,0,0.5)' }}>
                        <MousePointer2 fill="white" size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* === PHASE 2: Loading (3.5s - 5.5s) === */}
              <div className="story-phase-2" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <div className="spinner-glow" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px' }}>
                  <Loader2 className="spin-fast" size={40} color="var(--accent-indigo)" />
                  <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'var(--accent-purple)', filter: 'blur(20px)', opacity: 0.5, borderRadius: '50%' }} />
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 600 }} className="loading-text-cycle">
                  <span>Analyzing objective...</span>
                  <span>Designing database schema...</span>
                  <span>Creating actionable tasks...</span>
                </div>
              </div>

              {/* === PHASE 3: Kanban Execution (5.5s - 12s) === */}
              <div className="story-phase-3" style={{ position: 'absolute', inset: 0, display: 'flex', gap: '2rem', padding: '2rem' }}>
                
                {/* Fake Sidebar */}
                <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: '1px solid var(--panel-border)', paddingRight: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                    <LayoutDashboard size={18} /> <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Dashboard</span>
                  </div>
                  <div style={{ height: '30px', width: '100%', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '6px', borderLeft: '3px solid var(--accent-indigo)' }} />
                  <div style={{ height: '30px', width: '80%', background: 'transparent', borderRadius: '6px' }} />
                </div>

                {/* Main Kanban Content */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Dog Dating App MVP</h2>
                    <div style={{ width: '120px', height: '30px', background: 'var(--accent-gradient)', borderRadius: '6px', opacity: 0.8 }} />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', height: '100%' }}>
                    
                    {/* To Do Column */}
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>TODO</div>
                      
                      {/* Animated Card that moves to "Done" */}
                      <div className="animated-card" style={{ background: 'var(--card-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '1rem', boxShadow: 'var(--shadow-md)', position: 'relative', zIndex: 10 }}>
                        <div style={{ height: '12px', width: '60%', background: 'rgba(99, 102, 241, 0.5)', borderRadius: '4px', marginBottom: '0.5rem' }} />
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>Matchmaking Algorithm</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-purple)' }} />
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>High Priority</div>
                        </div>
                      </div>

                      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ height: '12px', width: '40%', background: 'rgba(245, 158, 11, 0.5)', borderRadius: '4px', marginBottom: '0.5rem' }} />
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>Profile Picture Uploads</div>
                      </div>
                    </div>
                    
                    {/* In Progress Column */}
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>IN PROGRESS</div>
                      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ height: '12px', width: '35%', background: 'rgba(239, 68, 68, 0.5)', borderRadius: '4px', marginBottom: '0.5rem' }} />
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>Setup Express + Supabase</div>
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: '60%', height: '100%', background: 'var(--accent-blue)' }} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Done Column */}
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success-color)', marginBottom: '0.5rem' }}>DONE</div>
                      
                      {/* Drop Zone Ghost */}
                      <div className="animated-dropzone" style={{ border: '2px dashed rgba(255, 255, 255, 0.1)', borderRadius: '8px', height: '110px' }} />
                    </div>

                  </div>
                </div>

                {/* Ghost Cursor Dragging */}
                <div className="ghost-cursor-2" style={{ position: 'absolute', zIndex: 50, color: 'white', dropShadow: '0 4px 6px rgba(0,0,0,0.5)' }}>
                  <MousePointer2 fill="white" size={24} />
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>

      {/* Feature Grid */}
      <section id="features-section" style={{ padding: '6rem 2rem', background: 'var(--card-bg)', borderTop: '1px solid var(--panel-border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent-indigo)' }}>
              <Zap size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Instant AI Generation</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Describe your idea in plain English and let AI break it down into actionable milestones and tasks.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--success-color)' }}>
              <Users size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Multiplayer Sync</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Share your roadmap with co-founders. Updates to tasks are synced in real-time across all active users instantly.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--warning-color)' }}>
              <CheckCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Track Everything</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Never lose track of progress. Visual progress bars, assignees, and persistent database storage for all your ideas.</p>
          </div>

        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--panel-border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <p>© 2026 Chaos2Clarity. Built by Indie Hackers.</p>
      </footer>

      <style>{`
        /* Global Story Timing: 12 seconds total loop */
        
        /* Phase 1: Ideation (0s - 3.5s) */
        @keyframes phase1 {
          0%, 25% { opacity: 1; visibility: visible; }
          28%, 100% { opacity: 0; visibility: hidden; }
        }
        .story-phase-1 { animation: phase1 12s infinite; }

        @keyframes typeText {
          0%, 5% { width: 0; }
          20%, 100% { width: 180px; }
        }
        .typewriter-text {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          width: 0;
          animation: typeText 12s infinite steps(20, end);
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .cursor-blink { animation: blink 1s infinite; margin-left: 2px; }

        @keyframes cursor1 {
          0%, 15% { transform: translate(150px, 100px); opacity: 0; }
          20% { transform: translate(150px, 100px); opacity: 1; }
          23% { transform: translate(0, 0) scale(0.9); opacity: 1; } /* Clicks */
          24%, 100% { transform: translate(0, 0) scale(1); opacity: 0; }
        }
        .ghost-cursor-1 {
          right: -20px; bottom: -20px;
          animation: cursor1 12s infinite;
        }
        
        @keyframes buttonClick {
          0%, 22% { transform: scale(1); filter: brightness(1); }
          23% { transform: scale(0.95); filter: brightness(0.8); }
          24%, 100% { transform: scale(1); filter: brightness(1.2); }
        }
        .btn-generate-anim { animation: buttonClick 12s infinite; }


        /* Phase 2: Loading (3.5s - 5.5s) */
        @keyframes phase2 {
          0%, 28% { opacity: 0; visibility: hidden; transform: scale(0.95); }
          30%, 45% { opacity: 1; visibility: visible; transform: scale(1); }
          47%, 100% { opacity: 0; visibility: hidden; transform: scale(1.05); }
        }
        .story-phase-2 { animation: phase2 12s infinite; }

        .spin-fast { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        @keyframes cycleText {
          0%, 30% { opacity: 0; content: "Analyzing objective..."; }
          32%, 37% { opacity: 1; content: "Analyzing objective..."; }
          38%, 42% { opacity: 1; content: "Designing database schema..."; }
          43%, 47% { opacity: 1; content: "Creating actionable tasks..."; }
          48%, 100% { opacity: 0; content: "Creating actionable tasks..."; }
        }
        .loading-text-cycle::before {
          content: "Analyzing objective...";
          animation: cycleText 12s infinite;
        }
        .loading-text-cycle span { display: none; } /* Hide spans, use pseudo element for easy changing */


        /* Phase 3: Kanban (5.5s - 12s) */
        @keyframes phase3 {
          0%, 46% { opacity: 0; visibility: hidden; transform: translateY(10px); }
          48%, 95% { opacity: 1; visibility: visible; transform: translateY(0); }
          98%, 100% { opacity: 0; visibility: hidden; transform: translateY(-10px); }
        }
        .story-phase-3 { animation: phase3 12s infinite; }

        @keyframes cursor2 {
          0%, 55% { transform: translate(300px, 300px); opacity: 0; }
          60% { transform: translate(290px, 120px); opacity: 1; } /* Hovers card */
          62% { transform: translate(290px, 120px) scale(0.85); opacity: 1; } /* Grabs */
          75% { transform: translate(750px, 120px) scale(0.85); opacity: 1; } /* Drags */
          77% { transform: translate(750px, 120px) scale(1); opacity: 1; } /* Drops */
          82%, 100% { transform: translate(750px, 300px); opacity: 0; } /* Flies away */
        }
        .ghost-cursor-2 {
          top: 0; left: 0;
          animation: cursor2 12s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes cardDrag {
          0%, 61% { transform: translate(0, 0) rotate(0deg); box-shadow: var(--shadow-md); border-color: var(--panel-border); z-index: 10; opacity: 1; }
          62% { transform: translate(0, 0) scale(1.05) rotate(2deg); box-shadow: var(--shadow-premium); border-color: var(--accent-purple); z-index: 100; opacity: 1; }
          75% { transform: translate(465px, 0) scale(1.05) rotate(2deg); box-shadow: var(--shadow-premium); border-color: var(--accent-purple); z-index: 100; opacity: 1; }
          77% { transform: translate(465px, 0) scale(1) rotate(0deg); box-shadow: var(--shadow-sm); border-color: var(--success-color); z-index: 10; opacity: 1; }
          95% { transform: translate(465px, 0) scale(1) rotate(0deg); opacity: 1; border-color: var(--success-color); }
          100% { opacity: 0; border-color: var(--panel-border); }
        }
        .animated-card {
          animation: cardDrag 12s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes dropzoneFlash {
          0%, 76% { border-color: rgba(255, 255, 255, 0.1); background: transparent; }
          77%, 85% { border-color: var(--success-color); background: rgba(16, 185, 129, 0.1); }
          86%, 100% { border-color: rgba(255, 255, 255, 0.1); background: transparent; }
        }
        .animated-dropzone {
          animation: dropzoneFlash 12s infinite;
        }

      `}</style>
    </div>
  );
};

export default LandingView;
