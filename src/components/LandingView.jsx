import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle, Zap, Shield, Users, LayoutDashboard } from 'lucide-react';

const LandingView = ({ onLoginClick, onRegisterClick }) => {
  const [activeTab, setActiveTab] = useState('todo');

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
          <button onClick={onLoginClick} className="btn btn-ghost">Log In</button>
          <button onClick={onRegisterClick} className="btn btn-primary">Get Started</button>
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
            <button onClick={onRegisterClick} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Start Building for Free <ArrowRight size={20} />
            </button>
            <button onClick={scrollToFeatures} className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              See How It Works
            </button>
          </div>
        </div>

        {/* Dynamic Animated Kanban Board Mockup */}
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
            
            {/* Fake App Interface */}
            <div style={{ background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', padding: '2rem', minHeight: '400px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '2rem', overflow: 'hidden' }}>
              
              {/* Fake Sidebar */}
              <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: '1px solid var(--panel-border)', paddingRight: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  <LayoutDashboard size={18} /> <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Dashboard</span>
                </div>
                <div style={{ height: '30px', width: '100%', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '6px', borderLeft: '3px solid var(--accent-indigo)' }} />
                <div style={{ height: '30px', width: '80%', background: 'transparent', borderRadius: '6px' }} />
                <div style={{ height: '30px', width: '90%', background: 'transparent', borderRadius: '6px' }} />
              </div>

              {/* Fake Main Content - Kanban Board */}
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>MVP Phase 1: Authentication</h2>
                  <div style={{ width: '120px', height: '30px', background: 'var(--accent-gradient)', borderRadius: '6px', opacity: 0.8 }} />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', height: '100%' }}>
                  
                  {/* To Do Column */}
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                      TODO <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px' }}>2</span>
                    </div>
                    
                    {/* Animated Card that moves to "Done" */}
                    <div className="animated-card" style={{ background: 'var(--card-bg)', border: '1px solid var(--accent-purple)', borderRadius: '8px', padding: '1rem', boxShadow: 'var(--shadow-md)', position: 'relative', zIndex: 10 }}>
                      <div style={{ height: '12px', width: '30%', background: 'rgba(99, 102, 241, 0.5)', borderRadius: '4px', marginBottom: '0.5rem' }} />
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>Implement JWT Middleware</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-blue)' }} />
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Medium</div>
                      </div>
                    </div>

                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ height: '12px', width: '40%', background: 'rgba(245, 158, 11, 0.5)', borderRadius: '4px', marginBottom: '0.5rem' }} />
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>Create User Schema</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--success-color)' }} />
                      </div>
                    </div>

                  </div>
                  
                  {/* In Progress Column */}
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-blue)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                      IN PROGRESS <span style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '2px 8px', borderRadius: '10px' }}>1</span>
                    </div>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ height: '12px', width: '35%', background: 'rgba(239, 68, 68, 0.5)', borderRadius: '4px', marginBottom: '0.5rem' }} />
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>OAuth Google Integration</div>
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: '60%', height: '100%', background: 'var(--accent-blue)' }} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Done Column */}
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success-color)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                      DONE <span style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: '10px' }}>1</span>
                    </div>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '1rem', boxShadow: 'var(--shadow-sm)', opacity: 0.6 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, textDecoration: 'line-through', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Setup Express Server</div>
                    </div>
                    
                    {/* Placeholder where the animated card lands */}
                    <div className="animated-card-ghost" style={{ border: '2px dashed rgba(16, 185, 129, 0.3)', borderRadius: '8px', height: '110px' }} />

                  </div>
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
        <p>© 2026 Chaos2Clarity. Built by Indie Hackers.</p>
      </footer>

      <style>{`
        @keyframes moveCard {
          0% { transform: translate(0, 0) scale(1); box-shadow: var(--shadow-md); border-color: var(--accent-purple); }
          15% { transform: translate(10px, -10px) scale(1.05) rotate(2deg); box-shadow: var(--shadow-premium); border-color: var(--accent-purple); }
          40% { transform: translate(calc(200% + 2rem), -10px) scale(1.05) rotate(2deg); box-shadow: var(--shadow-premium); border-color: var(--accent-purple); }
          50% { transform: translate(calc(200% + 2rem), 125px) scale(1); box-shadow: var(--shadow-sm); border-color: var(--success-color); }
          80% { transform: translate(calc(200% + 2rem), 125px) scale(1); box-shadow: var(--shadow-sm); border-color: var(--success-color); }
          90% { transform: translate(calc(200% + 2rem), 125px) scale(0.95); opacity: 0; }
          95% { transform: translate(0, 0) scale(0.95); opacity: 0; }
          100% { transform: translate(0, 0) scale(1); opacity: 1; border-color: var(--accent-purple); }
        }
        .animated-card {
          animation: moveCard 6s ease-in-out infinite;
        }
        @keyframes pulseGhost {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
        .animated-card-ghost {
          animation: pulseGhost 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingView;
