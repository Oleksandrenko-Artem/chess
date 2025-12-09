import { useReducer } from 'react';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import { reducer } from './reducers/Reducer';
import { initialGameState, initialOldGameState } from './constants';
import Header from './components/Header/Header';
import Homepage from './pages/Homepage';
import ChessPage from './pages/ChessPage';
import ShatranjPage from './pages/ShatranjPage';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/Footer/Footer';
import AppContext from './contexts/Context';
import actionTypes from './reducers/actionTypes';

function App() {
  const [appState, dispatch] = useReducer(reducer);
  const handlePlayChess = () => {
    dispatch({ type: actionTypes.RESET_GAME, payload: { initialState: initialGameState } });
  };
  const handlePlayShatranj = () => {
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
