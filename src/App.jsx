import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChessBoard from './components/ChessBoard/ChessBoard';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ChessBoard />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
