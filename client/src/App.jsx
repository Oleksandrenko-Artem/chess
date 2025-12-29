import React from 'react';
import { useReducer } from 'react';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import { reducer } from './reducers/reducer';
import { initialGameState, initialOldGameState } from './constants';
import actionTypes from './reducers/actionTypes';
import Header from './components/Header/Header';
import Homepage from './pages/Homepage';
import ChessPage from './pages/ChessPage';
import ShatranjPage from './pages/ShatranjPage';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/Footer/Footer';
import AppContext from './contexts/Context';
import RegisterForm from './components/forms/RegisterForm';
import LoginForm from './components/forms/LoginForm';

function App() {
  const savedVariant = typeof window !== 'undefined' ? window.localStorage.getItem('chess_variant') : null;
  const initialStateAtLoad = savedVariant === 'shatranj' ? initialOldGameState : initialGameState;
  const [appState, dispatch] = useReducer(reducer, initialStateAtLoad);
  const handlePlayChess = () => {
    if (typeof window !== 'undefined') window.localStorage.setItem('chess_variant', 'chess');
    dispatch({ type: actionTypes.RESET_GAME, payload: { initialState: initialGameState } });
  };
  const handlePlayShatranj = () => {
    if (typeof window !== 'undefined') window.localStorage.setItem('chess_variant', 'shatranj');
    dispatch({ type: actionTypes.RESET_GAME, payload: { initialState: initialOldGameState } });
  };
  const providerState = {
    appState,
    dispatch,
  };
  return (
    <AppContext.Provider value={providerState}>
      <BrowserRouter>
        <Header onPlayChess={handlePlayChess} onPlayShatranj={handlePlayShatranj} />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/register' element={<RegisterForm />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/play-chess' element={<ChessPage />} />
          <Route path='/play-shatranj' element={<ShatranjPage />} />
          
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      <Footer />
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
