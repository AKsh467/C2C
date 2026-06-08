import React, { useState, useRef, useEffect } from 'react';
import { Home, Folder, MessageSquare, Settings, LogOut, ChevronRight, Trash2 } from 'lucide-react';

const Sidebar = ({ view, setView, onLogout, roadmaps = [], userProfile, theme, setTheme, handleOpenRoadmap, activeRoadmapId, handleDeleteRoadmap }) => {
    const [showProjectPicker, setShowProjectPicker] = useState(false);
    const pickerRef = useRef(null);

    // Close picker when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setShowProjectPicker(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Real counts
    const projectCount = roadmaps.length;
    const pendingTasks = roadmaps.reduce((acc, r) =>
        acc + r.milestones.reduce((a, m) => a + m.tasks.filter(t => !t.completed).length, 0), 0);

    // User info from prop
    const userName = userProfile?.name || 'Builder';
    const userRole = userProfile?.role === 'admin' ? 'Team Lead' : 'Member';
    const initials = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const handleProjectsClick = () => {
        if (roadmaps.length === 0) {
            setView('ideation');
        } else {
            setShowProjectPicker(prev => !prev);
        }
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'var(--accent-purple)' },
        { id: 'roadmap', label: 'My Projects', icon: Folder, color: 'var(--warning-color)', count: projectCount, onClick: handleProjectsClick },
        { id: 'team_chat', label: 'Team Chat', icon: MessageSquare, color: 'var(--accent-indigo)' },
        { id: 'settings', label: 'Settings', icon: Settings, color: 'var(--text-secondary)' },
    ];

    return (
        <aside className="sticky-sidebar flex-col" style={{
            width: '240px',
            height: '100vh',
            background: 'var(--bg-secondary)',
            borderRight: '1px solid var(--panel-border)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            transition: 'background-color var(--transition-normal)'
        }}>
            {/* Logo Section */}
            <div className="flex items-center gap-3" style={{ padding: '2rem 1.5rem', marginBottom: '1rem' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--accent-gradient)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}>C</div>
                <span style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    letterSpacing: '-0.5px',
                    fontFamily: 'var(--font-heading)'
                }}>C2C</span>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1" style={{ padding: '0 0.75rem' }}>
                <div style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    padding: '0 0.75rem',
                    marginBottom: '0.75rem'
                }}>Menu</div>

                <div className="flex-col gap-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = view === item.id;
                        const isProjects = item.id === 'roadmap';
                        return (
                            <div key={item.id} style={{ position: 'relative' }} ref={isProjects ? pickerRef : null}>
                                <button
                                    onClick={item.onClick || (() => setView(item.id))}
                                    className="flex items-center justify-between transition-all"
                                    style={{
                                        padding: '0.65rem 0.75rem',
                                        borderRadius: '8px',
                                        background: isActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        border: 'none',
                                        width: '100%',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontWeight: isActive ? 600 : 500,
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={18} color={isActive ? 'var(--accent-indigo)' : 'currentColor'} />
                                        {item.label}
                                    </div>
                                    {item.count > 0 && (
                                        <span className="notif-pill">{item.count}</span>
                                    )}
                                </button>

                                {/* Project Picker Dropdown */}
                                {isProjects && showProjectPicker && roadmaps.length > 0 && (
                                    <div className="scale-in" style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: '0.75rem',
                                        right: '0.75rem',
                                        background: 'var(--card-bg)',
                                        border: '1px solid var(--panel-border)',
                                        borderRadius: '10px',
                                        boxShadow: 'var(--shadow-lg)',
                                        zIndex: 200,
                                        overflow: 'hidden',
                                        marginTop: '4px'
                                    }}>
                                        <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--panel-border)' }}>
                                            Switch Project
                                        </div>
                                        {roadmaps.map(r => {
                                            const isSelected = r.id === activeRoadmapId;
                                            const progress = r.milestones?.length
                                                ? Math.round(r.milestones.reduce((acc, m) => acc + (m.progress || 0), 0) / r.milestones.length)
                                                : 0;
                                            return (
                                                <button
                                                    key={r.id}
                                                    onClick={() => {
                                                        handleOpenRoadmap(r.id);
                                                        setShowProjectPicker(false);
                                                    }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        width: '100%',
                                                        padding: '0.65rem 0.75rem',
                                                        background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        textAlign: 'left',
                                                        gap: '0.5rem',
                                                        borderBottom: '1px solid var(--panel-border)'
                                                    }}
                                                >
                                                    <div style={{ overflow: 'hidden', flex: 1 }}>
                                                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: isSelected ? 'var(--accent-indigo)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                                                            {r.ideaName}
                                                        </div>
                                                        <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                                            {progress}% complete
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {isSelected && <ChevronRight size={14} color="var(--accent-indigo)" />}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShowProjectPicker(false);
                                                                handleDeleteRoadmap(r.id);
                                                            }}
                                                            title="Delete project"
                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', borderRadius: '4px', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}
                                                            onMouseEnter={e => e.currentTarget.style.color = 'var(--danger-color)'}
                                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </nav>

            {/* User Profile Section */}
            <div style={{ padding: '1.25rem', borderTop: '1px solid var(--panel-border)' }}>
                <div className="flex items-center gap-3" style={{ marginBottom: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: userProfile?.avatar ? 'transparent' : 'var(--accent-gradient)',
                            backgroundImage: userProfile?.avatar ? `url(${userProfile.avatar})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            border: userProfile?.avatar ? '1px solid var(--panel-border)' : 'none'
                        }}>
                            {!userProfile?.avatar && initials}
                        </div>
                        <span className="status-dot status-online" style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                            border: '2px solid var(--bg-secondary)',
                            width: '10px',
                            height: '10px'
                        }}></span>
                    </div>
                    <div className="flex-col" style={{ minWidth: 0 }}>
                        <span style={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>{userName}</span>
                        <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)'
                        }}>{userRole}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="btn-ghost"
                        onClick={onLogout}
                        style={{ padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Logout"
                    >
                        <LogOut size={16} />
                    </button>

                    <button className="btn-ghost" style={{ padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                        {theme === 'dark' ? '🌞' : '🌙'}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
