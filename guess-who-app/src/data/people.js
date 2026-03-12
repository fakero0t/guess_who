// Import all headshot images
const headshots = import.meta.glob('../assets/headshots/*.jpg', { eager: true });

// Rich gradient pairs for avatar fallbacks
const AVATAR_GRADIENTS = [
  ['#FF6B6B', '#EE5A24'], ['#4ECDC4', '#2C9E8F'], ['#45B7D1', '#2E86AB'],
  ['#96CEB4', '#6BAF92'], ['#FECA57', '#F39C12'], ['#DDA0DD', '#9B59B6'],
  ['#74B9FF', '#3498DB'], ['#A29BFE', '#6C5CE7'], ['#FD79A8', '#E84393'],
  ['#55E6C1', '#1ABC9C'], ['#FDA7DF', '#D63384'], ['#82CCDD', '#3DC1D3'],
  ['#F8C291', '#E17055'], ['#E77F67', '#D35D6E'], ['#786FA6', '#574B90'],
  ['#F3A683', '#F19066'], ['#63CDDA', '#3AAFA9'], ['#CF6A87', '#B83B5E'],
  ['#F5CD79', '#F7D794'], ['#546DE5', '#3D3D6B'],
];

// Women in the org (by filename prefix)
const WOMEN_FILES = new Set([
  'diane_alcorn',
  'kirsten_coronado',
  'kelsi_andrews',
  'mandee_topicz',
  'megha_shanthraj',
  'olivia_campbell',
  'raq_robinson',
  'shreelakshmi_gopinatharao',
  'shruti_jain',
  'xian_zheng',
  'priyanka_punukollu',
]);

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function fileNameToName(filename) {
  // "aaron_carney.jpg" -> "Aaron Carney"
  const base = filename.replace(/\.jpg$/, '');
  return base
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getGender(filename) {
  const base = filename.replace(/\.jpg$/, '');
  return WOMEN_FILES.has(base) ? 'F' : 'M';
}

function buildPeople() {
  const people = [];
  const entries = Object.entries(headshots);

  entries.forEach(([path, module], i) => {
    const filename = path.split('/').pop();
    const name = fileNameToName(filename);
    const gradient = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];

    people.push({
      id: i + 1,
      name,
      gender: getGender(filename),
      color: gradient[0],
      colorEnd: gradient[1],
      image: module.default,
    });
  });

  // Assign stable IDs based on name so localStorage state works
  people.forEach(p => {
    let hash = 0;
    for (let i = 0; i < p.name.length; i++) {
      hash = ((hash << 5) - hash) + p.name.charCodeAt(i);
      hash |= 0;
    }
    p.id = Math.abs(hash);
  });

  // Seeded shuffle — same seed = same order, new game = new order
  let seed = parseInt(localStorage.getItem('guess-who-seed'), 10);
  if (!seed) {
    seed = Math.floor(Math.random() * 2147483647);
    localStorage.setItem('guess-who-seed', seed);
  }
  const seeded = seededRandom(seed);
  for (let i = people.length - 1; i > 0; i--) {
    const j = Math.floor(seeded() * (i + 1));
    [people[i], people[j]] = [people[j], people[i]];
  }

  return people;
}

let _people = null;
export function getPeople() {
  if (!_people) {
    _people = buildPeople();
  }
  return _people;
}

// Get wrong answer choices for a given person (same gender only)
export function getChoices(person, allPeople, count = 5) {
  const sameGender = allPeople.filter(p => p.id !== person.id && p.gender === person.gender);
  const shuffled = [...sameGender].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const choices = [...wrongChoices, person].sort(() => Math.random() - 0.5);
  return choices;
}
