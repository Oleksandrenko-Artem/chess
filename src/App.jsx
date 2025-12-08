import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createOldPosition, createPosition } from './helpers';
import Header from './components/Header/Header';
import Homepage from './pages/Homepage';
import ChessPage from './pages/ChessPage';
import ShatranjPage from './pages/ShatranjPage';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/Footer/Footer';

function App() {
  const [initialState, setInitialState] = useState(null);
  const handlePlayChess = () => {
    setInitialState(() => createPosition);
  };
  const handlePlayShatranj = () => {
    setInitialState(() => createOldPosition);
  };
  return (
    <>
      <BrowserRouter>
        <Header onPlayChess={handlePlayChess} onPlayShatranj={handlePlayShatranj} />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/play-chess' element={<ChessPage initialPosition={initialState || createPosition} />} />
          <Route path='/play-shatranj' element={<ShatranjPage initialPosition={initialState || createOldPosition} />} />

          <Route path='*' element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App
