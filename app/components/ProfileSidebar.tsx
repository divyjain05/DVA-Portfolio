import React from 'react';
import { HiOutlineLocationMarker, HiOutlineMail } from 'react-icons/hi';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import Image from 'next/image';

const ProfileSidebar = () => {
  return (
    <aside className="sidebar">
      <div className="avatar">
        <Image
          src="/pfp.png"
          alt="Avatar"
          width={260}
          height={260}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          priority
        />
      </div>

      <h1 className="fullname">Divy Kumar Jain</h1>
      <h2 className="username">@divyjain05</h2>

      <p className="bio">
        Pursuing Major in Computer Science and Artificial Intelligence, passionate about tech and implementation of AI. TRYNA MAKE TECH COOl!
      </p>

      <button className="btn-gh primary" style={{ marginBottom: '8px' }}>Follow</button>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <a href="www.linkedin.com/in/divy-jain-a6752b221" target="_blank" rel="noopener noreferrer" className="btn-gh" style={{ flex: 1 }}><FaLinkedin /></a>
        <a href="https://github.com/divyjain05" target="_blank" rel="noopener noreferrer" className="btn-gh" style={{ flex: 1 }}><FaGithub /></a>
      </div>

      <ul className="vcard-details">
        <li>
          <HiOutlineLocationMarker size={16} />
          <span>Delhi, India</span>
        </li>
        <li>
          <HiOutlineMail size={16} />
          <span>divyjain005@gmail.com</span>
        </li>
      </ul>

      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '12px', textTransform: 'uppercase' }}>Technical Stack</h3>
        <div className="tags-container">
          <span className="tag">Google Sheets</span>
          <span className="tag">Excel</span>
          <span className="tag">Tableau</span>
          <span className="tag">Python</span>
          <span className="tag">SQL</span>
          <span className="tag">Pandas</span>
          <span className="tag">Matplotlib</span>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
