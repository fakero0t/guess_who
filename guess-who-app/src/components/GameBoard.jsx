import { motion } from 'framer-motion';
import Card from './Card';

export default function GameBoard({ people, guessedIds, onCardClick, skipEntryAnimation }) {
  return (
    <div className="board">
      <div className="board__grid">
        {people.map((person, index) => (
          <Card
            key={person.id}
            person={person}
            isGuessed={guessedIds.has(person.id)}
            onClick={onCardClick}
            index={index}
            skipEntryAnimation={skipEntryAnimation}
          />
        ))}
      </div>
    </div>
  );
}
