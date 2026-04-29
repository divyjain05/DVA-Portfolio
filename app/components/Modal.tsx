import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { HiOutlineX } from 'react-icons/hi';

interface Project {
  id: number;
  name: string;
  displayName?: string;
  description: string;
  html_url: string;
  language: string;
  images?: string[];
  image_url?: string;
}

const Modal = ({ project, onClose }: { project: Project, onClose: () => void }) => {
  if (!project) return null;

  const images = project.images || (project.image_url ? [project.image_url] : []);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '90%', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', overflow: 'hidden', position: 'relative' }}>
        
        {/* Close button top-right */}
        <button 
            className="btn-gh" 
            onClick={onClose} 
            style={{ position: 'absolute', top: '16px', right: '16px', padding: '8px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', zIndex: 100, width: '36px', height: '36px' }}
        >
          <HiOutlineX size={20} />
        </button>
        
        <div className="modal-body" style={{ padding: 0 }}>
          {/* Gallery Section */}
          {images.length > 0 && (
            <div className="gallery-wrapper" style={{ padding: '0', background: '#000', display: 'flex', justifyContent: 'center' }}>
              <div className="gallery-container" style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', width: '100%' }}>
                {images.map((img, idx) => (
                  <div key={idx} style={{ flex: '0 0 100%', scrollSnapAlign: 'start', display: 'flex', justifyContent: 'center', background: '#000' }}>
                    <img src={img} alt={`${project.name} ${idx}`} style={{ maxHeight: '500px', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'white' }}>{project.displayName || project.name}</h2>
            </div>
            
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-main)', marginBottom: '32px' }}>
              {project.description}
            </p>
            
            <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
              <a href={project.html_url} target="_blank" className="btn-gh primary" style={{ textDecoration: 'none' }}>
                <FaGithub size={18} />
                <span>View Repository</span>
              </a>
              <button className="btn-gh" onClick={onClose} style={{ minWidth: '120px' }}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
