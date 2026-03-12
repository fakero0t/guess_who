export default function Avatar({ person, size = 80 }) {
  const initials = person.name.split(' ').map(n => n[0]).join('');

  if (person.image) {
    return (
      <div
        className="avatar"
        style={{
          width: size,
          height: size,
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={person.image}
          alt={person.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${person.color}, ${person.colorEnd || person.color + '88'})`,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.32,
        fontWeight: 'bold',
        color: '#fff',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        fontFamily: '"Press Start 2P", monospace',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
        borderRadius: '8px',
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{initials}</span>
    </div>
  );
}
