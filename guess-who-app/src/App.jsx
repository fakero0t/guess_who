import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Particles from './components/Particles';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import GuessModal from './components/GuessModal';
import VictoryScreen from './components/VictoryScreen';
import { getPeople, getChoices } from './data/people';
import { audioEngine } from './audio/AudioEngine';
import './App.css';

const STORAGE_KEY = 'guess-who-state';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      guessedIds: new Set(parsed.guessedIds || []),
      gameStarted: parsed.gameStarted || false,
    };
  } catch {
    return null;
  }
}

function saveState(guessedIds, gameStarted) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      guessedIds: [...guessedIds],
      gameStarted,
    }));
  } catch { /* ignore quota errors */ }
}

function App() {
  const [people] = useState(() => getPeople());
  const [saved] = useState(() => loadState());
  const [restoredFromSave] = useState(() => !!saved?.gameStarted);
  const [gameStarted, setGameStarted] = useState(saved?.gameStarted || false);
  const [guessedIds, setGuessedIds] = useState(saved?.guessedIds || new Set());
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [choices, setChoices] = useState([]);
  const [soundOn, setSoundOn] = useState(true);
  const [showVictory, setShowVictory] = useState(() => {
    return saved?.guessedIds?.size === people.length && people.length > 0;
  });

  // Persist state on changes
  useEffect(() => {
    saveState(guessedIds, gameStarted);
  }, [guessedIds, gameStarted]);

  // Always scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStart = useCallback(() => {
    setGameStarted(true);
  }, []);

  const handleCardClick = useCallback((person) => {
    if (guessedIds.has(person.id)) return;
    setSelectedPerson(person);
    setChoices(getChoices(person, people));
  }, [guessedIds, people]);

  const handleCorrect = useCallback((person) => {
    const newGuessed = new Set(guessedIds);
    newGuessed.add(person.id);
    setGuessedIds(newGuessed);
    setSelectedPerson(null);

    if (newGuessed.size === people.length) {
      setTimeout(() => setShowVictory(true), 600);
    }
  }, [guessedIds, people.length]);

  const handleClose = useCallback(() => {
    setSelectedPerson(null);
  }, []);

  const handleToggleSound = useCallback(() => {
    const newState = audioEngine.toggle();
    setSoundOn(newState);
    if (newState && !audioEngine.musicPlaying) {
      audioEngine.startMusic();
    }
  }, []);

  const handleReset = useCallback(() => {
    setGuessedIds(new Set());
    setSelectedPerson(null);
    setShowVictory(false);
    audioEngine.playSelect();
  }, []);

  return (
    <div className="app">
      <Particles />
      <div className="bg-grid" />
      <div className="scanlines" />

      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <SplashScreen key="splash" onStart={handleStart} />
        ) : (
          <>
            <Header
              guessedCount={guessedIds.size}
              totalCount={people.length}
              onToggleSound={handleToggleSound}
              soundOn={soundOn}
              onReset={handleReset}
            />

            <main className="main">
              <GameBoard
                people={people}
                guessedIds={guessedIds}
                onCardClick={handleCardClick}
                skipEntryAnimation={restoredFromSave}
              />
            </main>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPerson && (
          <GuessModal
            key="modal"
            person={selectedPerson}
            choices={choices}
            onCorrect={handleCorrect}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVictory && (
          <VictoryScreen
            key="victory"
            onReset={handleReset}
            totalCount={people.length}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
