import { motion } from 'framer-motion';
import { audioEngine } from '../audio/AudioEngine';

export default function SplashScreen({ onStart }) {
  const handleStart = () => {
    audioEngine.init();
    audioEngine.startMusic();
    audioEngine.playSelect();
    onStart();
  };

  const titleLetters = "GUESS WHO?".split('');
  const colors = ['#FF6B6B', '#FF8E53', '#FECA57', '#48DBFB', '#4ECDC4', '#A855F7', '#FF6B6B', '#FECA57', '#48DBFB', '#FF6B6B'];

  return (
    <motion.div
      className="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="splash__bg-grid" />
      <div className="splash__vignette" />

      {/* Floating pixel decorations */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="splash__pixel"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${4 + Math.random() * 8}px`,
            height: `${4 + Math.random() * 8}px`,
            background: colors[i % colors.length],
            opacity: 0.15 + Math.random() * 0.15,
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="splash__content">
        {/* Retro TV frame */}
        <motion.div
          className="splash__frame"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="splash__screen">
            {/* Animated title */}
            <div className="splash__title-row">
              {titleLetters.map((letter, i) => (
                <motion.span
                  key={i}
                  className="splash__letter"
                  style={{ color: colors[i] }}
                  initial={{ y: -60, opacity: 0, rotateX: -90 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  transition={{
                    delay: 0.3 + i * 0.08,
                    type: 'spring',
                    stiffness: 300,
                    damping: 15,
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </div>

            {/* Subtitle */}
            <motion.p
              className="splash__subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Can you name everyone in the org?
            </motion.p>

            {/* Animated face grid preview */}
            <motion.div
              className="splash__preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="splash__mini-card"
                  style={{ background: colors[i % colors.length] }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [0.95, 1.05, 0.95],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut',
                  }}
                >
                  <span>?</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Start button */}
            <motion.button
              className="splash__start-btn"
              onClick={handleStart}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(78, 205, 196, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="splash__start-text">START GAME</span>
              <motion.span
                className="splash__start-arrow"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ▶
              </motion.span>
            </motion.button>

            <motion.p
              className="splash__hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ delay: 2.5, duration: 2, repeat: Infinity }}
            >
              PRESS START
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
