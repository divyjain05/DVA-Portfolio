import React from 'react';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

const Navbar = () => {
  return (
    <header>
      <div className="header-container">
        <Link href="/" className="logo-link" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
          <FaGithub size={32} />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
