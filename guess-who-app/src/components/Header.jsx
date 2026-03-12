import { motion } from 'framer-motion';
import { audioEngine } from '../audio/AudioEngine';

export default function Header({ guessedCount, totalCount, onToggleSound, soundOn, onReset }) {
  const progress = totalCount > 0 ? (guessedCount / totalCount) * 100 : 0;
  const percentage = Math.round(progress);

  return (
    <motion.header
      className="header"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className="header__inner">
        <motion.div
          className="header__logo"
          whileHover={{ scale: 1.03 }}
        >
          <h1 className="header__title">
            <span className="header__title-guess">GUESS</span>
            <span className="header__title-who">WHO</span>
            <span className="header__title-q">?</span>
          </h1>
        </motion.div>

        <div className="header__stats">
          <div className="header__progress-container">
            <div className="header__progress-bar">
              <motion.div
                className="header__progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              />
            </div>
            <div className="header__score-block">
              <span className="header__score-num">{guessedCount}</span>
              <span className="header__score-sep">/</span>
              <span className="header__score-den">{totalCount}</span>
              {percentage > 0 && (
                <span className="header__score-pct">{percentage}%</span>
              )}
            </div>
          </div>
        </div>

        <div className="header__controls">
          <motion.button
            className="header__btn"
            onClick={() => {
              audioEngine.playSelect();
              onToggleSound();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={soundOn ? 'Mute sounds' : 'Enable sounds'}
          >
            {soundOn ? '♪' : '♪̸'}
          </motion.button>
          <motion.button
            className="header__btn header__btn--reset"
            onClick={onReset}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Reset game"
          >
            ↺
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
