import React from 'react';
import { VscRepo } from 'react-icons/vsc';

interface Project {
  id: number;
  name: string;
  displayName?: string;
  description: string;
  html_url: string;
  language: string;
  skills?: string[];
  images?: string[];
  image_url?: string;
}

const ProjectCard = ({ project, onClick }: { project: Project, onClick: () => void }) => {
  const coverImage = project.images?.[0] || project.image_url;

  return (
    <div className="project-card" onClick={onClick}>
      <div className="repo-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <VscRepo size={16} color="var(--text-muted)" />
          <span className="repo-name" style={{ fontSize: '16px' }}>{project.displayName || project.name}</span>
        </div>
        <span style={{ fontSize: '12px', border: '1px solid var(--border-color)', padding: '0 8px', borderRadius: '12px', color: 'var(--text-muted)', lineHeight: '18px' }}>Public</span>
      </div>
      
      <p className="repo-desc" style={{ marginTop: '8px', fontSize: '14px' }}>{project.description}</p>
      
      {project.skills && project.skills.length > 0 && (
        <div className="tags-container" style={{ marginTop: '16px' }}>
            {project.skills.map(skill => (
                <span key={skill} className="tag">{skill}</span>
            ))}
        </div>
      )}

      {coverImage && (
        <div className="card-image-box">
          <img src={coverImage} alt={project.displayName || project.name} />
        </div>
      )}
      
      <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: project.language === 'Python' ? '#f1e05a' : '#58a6ff' }}></span>
            <span>{project.language || 'Data'}</span>
          </div>
          {project.images && project.images.length > 1 && (
            <span>• {project.images.length} images</span>
          )}
      </div>
    </div>
  );
};

export default ProjectCard;
