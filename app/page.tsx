'use client';

import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ProfileSidebar from './components/ProfileSidebar';
import ProjectCard from './components/ProjectCard';
import Modal from './components/Modal';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const PROJECTS_PER_PAGE = 5;

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setFilteredProjects(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = projects;

    if (activeFilter !== 'All') {
      filtered = filtered.filter((p: any) => 
        p.skills?.includes(activeFilter) || p.language === activeFilter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((p: any) => 
        (p.displayName || p.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [activeFilter, searchTerm, projects]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

  const allSkills = Array.from(new Set(projects.flatMap((p: any) => p.skills || [])));
  const filters = ['All', ...allSkills];

  return (
    <div>
      <Navbar />
      <main className="main-container">
        <ProfileSidebar />
        
        <div className="content">
          <nav className="nav-tabs">
            <div className="nav-tab">
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ marginRight: '8px' }}><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path></svg>
              Repositories <span style={{ marginLeft: '8px', background: 'rgba(110,118,129,0.4)', borderRadius: '10px', padding: '0 6px', fontSize: '12px' }}>{filteredProjects.length}</span>
            </div>
          </nav>

          <div className="filter-bar">
            <input 
                type="text" 
                className="search-input" 
                placeholder="Find a project..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {filters.map(filter => (
                    <button 
                        key={filter} 
                        className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
          ) : (
            <>
              <div className="projects-grid">
                {paginatedProjects.length > 0 ? (
                  paginatedProjects.map((project: any) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onClick={() => setSelectedProject(project)}
                    />
                  ))
                ) : (
                  <div style={{ gridColumn: '1 / -1', padding: '80px 40px', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '6px', color: 'var(--text-muted)' }}>
                    No projects match your current filters.
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="pagination-btn" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, idx) => (
                    <button 
                      key={idx + 1}
                      className={`pagination-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button 
                    className="pagination-btn" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {selectedProject && (
        <Modal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
