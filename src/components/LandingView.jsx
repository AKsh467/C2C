import React from 'react';
import { ArrowRight, CheckCircle, Zap, Shield, Users } from 'lucide-react';

const LandingView = ({ onGetStarted }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation Bar */}
      <nav style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', background: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            C2C
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Concept2Code</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onGetStarted} className="btn btn-ghost">Log in</button>
          <button onClick={onGetStarted} className="btn btn-primary">Get Started</button>
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
          
          <h1 style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1.5px' }}>
            Turn your startup idea into a <span className="gradient-text">technical roadmap.</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Stop guessing what to build next. Concept2Code instantly generates step-by-step execution plans, assigns tasks, and tracks progress with your team.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={onGetStarted} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Start Building for Free <ArrowRight size={20} />
            </button>
            <button onClick={onGetStarted} className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              View Live Demo
            </button>
          </div>
        </div>

        {/* Product Mockup/Visualization */}
        <div className="scale-in" style={{ marginTop: '5rem', width: '100%', maxWidth: '1000px', position: 'relative', zIndex: 1, animationDelay: '0.2s' }}>
          <div className="glass-effect" style={{ borderRadius: 'var(--radius-lg)', padding: '1rem', border: '1px solid var(--panel-border)', boxShadow: 'var(--shadow-premium)' }}>
            {/* Fake Browser Chrome */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
            </div>
            
            {/* Fake App Interface */}
            <div style={{ background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', padding: '2rem', minHeight: '400px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '2rem' }}>
              
              {/* Fake Sidebar */}
              <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ height: '20px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                <div style={{ height: '20px', width: '80%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                <div style={{ height: '20px', width: '90%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
              </div>

              {/* Fake Main Content */}
              <div style={{ flex: 1 }}>
                <div style={{ height: '32px', width: '40%', background: 'var(--accent-gradient)', borderRadius: '8px', marginBottom: '2rem', opacity: 0.8 }} />
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ height: '16px', width: '40%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '1rem' }} />
                    <div style={{ height: '60px', width: '100%', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', marginBottom: '0.5rem', border: '1px solid rgba(99, 102, 241, 0.2)' }} />
                    <div style={{ height: '60px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
                  </div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ height: '16px', width: '40%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '1rem' }} />
                    <div style={{ height: '60px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '0.5rem' }} />
                  </div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ height: '16px', width: '40%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '1rem' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Feature Grid */}
      <section style={{ padding: '6rem 2rem', background: 'var(--card-bg)', borderTop: '1px solid var(--panel-border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent-indigo)' }}>
              <Zap size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Instant AI Generation</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Describe your idea in plain English and let Gemini 2.0 Flash break it down into actionable milestones and tasks.</p>
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
        <p>© 2026 Concept2Code. Built by Indie Hackers.</p>
      </footer>
    </div>
  );
};

export default LandingView;
