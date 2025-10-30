import React from 'react';

const Header = () => {
  return (
    <header className="app-header">
      <div className="container">
        <h1>Kampüs Film Kulübü</h1>
        <nav>
          <ul>
            <li><a href="/">Ana Sayfa</a></li>
            <li><a href="/izleme-listesi">İzleme Listem</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;