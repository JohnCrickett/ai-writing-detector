/**
 * Rare Word Usage Detection
 * Detects excessive use of rare/obscure words as an AI writing signal
 * AI models trained on academic and technical text tend to use words outside
 * the top 5000 most common English words at higher rates than humans.
 */

export interface RareWordMatch {
  rareWords: string[];
  count: number;
  frequency: number;
  isAIPotential: boolean;
  description: string;
  score: number;
}

/**
 * Top 5000 most common English words (core vocabulary)
 * This is a curated list of the most frequently used words in English
 * Words outside this set are considered "rare" for this analysis
 * This includes the most common 1000-2000 words based on frequency analysis
 */
const COMMON_WORDS = new Set([
  // Top 100 most common
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'need', 'better', 'work', 'been', 'working', 'years', 'challenge', 'problem', 'challenging',
  'many', 'trying', 'solve', 'think', 'plan', 'idea', 'thing', 'together', 'believe',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'also', 'use',
  'back', 'after', 'two', 'how', 'our', 'first', 'well', 'way', 'help', 'called',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'find', 'here', 'come', 'might', 'right', 'came', 'turn', 'tell', 'ask', 'try',
  'become', 'leave', 'put', 'mean', 'seem', 'sing', 'hear', 'show', 'sit', 'sat', 'walk',
  'went', 'run', 'jump', 'play', 'eat', 'drink', 'sleep', 'wake', 'watch', 'read', 'write',
  'talk', 'speak', 'listen', 'look', 'see', 'touch', 'smell', 'taste', 'laugh', 'cry',
  'smile', 'dance', 'drive', 'rode', 'ride', 'swim', 'flew', 'fly', 'climb', 'fall', 'move', 'stand',
  'live', 'die', 'learn', 'teach', 'buy', 'sell', 'give', 'take', 'send', 'receive',
  'open', 'close', 'start', 'stop', 'begin', 'end', 'continue', 'keep', 'hold', 'carry',
  'push', 'pull', 'throw', 'catch', 'kick', 'hit', 'cut', 'break', 'fix', 'build',
  'clean', 'wash', 'cook', 'prepare', 'serve', 'grow', 'plant', 'pick', 'gather',
  'cat', 'dog', 'bird', 'fish', 'animal', 'pet', 'car', 'bike', 'bus', 'train',
  'plane', 'boat', 'ship', 'tree', 'plant', 'flower', 'grass', 'park', 'city', 'town',
  'country', 'world', 'sky', 'cloud', 'sun', 'moon', 'star', 'ground', 'earth', 'sand',
  'rock', 'stone', 'wood', 'metal', 'glass', 'plastic', 'paper', 'cloth', 'leather',
  'room', 'house', 'building', 'door', 'window', 'wall', 'floor', 'roof', 'street', 'road',
  'path', 'garden', 'farm', 'kitchen', 'bedroom', 'bathroom', 'table', 'chair', 'bed', 'lamp',
  'fire', 'water', 'ice', 'snow', 'rain', 'wind', 'storm', 'weather', 'season', 'spring',
  'summer', 'fall', 'winter', 'morning', 'noon', 'afternoon', 'evening', 'night', 'hour',
  'minute', 'second', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'date', 'birthday',
  'family', 'mother', 'father', 'parent', 'brother', 'sister', 'son', 'daughter', 'uncle',
  'aunt', 'cousin', 'grandfather', 'grandmother', 'wife', 'husband', 'friend', 'enemy', 'person',
  'body', 'head', 'face', 'hair', 'eye', 'ear', 'nose', 'mouth', 'tooth', 'tongue', 'chin',
  'neck', 'shoulder', 'arm', 'hand', 'finger', 'leg', 'foot', 'toe', 'heart', 'blood',
  'lung', 'brain', 'skin', 'bone', 'muscle', 'health', 'sick', 'medicine', 'doctor', 'nurse',
  'hospital', 'food', 'fruit', 'vegetable', 'bread', 'meat', 'fish', 'cheese', 'milk', 'egg',
  'butter', 'oil', 'sugar', 'salt', 'pepper', 'spice', 'coffee', 'tea', 'juice', 'wine',
  'beer', 'water', 'soft', 'hard', 'smooth', 'rough', 'wet', 'dry', 'hot', 'cold', 'warm',
  'cool', 'dark', 'light', 'bright', 'dim', 'loud', 'quiet', 'silent', 'music', 'sound',
  'noise', 'voice', 'song', 'dance', 'art', 'painting', 'drawing', 'photo', 'picture', 'image',
  'movie', 'film', 'show', 'play', 'game', 'sport', 'exercise', 'sport', 'dance', 'game',
  'money', 'price', 'cost', 'pay', 'buy', 'sell', 'cheap', 'expensive', 'rich', 'poor',
  'book', 'story', 'poem', 'letter', 'message', 'sentence', 'word', 'language', 'english',
  'school', 'class', 'student', 'teacher', 'education', 'learning', 'teaching', 'studying',
  'homework', 'test', 'exam', 'grade', 'number', 'letter', 'color', 'shape', 'size',
  'big', 'small', 'long', 'short', 'tall', 'short', 'wide', 'narrow', 'thick', 'thin',
  'heavy', 'light', 'fast', 'slow', 'quick', 'slow', 'rapid', 'gentle', 'strong', 'weak',
  'smart', 'stupid', 'clever', 'dumb', 'wise', 'foolish', 'brave', 'coward', 'kind', 'mean',
  'good', 'bad', 'best', 'worst', 'better', 'worse', 'great', 'terrible', 'nice', 'ugly',
  'beautiful', 'handsome', 'pretty', 'young', 'old', 'new', 'used', 'fresh', 'stale',
  'real', 'fake', 'true', 'false', 'possible', 'impossible', 'likely', 'unlikely', 'certain',
  'maybe', 'probably', 'certainly', 'absolutely', 'usually', 'sometimes', 'never',
  'normal', 'regular', 'strange', 'odd', 'common', 'rare', 'unusual', 'typical', 'ordinary',
  'sentence', 'paragraph', 'vocabulary', 'grammar', 'spelling', 'punctuation',
  'always', 'often', 'rarely', 'hardly', 'almost', 'nearly', 'quite', 'rather', 'very', 'too',
  'enough', 'not', 'also', 'only', 'still', 'just', 'already', 'yet', 'still', 'even',
  'especially', 'particularly', 'generally', 'basically', 'actually', 'really', 'simply',
  'is', 'was', 'are', 'am', 'been', 'being', 'has', 'had', 'having', 'does',
  'did', 'doing', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'will',
  'shall', 'own', 'such', 'very', 'same', 'much', 'more', 'too', 'each', 'own',
  'through', 'during', 'before', 'under', 'between', 'without', 'above', 'below',
  'down', 'up', 'out', 'in', 'on', 'at', 'to', 'from', 'as', 'by',
  'than', 'where', 'when', 'why', 'how', 'what', 'which', 'who', 'whom', 'whose',
  'this', 'that', 'these', 'those', 'self', 'selves', 'itself', 'myself', 'yourself',
  'himself', 'herself', 'ourselves', 'yourselves', 'themselves', 'each', 'every',
  'either', 'neither', 'both', 'all', 'none', 'some', 'any', 'few', 'several',
  'many', 'much', 'more', 'most', 'less', 'least', 'other', 'another', 'such',
  'yes', 'no', 'okay', 'ok', 'oh', 'ah', 'hello', 'hi', 'bye', 'thanks',
  'please', 'sorry', 'excuse', 'pardon', 'welcome', 'good', 'bad', 'best', 'worst',
  'great', 'small', 'big', 'large', 'little', 'few', 'many', 'much', 'more', 'most',
  'better', 'worse', 'higher', 'lower', 'longer', 'shorter', 'stronger', 'weaker',
  'old', 'new', 'young', 'first', 'last', 'next', 'previous', 'current', 'past',
  'present', 'future', 'true', 'false', 'right', 'wrong', 'correct', 'incorrect',
  'real', 'fake', 'true', 'false', 'yes', 'no', 'sure', 'certain', 'possible',
  'probable', 'likely', 'unlikely', 'certain', 'uncertain', 'clear', 'unclear',
  'simple', 'complex', 'easy', 'difficult', 'hard', 'soft', 'strong', 'weak',
  'fast', 'slow', 'quick', 'rapid', 'high', 'low', 'deep', 'shallow', 'wide',
  'narrow', 'thick', 'thin', 'heavy', 'light', 'dark', 'bright', 'loud', 'quiet',
  'warm', 'cold', 'hot', 'cool', 'wet', 'dry', 'clean', 'dirty', 'smooth', 'rough',
  'beautiful', 'ugly', 'pretty', 'handsome', 'nice', 'mean', 'kind', 'cruel',
  'happy', 'sad', 'glad', 'mad', 'angry', 'calm', 'excited', 'tired', 'sleepy',
  'awake', 'busy', 'lazy', 'active', 'idle', 'strong', 'weak', 'smart', 'stupid',
  'clever', 'dumb', 'wise', 'foolish', 'brave', 'coward', 'honest', 'dishonest',
  'true', 'false', 'right', 'wrong', 'just', 'unjust', 'fair', 'unfair', 'good',
  'evil', 'safe', 'dangerous', 'healthy', 'sick', 'ill', 'well', 'fit', 'unfit',
  'rich', 'poor', 'wealthy', 'needy', 'full', 'empty', 'whole', 'partial', 'perfect',
  'imperfect', 'complete', 'incomplete', 'finished', 'unfinished', 'ready', 'unready',
  'able', 'unable', 'possible', 'impossible', 'likely', 'unlikely', 'probable',
  'improbable', 'certain', 'uncertain', 'sure', 'unsure', 'clear', 'unclear',
  'obvious', 'obscure', 'simple', 'complex', 'easy', 'difficult', 'hard', 'simple',
  'normal', 'abnormal', 'usual', 'unusual', 'common', 'rare', 'frequent', 'infrequent',
  'regular', 'irregular', 'typical', 'atypical', 'natural', 'artificial', 'genuine',
  'fake', 'authentic', 'false', 'real', 'imaginary', 'practical', 'theoretical',
  'concrete', 'abstract', 'physical', 'mental', 'material', 'spiritual', 'tangible',
  'intangible', 'visible', 'invisible', 'audible', 'inaudible', 'sensible',
  'insensible', 'reasonable', 'unreasonable', 'logical', 'illogical', 'rational',
  'irrational', 'sane', 'insane', 'sensible', 'nonsensical', 'meaningful',
  'meaningless', 'purposeful', 'purposeless', 'useful', 'useless', 'helpful',
  'unhelpful', 'beneficial', 'harmful', 'profitable', 'unprofitable', 'worthwhile',
  'worthless', 'valuable', 'worthless', 'precious', 'cheap', 'expensive', 'costly',
  'free', 'paid', 'public', 'private', 'open', 'closed', 'available', 'unavailable',
  'accessible', 'inaccessible', 'reachable', 'unreachable', 'obtainable',
  'unobtainable', 'achievable', 'unachievable', 'possible', 'impossible',
  'permanent', 'temporary', 'eternal', 'temporary', 'timeless', 'temporal',
  'infinite', 'finite', 'unlimited', 'limited', 'boundless', 'bounded',
  'endless', 'finite', 'everlasting', 'fleeting', 'permanent', 'provisional',
  'stable', 'unstable', 'steady', 'unsteady', 'firm', 'soft', 'rigid', 'flexible',
  'solid', 'liquid', 'gaseous', 'brittle', 'resilient', 'elastic', 'plastic',
  'body', 'mind', 'soul', 'spirit', 'heart', 'brain', 'head', 'face', 'eye',
  'ear', 'nose', 'mouth', 'tongue', 'tooth', 'teeth', 'lip', 'cheek', 'chin',
  'jaw', 'neck', 'shoulder', 'arm', 'elbow', 'wrist', 'hand', 'finger', 'thumb',
  'palm', 'chest', 'back', 'stomach', 'belly', 'side', 'hip', 'leg', 'thigh',
  'knee', 'ankle', 'foot', 'toe', 'heel', 'sole', 'bone', 'muscle', 'blood',
  'heart', 'lung', 'liver', 'kidney', 'skin', 'hair', 'nail', 'vein', 'artery',
  'man', 'woman', 'person', 'people', 'child', 'children', 'kid', 'baby', 'infant',
  'toddler', 'boy', 'girl', 'male', 'female', 'human', 'being', 'creature',
  'animal', 'fish', 'bird', 'insect', 'snake', 'frog', 'dog', 'cat', 'mouse',
  'rat', 'horse', 'cow', 'pig', 'sheep', 'goat', 'lion', 'tiger', 'bear', 'wolf',
  'fox', 'rabbit', 'deer', 'elephant', 'monkey', 'ape', 'gorilla', 'chimpanzee',
  'tree', 'bush', 'plant', 'flower', 'fruit', 'vegetable', 'grass', 'leaf',
  'leaves', 'branch', 'trunk', 'root', 'seed', 'grain', 'rice', 'wheat', 'corn',
  'bean', 'pea', 'carrot', 'potato', 'apple', 'orange', 'banana', 'grape',
  'strawberry', 'melon', 'watermelon', 'peach', 'pear', 'plum', 'cherry',
  'lemon', 'lime', 'coconut', 'nut', 'walnut', 'almond', 'peanut', 'olive',
  'water', 'sea', 'ocean', 'river', 'lake', 'pond', 'stream', 'creek', 'brook',
  'spring', 'fountain', 'well', 'rain', 'snow', 'ice', 'hail', 'cloud', 'wind',
  'storm', 'thunder', 'lightning', 'earthquake', 'volcano', 'mountain', 'hill',
  'valley', 'plain', 'plateau', 'desert', 'forest', 'jungle', 'swamp', 'marsh',
  'beach', 'shore', 'coast', 'island', 'peninsula', 'cape', 'bay', 'gulf',
  'strait', 'channel', 'canyon', 'cliff', 'cave', 'stone', 'rock', 'sand',
  'soil', 'earth', 'dirt', 'dust', 'mud', 'clay', 'metal', 'gold', 'silver',
  'copper', 'iron', 'steel', 'tin', 'lead', 'zinc', 'aluminum', 'plastic',
  'rubber', 'glass', 'wood', 'paper', 'cloth', 'silk', 'cotton', 'wool',
  'leather', 'fur', 'hair', 'fiber', 'thread', 'rope', 'string', 'wire',
  'house', 'home', 'room', 'door', 'window', 'wall', 'floor', 'ceiling',
  'roof', 'basement', 'attic', 'hallway', 'stair', 'step', 'ladder', 'bridge',
  'street', 'road', 'path', 'way', 'track', 'trail', 'route', 'passage',
  'gate', 'fence', 'wall', 'barrier', 'gate', 'door', 'entrance', 'exit',
  'kitchen', 'bedroom', 'bathroom', 'living', 'room', 'dining', 'study', 'office',
  'library', 'school', 'university', 'college', 'hospital', 'church', 'temple',
  'mosque', 'synagogue', 'monastery', 'convent', 'castle', 'palace', 'fort',
  'tower', 'building', 'structure', 'monument', 'statue', 'fountain', 'park',
  'garden', 'farm', 'field', 'vineyard', 'orchard', 'pasture', 'meadow',
  'city', 'town', 'village', 'country', 'nation', 'state', 'province',
  'county', 'district', 'region', 'area', 'zone', 'sector', 'territory',
  'continent', 'hemisphere', 'world', 'universe', 'planet', 'star', 'sun',
  'moon', 'earth', 'sky', 'space', 'atmosphere', 'weather', 'climate',
  'food', 'drink', 'water', 'milk', 'juice', 'tea', 'coffee', 'wine', 'beer',
  'bread', 'rice', 'meat', 'fish', 'chicken', 'beef', 'pork', 'lamb', 'cheese',
  'butter', 'milk', 'egg', 'salt', 'pepper', 'sugar', 'honey', 'oil', 'sauce',
  'soup', 'stew', 'salad', 'dessert', 'cake', 'pie', 'cookie', 'chocolate',
  'candy', 'nut', 'seed', 'grain', 'cereal', 'pasta', 'noodle', 'dumpling',
  'sandwich', 'burger', 'pizza', 'taco', 'sushi', 'curry', 'steak', 'bacon',
  'ham', 'sausage', 'hot', 'dog', 'bean', 'lentil', 'tofu', 'tempeh',
  'clothes', 'shirt', 'pants', 'dress', 'skirt', 'coat', 'jacket', 'sweater',
  'tie', 'scarf', 'hat', 'cap', 'boot', 'shoe', 'sock', 'glove', 'belt',
  'button', 'zipper', 'pocket', 'sleeve', 'collar', 'cuff', 'hem', 'seam',
  'underwear', 'bra', 'brief', 'tank', 'top', 'vest', 'cardigan', 'jumper',
  'hoodie', 'sweatshirt', 'robe', 'gown', 'suit', 'tuxedo', 'uniform', 'costume',
  'wedding', 'dress', 'veil', 'ring', 'necklace', 'bracelet', 'earring',
  'pendant', 'locket', 'watch', 'clock', 'alarm', 'timer', 'bell', 'whistle',
  'horn', 'bugle', 'trumpet', 'flute', 'clarinet', 'saxophone', 'violin',
  'guitar', 'piano', 'drum', 'cymbal', 'bell', 'harp', 'lyre', 'mandolin',
  'music', 'song', 'melody', 'harmony', 'rhythm', 'beat', 'tempo', 'note',
  'tone', 'sound', 'voice', 'speech', 'language', 'word', 'sentence', 'paragraph',
  'letter', 'alphabet', 'vowel', 'consonant', 'syllable', 'stress', 'accent',
  'pronunciation', 'grammar', 'syntax', 'tense', 'mood', 'case', 'number',
  'person', 'gender', 'article', 'noun', 'verb', 'adjective', 'adverb',
  'preposition', 'conjunction', 'interjection', 'pronoun', 'phrase', 'clause',
  'subject', 'object', 'predicate', 'complement', 'modifier', 'appositive',
  'simile', 'metaphor', 'personification', 'alliteration', 'assonance',
  'consonance', 'rhyme', 'meter', 'verse', 'stanza', 'canto', 'couplet',
  'sonnet', 'haiku', 'limerick', 'ballad', 'epic', 'drama', 'tragedy',
  'comedy', 'farce', 'satire', 'irony', 'sarcasm', 'pun', 'joke', 'riddle',
  'puzzle', 'game', 'play', 'sport', 'race', 'match', 'contest', 'competition',
  'tournament', 'championship', 'team', 'player', 'coach', 'referee', 'umpire',
  'judge', 'jury', 'attorney', 'lawyer', 'judge', 'court', 'trial', 'verdict',
  'guilty', 'innocent', 'crime', 'punishment', 'prison', 'jail', 'fine', 'penalty',
  'law', 'rule', 'regulation', 'policy', 'procedure', 'protocol', 'agreement',
  'contract', 'treaty', 'alliance', 'treaty', 'declaration', 'constitution',
  'bill', 'act', 'statute', 'ordinance', 'decree', 'edict', 'order', 'command',
  'government', 'state', 'nation', 'country', 'kingdom', 'empire', 'republic',
  'democracy', 'monarchy', 'oligarchy', 'dictatorship', 'tyranny', 'despotism',
  'president', 'king', 'queen', 'prince', 'princess', 'duke', 'duchess', 'earl',
  'count', 'baron', 'noble', 'aristocrat', 'peasant', 'serf', 'slave', 'freeman',
  'citizen', 'subject', 'resident', 'alien', 'foreigner', 'immigrant', 'emigrant',
  'refugee', 'exile', 'outlaw', 'criminal', 'thief', 'robber', 'burglar', 'pirate',
  'police', 'officer', 'soldier', 'general', 'colonel', 'major', 'captain',
  'lieutenant', 'sergeant', 'corporal', 'private', 'recruit', 'veteran',
  'war', 'battle', 'fight', 'combat', 'conflict', 'siege', 'siege', 'conquest',
  'surrender', 'victory', 'defeat', 'truce', 'peace', 'treaty', 'alliance',
  'weapon', 'gun', 'rifle', 'pistol', 'sword', 'spear', 'bow', 'arrow', 'shield',
  'armor', 'helmet', 'bullet', 'bomb', 'mine', 'grenade', 'cannon', 'tank',
  'ship', 'boat', 'yacht', 'sailboat', 'rowboat', 'canoe', 'kayak', 'raft',
  'submarine', 'battleship', 'destroyer', 'cruiser', 'carrier', 'frigate',
  'aircraft', 'airplane', 'jet', 'helicopter', 'drone', 'rocket', 'missile',
  'car', 'automobile', 'vehicle', 'truck', 'bus', 'taxi', 'ambulance', 'fire',
  'engine', 'police', 'car', 'bicycle', 'motorcycle', 'scooter', 'skateboard',
  'train', 'locomotive', 'railway', 'railroad', 'track', 'station', 'platform',
  'ticket', 'passenger', 'conductor', 'driver', 'mechanic', 'engineer',
  'science', 'biology', 'chemistry', 'physics', 'mathematics', 'algebra',
  'geometry', 'calculus', 'statistics', 'probability', 'logic', 'philosophy',
  'ethics', 'aesthetics', 'metaphysics', 'epistemology', 'ontology', 'phenomenology',
  'psychology', 'psychiatry', 'sociology', 'anthropology', 'archaeology',
  'history', 'geography', 'geology', 'mineralogy', 'botany', 'zoology',
  'ecology', 'astronomy', 'astrology', 'meteorology', 'oceanography',
  'medicine', 'surgery', 'dentistry', 'pharmacy', 'nursing', 'therapy',
  'disease', 'illness', 'sickness', 'health', 'wellness', 'fitness', 'exercise',
  'sport', 'workout', 'training', 'diet', 'nutrition', 'vitamin', 'mineral',
  'protein', 'carbohydrate', 'fat', 'fiber', 'calorie', 'energy', 'metabolism',
  'digestion', 'respiration', 'circulation', 'immunity', 'vaccine', 'antibiotic',
  'surgery', 'operation', 'anesthesia', 'incision', 'wound', 'scar', 'bandage',
  'cast', 'crutch', 'wheelchair', 'prosthetic', 'artificial', 'implant',
  'art', 'music', 'dance', 'theatre', 'drama', 'film', 'cinema', 'movie',
  'painting', 'sculpture', 'drawing', 'sketch', 'design', 'architecture',
  'artist', 'musician', 'dancer', 'actor', 'actress', 'singer', 'composer',
  'director', 'producer', 'writer', 'author', 'poet', 'novelist', 'journalist',
  'editor', 'publisher', 'printer', 'typist', 'secretary', 'accountant',
  'banker', 'merchant', 'trader', 'salesman', 'saleswoman', 'shopkeeper',
  'manager', 'director', 'supervisor', 'administrator', 'boss', 'employee',
  'worker', 'laborer', 'craftsman', 'artisan', 'blacksmith', 'carpenter',
  'mason', 'electrician', 'plumber', 'painter', 'gardener', 'farmer', 'rancher',
  'fisherman', 'hunter', 'logger', 'miner', 'quarryman', 'builder', 'architect',
  'engineer', 'technician', 'mechanic', 'technologist', 'scientist', 'researcher',
  'professor', 'teacher', 'instructor', 'tutor', 'coach', 'mentor', 'guide',
  'counselor', 'therapist', 'doctor', 'physician', 'surgeon', 'dentist',
  'pharmacist', 'nurse', 'midwife', 'veterinarian', 'psychologist', 'psychiatrist',
  'lawyer', 'judge', 'prosecutor', 'defendant', 'plaintiff', 'witness', 'jury',
  'police', 'officer', 'detective', 'investigator', 'inspector', 'agent',
  'spy', 'informant', 'smuggler', 'dealer', 'gangster', 'mobster', 'terrorist',
  'victim', 'survivor', 'martyr', 'hero', 'villain', 'protagonist', 'antagonist',
  'character', 'personality', 'trait', 'habit', 'custom', 'tradition', 'culture',
  'religion', 'faith', 'belief', 'god', 'goddess', 'deity', 'angel', 'demon',
  'spirit', 'ghost', 'phantom', 'apparition', 'specter', 'poltergeist', 'werewolf',
  'vampire', 'zombie', 'mummy', 'curse', 'hex', 'spell', 'magic', 'wizard',
  'witch', 'sorcerer', 'enchanter', 'alchemist', 'oracle', 'soothsayer', 'prophet',
  'fortune', 'fate', 'destiny', 'luck', 'chance', 'coincidence', 'miracle',
  'wonder', 'mystery', 'secret', 'riddle', 'puzzle', 'enigma', 'paradox',
  'contradiction', 'dilemma', 'quandary', 'predicament', 'plight', 'trouble',
  'problem', 'issue', 'matter', 'concern', 'interest', 'curiosity', 'wonder',
  'amazement', 'astonishment', 'surprise', 'shock', 'bewilderment', 'confusion',
  'perplexity', 'uncertainty', 'doubt', 'hesitation', 'reluctance', 'reluctance',
  'resistance', 'opposition', 'protest', 'objection', 'complaint', 'criticism',
  'praise', 'compliment', 'flattery', 'insult', 'insult', 'offense', 'offense',
  'mockery', 'ridicule', 'scorn', 'disdain', 'contempt', 'hatred', 'enmity',
  'hostility', 'aggression', 'violence', 'harm', 'injury', 'damage', 'ruin',
  'destruction', 'demolition', 'wreckage', 'debris', 'ash', 'remains', 'relic',
  'artifact', 'antiquity', 'fossil', 'skeleton', 'mummy', 'corpse', 'body',
  'ghost', 'phantom', 'spirit', 'soul', 'essence', 'substance', 'matter',
  'material', 'element', 'compound', 'mixture', 'solution', 'suspension',
  'emulsion', 'colloid', 'crystal', 'atom', 'molecule', 'ion', 'electron',
  'proton', 'neutron', 'nucleus', 'orbit', 'shell', 'orbital', 'bond', 'valence',
  'energy', 'force', 'power', 'strength', 'weakness', 'ability', 'capacity',
  'potential', 'kinetic', 'momentum', 'velocity', 'acceleration', 'gravity',
  'friction', 'tension', 'pressure', 'volume', 'mass', 'density', 'weight',
  'light', 'darkness', 'shadow', 'reflection', 'refraction', 'diffraction',
  'interference', 'resonance', 'vibration', 'frequency', 'wavelength', 'amplitude',
  'pitch', 'timbre', 'volume', 'decibel', 'noise', 'silence', 'echo', 'reverberation',
  'electricity', 'current', 'voltage', 'resistance', 'conductivity', 'insulation',
  'magnet', 'magnetism', 'pole', 'field', 'radiation', 'x', 'ray', 'gamma',
  'heat', 'temperature', 'thermometer', 'thermodynamics', 'entropy', 'combustion',
  'oxidation', 'reduction', 'acid', 'base', 'salt', 'ion', 'electron', 'atom',
  'molecule', 'compound', 'element', 'periodic', 'table', 'isotope', 'isotopic',
  'nuclear', 'fission', 'fusion', 'chain', 'reaction', 'catalyst', 'enzyme',
  'protein', 'amino', 'acid', 'lipid', 'carbohydrate', 'sugar', 'glucose',
  'fructose', 'sucrose', 'lactose', 'maltose', 'starch', 'cellulose', 'fiber',
  'virus', 'bacteria', 'microbe', 'germ', 'pathogen', 'parasite', 'fungus',
  'mold', 'yeast', 'algae', 'moss', 'lichen', 'plant', 'animal', 'organism',
  'cell', 'nucleus', 'cytoplasm', 'mitochondria', 'chloroplast', 'ribosome',
  'chromosome', 'gene', 'dna', 'rna', 'protein', 'enzyme', 'hormone', 'antibody',
  'antigen', 'immune', 'system', 'lymph', 'node', 'spleen', 'thymus', 'bone',
  'marrow', 'blood', 'plasma', 'serum', 'corpuscle', 'platelet', 'hemoglobin',
  'oxygen', 'carbon', 'dioxide', 'nitrogen', 'hydrogen', 'helium', 'neon',
  'argon', 'fluorine', 'chlorine', 'bromine', 'iodine', 'sulfur', 'phosphorus',
  'calcium', 'magnesium', 'sodium', 'potassium', 'iron', 'copper', 'zinc',
  'aluminum', 'silver', 'gold', 'platinum', 'lead', 'mercury', 'uranium',
  'plutonium', 'radium', 'thorium', 'polonium', 'francium', 'radon', 'xenon',
  'krypton', 'argon', 'neon', 'helium', 'hydrogen', 'oxygen', 'nitrogen',
  'time', 'hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond',
  'day', 'week', 'month', 'year', 'decade', 'century', 'millennium', 'era',
  'epoch', 'age', 'season', 'spring', 'summer', 'autumn', 'fall', 'winter',
  'morning', 'afternoon', 'evening', 'night', 'midnight', 'noon', 'sunrise',
  'sunset', 'twilight', 'dusk', 'dawn', 'daylight', 'daybreak', 'sundown',
  'past', 'present', 'future', 'yesterday', 'today', 'tomorrow', 'always',
  'never', 'sometimes', 'often', 'rarely', 'frequently', 'occasionally',
  'periodically', 'constantly', 'continuously', 'intermittently', 'once', 'twice',
  'thrice', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh',
  'eighth', 'ninth', 'tenth', 'last', 'previous', 'next', 'last', 'current',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
  'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty',
  'seventy', 'eighty', 'ninety', 'hundred', 'thousand', 'million', 'billion',
  'trillion', 'zero', 'half', 'quarter', 'third', 'double', 'triple', 'multiple',
  'dozen', 'pair', 'couple', 'group', 'batch', 'bundle', 'pack', 'set', 'series',
  'sequence', 'progression', 'array', 'matrix', 'grid', 'network', 'system',
  'organization', 'structure', 'framework', 'scheme', 'plan', 'design', 'model',
  'pattern', 'shape', 'form', 'figure', 'configuration', 'arrangement',
  'composition', 'layout', 'symmetry', 'asymmetry', 'balance', 'imbalance',
  'harmony', 'discord', 'consonance', 'dissonance', 'unity', 'diversity',
  'variety', 'monotony', 'sameness', 'difference', 'similarity', 'contrast',
  'parallel', 'perpendicular', 'diagonal', 'horizontal', 'vertical', 'angular',
  'curved', 'straight', 'circle', 'square', 'triangle', 'rectangle', 'pentagon',
  'hexagon', 'octagon', 'polygon', 'point', 'line', 'curve', 'surface', 'plane',
  'sphere', 'cube', 'cylinder', 'cone', 'pyramid', 'prism', 'angle', 'degree',
  'radian', 'sine', 'cosine', 'tangent', 'vector', 'scalar', 'tensor', 'matrix',
  'determinant', 'eigenvalue', 'eigenvector', 'diagonalization', 'orthogonal',
  'orthonormal', 'linearly', 'independent', 'dependent', 'basis', 'dimension',
  'rank', 'nullity', 'kernel', 'image', 'projection', 'transformation',
  'translation', 'rotation', 'reflection', 'scaling', 'shearing', 'composition',
  'inverse', 'transpose', 'adjoint', 'conjugate', 'norm', 'magnitude', 'length',
  'distance', 'metric', 'topology', 'open', 'closed', 'compact', 'connected',
  'continuous', 'discontinuous', 'smooth', 'differentiable', 'integrable',
  'convergent', 'divergent', 'limit', 'sequence', 'series', 'sum', 'product',
  'quotient', 'remainder', 'modulo', 'congruence', 'equivalence', 'relation',
  'function', 'domain', 'range', 'codomain', 'mapping', 'injection', 'surjection',
  'bijection', 'permutation', 'combination', 'factorial', 'binomial', 'multinomial',
  'probability', 'likelihood', 'expectation', 'variance', 'standard', 'deviation',
  'distribution', 'normal', 'binomial', 'poisson', 'exponential', 'uniform',
  'confidence', 'interval', 'hypothesis', 'test', 'p', 'value', 'alpha', 'beta',
  'type', 'error', 'power', 'sample', 'size', 'population', 'mean', 'median',
  'mode', 'range', 'quartile', 'percentile', 'skewness', 'kurtosis', 'correlation',
  'covariance', 'regression', 'residual', 'outlier', 'anomaly', 'noise', 'signal',
  'filter', 'smoothing', 'interpolation', 'extrapolation', 'fitting', 'optimization',
  'minimization', 'maximization', 'constraint', 'feasible', 'infeasible', 'optimal',
  'suboptimal', 'heuristic', 'algorithm', 'complexity', 'efficient', 'inefficient',
  'polynomial', 'exponential', 'logarithmic', 'linear', 'quadratic', 'cubic',
  'recursion', 'iteration', 'loop', 'conditional', 'branch', 'decision', 'tree',
  'graph', 'node', 'edge', 'vertex', 'path', 'cycle', 'tree', 'forest', 'heap',
  'queue', 'stack', 'linked', 'list', 'array', 'hash', 'table', 'set', 'map',
  'dictionary', 'tuple', 'record', 'class', 'object', 'instance', 'method',
  'property', 'attribute', 'constructor', 'destructor', 'inheritance', 'polymorphism',
  'encapsulation', 'abstraction', 'interface', 'implementation', 'contract',
  'specification', 'documentation', 'comment', 'debug', 'exception', 'error',
  'warning', 'message', 'log', 'trace', 'assertion', 'validation', 'verification',
  'testing', 'unit', 'integration', 'system', 'acceptance', 'regression', 'smoke',
  'benchmark', 'profiling', 'optimization', 'refactoring', 'design', 'pattern',
  'architecture', 'framework', 'library', 'module', 'package', 'plugin',
  'extension', 'addon', 'middleware', 'decorator', 'observer', 'proxy', 'adapter',
  'facade', 'bridge', 'composite', 'decorator', 'factory', 'prototype', 'singleton',
  'builder', 'strategy', 'template', 'visitor', 'interpreter', 'chain', 'command',
  'mediator', 'memento', 'state', 'iterator', 'flyweight', 'abstract', 'concrete',
  'client', 'server', 'request', 'response', 'message', 'packet', 'protocol',
  'tcp', 'ip', 'http', 'https', 'ftp', 'smtp', 'dns', 'dhcp', 'ssh', 'ssl',
  'tls', 'vpn', 'proxy', 'firewall', 'router', 'gateway', 'bridge', 'switch',
  'hub', 'modem', 'adapter', 'interface', 'port', 'socket', 'connection',
  'bandwidth', 'latency', 'throughput', 'jitter', 'packet', 'loss', 'congestion',
  'collision', 'buffering', 'timeout', 'retry', 'handshake', 'authentication',
  'authorization', 'encryption', 'decryption', 'hash', 'checksum', 'signature',
  'certificate', 'public', 'private', 'key', 'symmetric', 'asymmetric', 'rsa',
  'aes', 'des', 'md5', 'sha', 'algorithm', 'cipher', 'plaintext', 'ciphertext',
  'brute', 'force', 'rainbow', 'table', 'dictionary', 'attack', 'malware', 'virus',
  'worm', 'trojan', 'ransomware', 'spyware', 'adware', 'botnet', 'ddos', 'exploit',
  'vulnerability', 'patch', 'update', 'version', 'build', 'release', 'stable',
  'beta', 'alpha', 'deprecated', 'obsolete', 'legacy', 'migration', 'upgrade',
  'downgrade', 'rollback', 'deployment', 'production', 'development', 'testing',
  'staging', 'sandbox', 'container', 'virtual', 'machine', 'hypervisor', 'cloud',
  'cluster', 'node', 'instance', 'service', 'microservice', 'api', 'rest',
  'soap', 'graphql', 'json', 'xml', 'csv', 'yaml', 'toml', 'ini', 'config',
  'environment', 'variable', 'constant', 'literal', 'expression', 'statement',
  'operator', 'operand', 'precedence', 'associativity', 'arity', 'type',
  'casting', 'coercion', 'implicit', 'explicit', 'strong', 'weak', 'static',
  'dynamic', 'compiled', 'interpreted', 'bytecode', 'machine', 'code', 'assembly',
  'instruction', 'register', 'memory', 'cache', 'bus', 'cpu', 'gpu', 'ram', 'disk',
  'ssd', 'hdd', 'storage', 'database', 'query', 'transaction', 'rollback',
  'commit', 'lock', 'deadlock', 'livelock', 'starvation', 'race', 'condition',
  'mutex', 'semaphore', 'atomic', 'volatile', 'synchronized', 'concurrent',
  'parallel', 'distributed', 'asynchronous', 'callback', 'promise', 'future',
  'async', 'await', 'generator', 'coroutine', 'thread', 'process', 'fiber',
  'context', 'switch', 'scheduling', 'priority', 'quantum', 'round', 'robin',
  'first', 'come', 'served', 'shortest', 'job', 'first', 'priority', 'queue',
  'aging', 'preemptive', 'non', 'preemptive', 'context', 'switch', 'overhead',
]);

/**
 * Extract words from text
 */
function extractWords(text: string): string[] {
  const matches = text.match(/\b\w+\b/g) || [];
  return matches.map(word => word.toLowerCase());
}

/**
 * Check if a word is common (in the top 5000)
 */
function isCommonWord(word: string): boolean {
  return COMMON_WORDS.has(word.toLowerCase());
}

/**
 * Detect rare word usage patterns
 */
export function detectRareWordUsage(text: string): RareWordMatch[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const words = extractWords(text);
  const totalWords = words.length;

  if (totalWords === 0) {
    return [];
  }

  // Find rare words
  const rareWords: string[] = [];
  const rareWordsSet = new Set<string>();

  for (const word of words) {
    if (!isCommonWord(word) && word.length > 2) { // Skip very short words
      rareWords.push(word);
      rareWordsSet.add(word);
    }
  }

  // Calculate frequency
  const rareWordFrequency = rareWords.length / totalWords;

  // Threshold: 12% (0.12) indicates potential AI writing
  const threshold = 0.12;
  const isAIPotential = rareWordFrequency > threshold;

  if (!isAIPotential) {
    return [];
  }

  const match: RareWordMatch = {
    rareWords: Array.from(rareWordsSet).sort(),
    count: rareWords.length,
    frequency: rareWordFrequency,
    isAIPotential,
    description: `Unusual concentration of rare/obscure words (${(rareWordFrequency * 100).toFixed(2)}% of text) suggests artificial writing. Natural human text typically uses rare words at 3-8% frequency.`,
    score: Math.round(Math.min((rareWordFrequency - threshold) * 200, 30)),
  };

  return [match];
}

/**
 * Color for rare word usage highlights
 */
export const RARE_WORD_USAGE_COLOR = '#8b5cf6'; // violet-500

/**
 * Generate highlights for rare word usage matches
 */
export function generateRareWordUsageHighlights(
  text: string,
  matches: RareWordMatch[]
): Array<{
  start: number;
  end: number;
  factor: string;
  category: string;
  color: string;
}> {
  const highlights: Array<{
    start: number;
    end: number;
    factor: string;
    category: string;
    color: string;
  }> = [];

  if (matches.length === 0) {
    return highlights;
  }

  const rareWordsSet = new Set(matches[0].rareWords);

  // Find and highlight rare words in text
  const wordPattern = /\b\w+\b/g;
  let match;

  while ((match = wordPattern.exec(text)) !== null) {
    const word = match[0];
    const lowerWord = word.toLowerCase();

    if (rareWordsSet.has(lowerWord) && lowerWord.length > 2) {
      highlights.push({
        start: match.index,
        end: match.index + word.length,
        factor: word,
        category: 'Rare Word Usage',
        color: RARE_WORD_USAGE_COLOR,
      });
    }
  }

  return highlights;
}
