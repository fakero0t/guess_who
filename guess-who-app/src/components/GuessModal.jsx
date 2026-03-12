import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Avatar from './Avatar';
import { audioEngine } from '../audio/AudioEngine';

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modal = {
  hidden: { opacity: 0, scale: 0.6, y: 60 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 25 }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -40,
    transition: { duration: 0.25 }
  }
};

export default function GuessModal({ person, choices, onCorrect, onClose }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const handleGuess = (choice) => {
    if (selected) return;
    setSelected(choice.id);
    audioEngine.playSelect();

    if (choice.id === person.id) {
      setResult('correct');
      audioEngine.playCorrect();
      // Mini confetti burst
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#4ECDC4', '#FECA57', '#FF6B6B'],
        disableForReducedMotion: true,
      });
      setTimeout(() => {
        onCorrect(person);
      }, 1400);
    } else {
      setResult('wrong');
      audioEngine.playWrong();
      setTimeout(() => {
        setSelected(null);
        setResult(null);
      }, 900);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => {
          if (e.target === e.currentTarget && !selected) onClose();
        }}
      >
        <motion.div
          className="modal"
          variants={modal}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Decorative corner accents */}
          <div className="modal__corner modal__corner--tl" />
          <div className="modal__corner modal__corner--tr" />
          <div className="modal__corner modal__corner--bl" />
          <div className="modal__corner modal__corner--br" />

          {/* Top color bar */}
          <div className="modal__top-bar" />

          {/* Close button */}
          {!selected && (
            <motion.button
              className="modal__close"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          )}

          {/* Header */}
          <div className="modal__header">
            <motion.div
              className="modal__question-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}
            >
              ?
            </motion.div>

            <motion.h2
              className="modal__title"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              WHO IS THIS?
            </motion.h2>

            <div className="modal__avatar-stage">
              <motion.div
                className="modal__avatar-ring"
                style={{ borderColor: person.color }}
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              >
                <Avatar person={person} size={130} />
              </motion.div>
              <div className="modal__avatar-glow" style={{ background: person.color }} />

              {/* Decorative floating pixels around avatar */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="modal__float-pixel"
                  style={{
                    background: person.color,
                    left: `${20 + Math.cos(i * Math.PI / 3) * 45}%`,
                    top: `${20 + Math.sin(i * Math.PI / 3) * 45}%`,
                  }}
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.3, 0.7, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Result feedback */}
          <AnimatePresence mode="wait">
            {result === 'correct' && (
              <motion.div
                className="modal__result modal__result--correct"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                <span className="modal__result-emoji">🎉</span>
                <span>CORRECT!</span>
              </motion.div>
            )}
            {result === 'wrong' && (
              <motion.div
                className="modal__result modal__result--wrong"
                initial={{ x: 0 }}
                animate={{ x: [0, -12, 12, -12, 12, 0] }}
                transition={{ duration: 0.4 }}
              >
                <span className="modal__result-emoji">❌</span>
                <span>NOPE! TRY AGAIN</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Choices */}
          <div className="modal__choices">
            {choices.map((choice, i) => {
              const isSelected = selected === choice.id;
              const showResult = selected !== null;

              let choiceClass = 'modal__choice';
              if (showResult && isSelected && result === 'correct') {
                choiceClass += ' modal__choice--correct';
              } else if (showResult && isSelected && result === 'wrong') {
                choiceClass += ' modal__choice--wrong';
              }

              return (
                <motion.button
                  key={choice.id}
                  className={choiceClass}
                  onClick={() => handleGuess(choice)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, type: 'spring', stiffness: 300, damping: 25 }}
                  whileHover={!selected ? {
                    scale: 1.02,
                    x: 8,
                    transition: { type: 'spring', stiffness: 400 }
                  } : {}}
                  whileTap={!selected ? { scale: 0.97 } : {}}
                  disabled={!!selected}
                >
                  <span className="modal__choice-key">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="modal__choice-name">{choice.name}</span>
                  {showResult && isSelected && (
                    <motion.span
                      className={`modal__choice-icon ${result === 'correct' ? 'modal__choice-icon--correct' : 'modal__choice-icon--wrong'}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      {result === 'correct' ? '✓' : '✗'}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Bottom hint */}
          <motion.p
            className="modal__hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1 }}
          >
            Select the correct name
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
