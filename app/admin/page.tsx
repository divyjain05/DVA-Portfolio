'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { HiOutlineTrash, HiOutlinePencil, HiOutlineCloudUpload } from 'react-icons/hi';

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [publishedProjects, setPublishedProjects] = useState<any[]>([]);

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [skills, setSkills] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRepos(pin);
  };

  const fetchRepos = async (authPin: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/github/repos?pin=${authPin}`);
      if (res.ok) {
        const data = await res.json();
        setRepos(data);
        setIsAuthorized(true);
        fetchPublishedProjects();
      } else {
        alert('Invalid PIN');
      }
    } catch (err: any) {
      alert('Login failed');
    }
    setLoading(false);
  };

  const fetchPublishedProjects = async () => {
    const projRes = await fetch('/api/projects');
    const projData = await projRes.json();
    setPublishedProjects(projData);
  };

  const handleSelectRepo = (repo: any) => {
    const existing = publishedProjects.find(p => p.id === repo.id);
    setSelectedRepo(repo);
    setDisplayName(existing ? existing.displayName : repo.name);
    setCustomDesc(existing ? existing.description : (repo.description || ''));
    setSkills(existing ? (existing.skills || []).join(', ') : '');
    setImages(existing ? (existing.images || (existing.image_url ? [existing.image_url] : [])) : []);
  };

  const handleMultiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    const newImages = [...images];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pin', pin);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.secure_url) newImages.push(data.secure_url);
      } catch (err) { console.error('Upload failed'); }
    }
    setImages(newImages);
    setUploading(false);
  };

  const handlePublish = async () => {
    const project = {
      ...selectedRepo,
      displayName: displayName,
      description: customDesc,
      skills: skills.split(',').map(s => s.trim()).filter(s => s !== ''),
      images: images,
      image_url: images[0] || '',
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, project }),
      });
      if (res.ok) {
        alert('Saved successfully!');
        fetchPublishedProjects();
        setSelectedRepo(null);
      }
    } catch (err) { alert('Failed to save'); }
  };

  const handleRemove = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Remove from portfolio?')) return;
    try {
      const res = await fetch(`/api/projects?id=${id}&pin=${pin}`, { method: 'DELETE' });
      if (res.ok) fetchPublishedProjects();
    } catch (err) { alert('Removal failed'); }
  };

  if (!isAuthorized) {
    return (
      <div className="pin-screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: '12px', border: '1px solid var(--border-color)', width: '320px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              className="search-input" 
              placeholder="PIN" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              style={{ width: '100%', marginBottom: '16px', textAlign: 'center', fontSize: '20px' }}
            />
            <button type="submit" className="btn-gh primary" style={{ width: '100%' }}>
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="main-container" style={{ gridTemplateColumns: '320px 1fr' }}>
        {/* Repo List */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '16px', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '14px' }}>Your Repositories</h3>
          {repos.map((repo: any) => (
            <div 
              key={repo.id} 
              onClick={() => handleSelectRepo(repo)}
              style={{ 
                padding: '10px', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '8px', cursor: 'pointer',
                background: selectedRepo?.id === repo.id ? 'var(--btn-bg)' : 'transparent',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '13px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{repo.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{repo.private ? 'Private' : 'Public'}</div>
              </div>
              {publishedProjects.some(p => p.id === repo.id) && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <HiOutlinePencil size={12} color="var(--btn-primary-hover)" />
                  <button onClick={(e) => handleRemove(repo.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <HiOutlineTrash size={12} color="#f85149" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Edit Form */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '24px' }}>
          {selectedRepo ? (
            <div>
              <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Editing: {selectedRepo.name}</h2>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Display Name (Custom Name)</label>
                <input 
                  type="text" 
                  className="search-input" 
                  style={{ width: '100%', maxWidth: 'none' }}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Description</label>
                <textarea 
                  className="search-input" 
                  style={{ width: '100%', maxWidth: 'none', height: '100px', padding: '10px' }}
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Skills / Tools (comma separated)</label>
                <input 
                  type="text" 
                  className="search-input" 
                  style={{ width: '100%', maxWidth: 'none' }}
                  placeholder="Excel, Tableau, Python, SQL"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Gallery Images</label>
                <div style={{ border: '1px dashed var(--border-color)', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
                  <input type="file" multiple onChange={handleMultiImageUpload} style={{ display: 'none' }} id="file-up" />
                  <label htmlFor="file-up" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <HiOutlineCloudUpload size={32} color="var(--link-color)" />
                    <span style={{ marginTop: '8px' }}>Click to upload images</span>
                  </label>
                </div>
                {uploading && <div style={{ fontSize: '12px', marginTop: '8px', color: 'var(--link-color)' }}>Uploading...</div>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginTop: '16px' }}>
                  {images.map((img, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '1', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', cursor: 'pointer' }}
                      >
                        <HiOutlineTrash size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handlePublish} className="btn-gh primary">Save to Portfolio</button>
                <button onClick={() => setSelectedRepo(null)} className="btn-gh">Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Select a repository to publish or edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
