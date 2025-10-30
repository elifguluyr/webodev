// src/components/Footer.js

import React from 'react'; 

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Kampüs Film Kulübü | Hazırlayan:
          <strong>Elif Gül Uyar 2321032032</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;