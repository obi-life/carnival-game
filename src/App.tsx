import React from 'react';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import { store, RootState } from './store';
import GameSetup from './components/GameSetup';
import GameCanvas from './components/GameCanvas';
import GameHUD from './components/GameHUD';
import ResultsModal from './components/ResultsModal';

const AppContent: React.FC = () => {
  const { gameStarted, isPlaying } = useSelector((state: RootState) => state.game);

  return (
    <div className="min-h-screen">
      {!gameStarted ? (
        <GameSetup />
      ) : (
        <>
          <GameCanvas />
          <GameHUD />
          <ResultsModal />
        </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;