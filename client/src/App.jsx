import { Routes, Route } from 'react-router-dom';

import { WebSocketProvider } from './context/WebSocketContext';
import InputForm from './components/InputForm';
import Leaderboard from './components/Leaderboard';

function App() {
  return (
    <WebSocketProvider>
      <Routes>
        <Route path="/input" element={<InputForm />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </WebSocketProvider>
  );
}

export default App;
