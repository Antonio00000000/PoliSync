import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Intro from './components/Intro';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/eventi" element={<div style={{padding: '20px'}}><h1>Sezione Eventi</h1></div>} />
          <Route path="/studio" element={<div style={{padding: '20px'}}><h1>Sezione Studio</h1></div>} />
          <Route path="/oggettiSmarriti" element={<div style={{padding: '20px'}}><h1>Oggetti Smarriti</h1></div>} />
          <Route path="/prodotti" element={<div style={{padding: '20px'}}><h1>Prodotti</h1></div>} />
          <Route path="/carrello" element={<div style={{padding: '20px'}}><h1>Carrello</h1></div>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
