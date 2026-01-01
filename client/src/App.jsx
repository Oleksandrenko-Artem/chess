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
