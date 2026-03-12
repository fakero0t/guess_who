import { motion } from 'framer-motion';
import Avatar from './Avatar';
import { audioEngine } from '../audio/AudioEngine';

export default function Card({ person, isGuessed, onClick, index, skipEntryAnimation }) {
  const handleClick = () => {
    if (isGuessed) return;
    audioEngine.playFlip();
    onClick(person);
  };

  const handleHover = () => {
    if (!isGuessed) {
      audioEngine.playHover();
    }
  };

  const accentColor = person.color;

  return (
    <motion.div
      className={`card ${isGuessed ? 'card--guessed' : ''}`}
      initial={skipEntryAnimation ? false : { opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={skipEntryAnimation ? { duration: 0 } : {
        delay: index * 0.012,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      whileHover={!isGuessed ? {
        scale: 1.08,
        y: -6,
        transition: { type: 'spring', stiffness: 400, damping: 15 }
      } : {}}
      whileTap={!isGuessed ? { scale: 0.95 } : {}}
      onClick={handleClick}
      onHoverStart={handleHover}
      layout
    >
      <div className="card__outer">
        <div className="card__accent" style={{ background: isGuessed ? undefined : `linear-gradient(90deg, ${accentColor}, ${person.colorEnd || accentColor})` }} />

        <div className="card__inner">
          <div className="card__portrait">
            <Avatar person={person} size={80} />

            {isGuessed && (
              <motion.div
                className="card__done-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="card__done-badge"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.15 }}
                >
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="#10B981" stroke="#059669" strokeWidth="2" />
                    <motion.path
                      d="M11 20 L17 26 L29 13"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </div>

          <div className="card__nameplate">
            <span className="card__name-text">
              {isGuessed ? person.name.split(' ')[0] : '???'}
            </span>
          </div>
        </div>

        <div className="card__hinges">
          <span className="card__hinge" />
          <span className="card__hinge" />
        </div>
      </div>
    </motion.div>
  );
}
