import React, { useEffect } from 'react';
import { useReducer } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { reducer } from './reducers/reducer';
import { initialGameState, initialOldGameState, initialSpecialGameState } from './constants';
import { findUserAccountThunk } from './store/usersSlice';
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
import CreatePositionPage from './pages/CreatePositionPage';
import ProfilePage from './pages/ProfilePage';
import { getStoredColor } from './utils/color';

function App() {
  const dispathUser = useDispatch();
  const savedVariant = typeof window !== 'undefined' ? localStorage.getItem('chess_variant') : null;
  const initialStateAtLoad = savedVariant === 'shatranj' ? initialOldGameState : savedVariant === 'special' ? initialSpecialGameState : initialGameState;
  const [appState, dispatch] = useReducer(reducer, initialStateAtLoad);
  const handlePlayChess = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chess_variant', 'chess');
    };
    dispatch({ type: actionTypes.RESET_GAME, payload: { initialState: initialGameState } });
  };
  const handlePlayShatranj = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chess_variant', 'shatranj');
    };
    dispatch({ type: actionTypes.RESET_GAME, payload: { initialState: initialOldGameState } });
  };
  const handlePlaySpecial = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chess_variant', 'special');
    };
    dispatch({ type: actionTypes.RESET_GAME, payload: { initialState: initialSpecialGameState } });
  }
  const providerState = {
    appState,
    dispatch,
  };
  useEffect(() => {
    dispathUser(findUserAccountThunk());
  }, [dispathUser]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const DEFAULT_LIGHT_COLOR = '#ffdabb';
      const DEFAULT_DARK_COLOR = '#7e5e2e';
      try {
        const light = getStoredColor('lightSquareColor', DEFAULT_LIGHT_COLOR);
        const dark = getStoredColor('darkSquareColor', DEFAULT_DARK_COLOR);
        document.documentElement.style.setProperty('--light-square-color', light);
        document.documentElement.style.setProperty('--dark-square-color', dark);
      } catch (e) {
        document.documentElement.style.setProperty('--light-square-color', DEFAULT_LIGHT_COLOR);
        document.documentElement.style.setProperty('--dark-square-color', DEFAULT_DARK_COLOR);
      }
    }
  }, []);
  return (
    <AppContext.Provider value={providerState}>
      <BrowserRouter>
        <Header onPlayChess={handlePlayChess} onPlayShatranj={handlePlayShatranj} onPlaySpecial={handlePlaySpecial} />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/register' element={<RegisterForm />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/account' element={<ProfilePage />} />
          <Route path='/play-chess' element={<ChessPage />} />
          <Route path='/play-shatranj' element={<ShatranjPage />} />
          <Route path='/create-position' element={<CreatePositionPage />} />
          
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      <Footer />
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
