const coin = document.getElementById('coin');
const counter = document.getElementById('counter');
const message = document.getElementById('message');
const progress = document.getElementById('progress');
const statsDisplay = document.getElementById('stats');
const autoTapperBtn = document.getElementById('auto-tapper-btn');
const autoTapperStatus = document.getElementById('auto-tapper-status');
const autoTapperTimer = document.getElementById('auto-tapper-timer');
const autoTapperText = document.getElementById('auto-tapper-text');
const activeMultiplierDisplay = document.getElementById('active-multiplier');
const multiplierTimer = document.getElementById('multiplier-timer');
const multiplierButtons = document.querySelectorAll('.multiplier-btn');
const comboDisplay = document.getElementById('combo-display');
const comboFill = document.getElementById('combo-fill');
const comboMeter = document.getElementById('combo-meter');
const rareCoin = document.getElementById('rare-coin');

// Modal elements
const prestigeBtn = document.getElementById('prestige-btn');
const achievementsBtn = document.getElementById('achievements-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const skinsBtn = document.getElementById('skins-btn');
const minigamesBtn = document.getElementById('minigames-btn');
const dailyBtn = document.getElementById('daily-btn');
const shopBtn = document.getElementById('shop-btn');
const shareBtn = document.getElementById('share-btn');
const timetrialBtn = document.getElementById('timetrial-btn');
const prestigeModal = document.getElementById('prestige-modal');
const achievementsModal = document.getElementById('achievements-modal');
const leaderboardModal = document.getElementById('leaderboard-modal');
const skinsModal = document.getElementById('skins-modal');
const minigamesModal = document.getElementById('minigames-modal');
const dailyModal = document.getElementById('daily-modal');
const shopModal = document.getElementById('shop-modal');
const shareModal = document.getElementById('share-modal');
const timetrialModal = document.getElementById('timetrial-modal');
const confirmPrestigeBtn = document.getElementById('confirm-prestige');
const closeModals = document.querySelectorAll('.close-modal');

// Milestones configuration
const milestones = [
    { taps: 10, message: 'Getting started! 🎉' },
    { taps: 50, message: '50 taps! Keep it up! 💪' },
    { taps: 100, message: '100 taps! Amazing! ⭐' },
    { taps: 250, message: '250 taps! You\'re on fire! 🔥' },
    { taps: 500, message: '500 taps! Halfway there! 🌟' },
    { taps: 750, message: '750 taps! Almost there! 💎' },
    { taps: 1000, message: '1000 taps! LEGEND! 👑' },
];

const maxTaps = 1000;
let tapCount = localStorage.getItem('tapCount') ? parseInt(localStorage.getItem('tapCount')) : 0;
let startTime = localStorage.getItem('startTime') ? parseInt(localStorage.getItem('startTime')) : Date.now();
let lastTapTime = Date.now();
let tapsPerSecond = 0;
let highestTapsPerSecond = localStorage.getItem('highestTapsPerSecond') ? parseFloat(localStorage.getItem('highestTapsPerSecond')) : 0;
let tapHistory = [];
let completedMilestones = JSON.parse(localStorage.getItem('completedMilestones') || '[]');

// Auto-Tapper configuration
const AUTO_TAPPER_CONFIG = {
    unlockAt: 100, // Unlocks at 100 taps
    duration: 20000, // 20 seconds
    tapInterval: 100, // Tap every 100ms (10 taps per second)
    cost: 0 // Free after unlock (could be changed to cost taps)
};

let autoTapperActive = false;
let autoTapperInterval = null;
let autoTapperEndTime = 0;
let autoTapperUnlocked = localStorage.getItem('autoTapperUnlocked') === 'true';

// Multiplier configuration
const MULTIPLIER_CONFIG = {
    2: { duration: 15000, dropChance: 0.05 }, // 5% chance to drop 2x multiplier
    3: { duration: 12000, dropChance: 0.03 }, // 3% chance to drop 3x multiplier
    5: { duration: 8000, dropChance: 0.01 }   // 1% chance to drop 5x multiplier
};

let currentMultiplier = 1;
let multiplierEndTime = 0;
let multiplierActive = false;

// Combo system configuration
const COMBO_CONFIG = {
    maxInactivityTime: 2000, // 2 seconds between taps to maintain combo
    comboBonusMultiplier: 0.1, // 10% bonus per combo level
    maxComboDisplay: 100, // Maximum combo to show in display
    decayRate: 100 // Combo bar decay per frame
};

// Combo effects configuration
const COMBO_EFFECTS_CONFIG = {
    thresholds: [
        { combo: 10, name: 'Good Start', shake: false, flash: 'rgba(76, 175, 80, 0.5)', transform: 'scale(1.05)' },
        { combo: 20, name: 'On Fire', shake: true, shakeIntensity: 3, flash: 'rgba(255, 107, 107, 0.6)', transform: 'scale(1.1) rotate(5deg)' },
        { combo: 30, name: 'Unstoppable', shake: true, shakeIntensity: 5, flash: 'rgba(255, 193, 7, 0.7)', transform: 'scale(1.15)' },
        { combo: 50, name: 'Combo Master', shake: true, shakeIntensity: 8, flash: 'rgba(255, 152, 0, 0.8)', transform: 'scale(1.2) rotate(-5deg)' },
        { combo: 75, name: 'Legendary', shake: true, shakeIntensity: 12, flash: 'rgba(156, 39, 176, 0.9)', transform: 'scale(1.25) rotate(10deg)' },
        { combo: 100, name: 'GODLIKE', shake: true, shakeIntensity: 15, flash: 'rgba(255, 215, 0, 1)', transform: 'scale(1.3) rotate(-10deg)' }
    ],
    shakeDuration: 300,
    flashDuration: 200,
    transformDuration: 150
};

let lastComboThreshold = 0;

let comboCount = 0;
let comboEndTime = 0;
let comboTimeoutHandle = null;
let highestCombo = localStorage.getItem('highestCombo') ? parseInt(localStorage.getItem('highestCombo')) : 0;

// Rare coin configuration
const RARE_COIN_CONFIG = {
    spawnChance: 0.02, // 2% chance per tap
    goldenValue: 5, // Golden coin worth 5x
    platinumValue: 50, // Platinum coin worth 50x
    goldenChance: 0.7, // 70% chance to spawn golden when rare coin appears
    duration: 5000, // Coin stays for 5 seconds
    spawnCooldown: 10000 // 10 seconds between spawns
};

let rareCoinActive = false;
let rareCoinType = null;
let rareCoinEndTime = 0;
let lastRareCoinSpawn = 0;
let rareCoinValue = 1;

// Prestige system
const PRESTIGE_CONFIG = {
    requiredTaps: 1000,
    pointsPerPrestige: 1,
    multiplierPerPoint: 0.05, // 5% per prestige point
    speedPerPoint: 0.02, // 2% per prestige point
    unlocks: {
        // Prestige level -> unlock description
        1: 'Auto-tapper starts unlocked',
        3: 'Multiplier duration +20%',
        5: 'Rare coin spawn chance +50%',
        10: 'Combo bonus +50%'
    }
};

let prestigeLevel = parseInt(localStorage.getItem('prestigeLevel') || '0');
let prestigePoints = parseInt(localStorage.getItem('prestigePoints') || '0');
let sessionStartTime = Date.now();
let longestSession = parseInt(localStorage.getItem('longestSession') || '0');
let fastest100Taps = parseInt(localStorage.getItem('fastest100Taps') || '0');
let fastest100StartTaps = 0;
let fastest100StartTime = 0;

// All-time stats (persist across prestiges)
let totalLifetimeTaps = parseInt(localStorage.getItem('totalLifetimeTaps') || '0');
let bestAllTimeSpeed = parseInt(localStorage.getItem('bestAllTimeSpeed') || '0');
let bestAllTimeCombo = parseInt(localStorage.getItem('bestAllTimeCombo') || '0');
let totalPrestiges = parseInt(localStorage.getItem('totalPrestiges') || '0');
let totalPlayTime = parseInt(localStorage.getItem('totalPlayTime') || '0');
let bestSessionTime = parseInt(localStorage.getItem('bestSessionTime') || '0');

// Achievements configuration
const ACHIEVEMENTS = [
    { id: 'first_tap', name: 'First Tap', desc: 'Tap once', icon: '👆', category: 'basic', rarity: 'common', unlocked: false },
    { id: 'speed_demon', name: 'Speed Demon', desc: 'Achieve 20+ taps/sec', icon: '⚡', category: 'skill', rarity: 'rare', unlocked: false },
    { id: 'combo_master', name: 'Combo Master', desc: 'Reach 50x combo', icon: '🔥', category: 'skill', rarity: 'epic', unlocked: false },
    { id: 'platinum_hunter', name: 'Platinum Hunter', desc: 'Catch 5 platinum coins', icon: '💎', category: 'collection', rarity: 'epic', unlocked: false },
    { id: 'marathon', name: 'Marathon Runner', desc: 'Play for 1 hour', icon: '🏃', category: 'time', rarity: 'rare', unlocked: false },
    { id: 'prestiger', name: 'Prestiger', desc: 'Prestige once', icon: '🏆', category: 'prestige', rarity: 'legendary', unlocked: false },
    { id: 'perfectionist', name: 'Perfectionist', desc: 'Reach 1000 taps', icon: '⭐', category: 'milestone', rarity: 'epic', unlocked: false },
    { id: 'collector', name: 'Collector', desc: 'Unlock 3 coin skins', icon: '🎨', category: 'collection', rarity: 'rare', unlocked: false },
    { id: 'speedster', name: 'Speedster', desc: 'Complete 100 taps in under 10 seconds', icon: '🚀', category: 'skill', rarity: 'legendary', unlocked: false },
    { id: 'endurance', name: 'Endurance Master', desc: 'Play for 3 hours', icon: '💪', category: 'time', rarity: 'epic', unlocked: false },
    { id: 'combo_king', name: 'Combo King', desc: 'Reach 100x combo', icon: '👑', category: 'skill', rarity: 'legendary', unlocked: false },
    { id: 'multi_prestiger', name: 'Multi-Prestiger', desc: 'Prestige 5 times', icon: '🌟', category: 'prestige', rarity: 'legendary', unlocked: false }
];

let achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
let platinumCoinsCaught = parseInt(localStorage.getItem('platinumCoinsCaught') || '0');

// Coin skins configuration
const COIN_SKINS = [
    { id: 'default', name: 'Default', unlockAt: 0, unlockMethod: 'free', cost: 0, icon: '🪙', rarity: 'common' },
    { id: 'golden', name: 'Golden', unlockAt: 100, unlockMethod: 'milestone', cost: 0, icon: '🌟', rarity: 'rare' },
    { id: 'platinum', name: 'Platinum', unlockAt: 500, unlockMethod: 'milestone', cost: 0, icon: '💎', rarity: 'epic' },
    { id: 'rainbow', name: 'Rainbow', unlockAt: 750, unlockMethod: 'milestone', cost: 0, icon: '🌈', rarity: 'epic' },
    { id: 'legendary', name: 'Legendary', unlockAt: 1000, unlockMethod: 'milestone', cost: 0, icon: '👑', rarity: 'legendary' },
    { id: 'fire', name: 'Fire Coin', unlockAt: 0, unlockMethod: 'purchase', cost: 50, icon: '🔥', rarity: 'rare' },
    { id: 'ice', name: 'Ice Coin', unlockAt: 0, unlockMethod: 'purchase', cost: 100, icon: '❄️', rarity: 'rare' },
    { id: 'space', name: 'Space Coin', unlockAt: 0, unlockMethod: 'purchase', cost: 200, icon: '🚀', rarity: 'epic' },
    { id: 'neon', name: 'Neon Coin', unlockAt: 0, unlockMethod: 'purchase', cost: 150, icon: '💫', rarity: 'epic' },
    { id: 'cosmic', name: 'Cosmic', unlockAt: 0, unlockMethod: 'purchase', cost: 300, icon: '🌌', rarity: 'legendary' }
];

let currentSkin = localStorage.getItem('currentSkin') || 'default';
let unlockedSkins = JSON.parse(localStorage.getItem('unlockedSkins') || '["default"]');
let skinCurrency = parseInt(localStorage.getItem('skinCurrency') || '0'); // Currency earned from taps/prestige

// Shop/Upgrades state
const SHOP_UPGRADES = [
    {
        id: 'animation_speed',
        name: 'Faster Animations',
        description: 'Makes coin animations 20% faster',
        icon: '⚡',
        cost: 50,
        maxLevel: 5,
        effect: (level) => ({ animationSpeed: 1 - (level * 0.2) }) // 20% faster per level
    },
    {
        id: 'particle_quality',
        name: 'Better Particles',
        description: 'Increases particle count and effects',
        icon: '✨',
        cost: 75,
        maxLevel: 5,
        effect: (level) => ({ particleCount: 8 + (level * 4), particleSize: 8 + (level * 2) })
    },
    {
        id: 'particle_duration',
        name: 'Longer Particles',
        description: 'Particles last 50% longer',
        icon: '🌟',
        cost: 100,
        maxLevel: 3,
        effect: (level) => ({ particleDuration: 1 + (level * 0.5) })
    },
    {
        id: 'tap_feedback',
        name: 'Enhanced Tap Feedback',
        description: 'Better visual feedback on taps',
        icon: '💫',
        cost: 60,
        maxLevel: 3,
        effect: (level) => ({ tapFeedback: true, feedbackIntensity: level })
    }
];

// Theme configurations
const THEMES = {
    default: {
        name: 'Default',
        icon: '⚪',
        class: '',
        colors: {
            primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            text: '#fff',
            accent: '#FFD700'
        }
    },
    dark: {
        name: 'Dark Theme',
        icon: '🌙',
        class: 'theme-dark',
        colors: {
            primary: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            text: '#fff',
            accent: '#FFD700'
        }
    },
    light: {
        name: 'Light Theme',
        icon: '☀️',
        class: 'theme-light',
        colors: {
            primary: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
            text: '#333',
            accent: '#667eea'
        }
    },
    rainbow: {
        name: 'Rainbow',
        icon: '🌈',
        class: 'theme-rainbow',
        colors: {
            primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
            text: '#fff',
            accent: '#FFD700'
        }
    },
    spring: {
        name: 'Spring',
        icon: '🌸',
        class: 'theme-spring',
        colors: {
            primary: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
            text: '#fff',
            accent: '#ff6b9d'
        }
    },
    summer: {
        name: 'Summer',
        icon: '☀️',
        class: 'theme-summer',
        colors: {
            primary: 'linear-gradient(135deg, #f6d365 0%, #fda085 50%, #ffecd2 100%)',
            text: '#fff',
            accent: '#ff6b35'
        }
    },
    fall: {
        name: 'Fall',
        icon: '🍂',
        class: 'theme-fall',
        colors: {
            primary: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 50%, #667eea 100%)',
            text: '#fff',
            accent: '#d299c2'
        }
    },
    winter: {
        name: 'Winter',
        icon: '❄️',
        class: 'theme-winter',
        colors: {
            primary: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 50%, #e0c3fc 100%)',
            text: '#fff',
            accent: '#8ec5fc'
        }
    },
    custom: {
        name: 'Custom',
        icon: '🎨',
        class: 'theme-custom',
        colors: null // Will be set by user
    }
};

const SHOP_COSMETICS = [
    {
        id: 'theme_dark',
        name: 'Dark Theme',
        description: 'Dark background theme',
        icon: '🌙',
        cost: 0, // Free default theme
        category: 'theme',
        themeId: 'dark'
    },
    {
        id: 'theme_light',
        name: 'Light Theme',
        description: 'Light background theme',
        icon: '☀️',
        cost: 0, // Free default theme
        category: 'theme',
        themeId: 'light'
    },
    {
        id: 'theme_rainbow',
        name: 'Rainbow Theme',
        description: 'Colorful rainbow theme',
        icon: '🌈',
        cost: 200,
        category: 'theme',
        themeId: 'rainbow'
    },
    {
        id: 'theme_spring',
        name: 'Spring Theme',
        description: 'Beautiful spring colors',
        icon: '🌸',
        cost: 150,
        category: 'theme',
        themeId: 'spring'
    },
    {
        id: 'theme_summer',
        name: 'Summer Theme',
        description: 'Warm summer vibes',
        icon: '☀️',
        cost: 150,
        category: 'theme',
        themeId: 'summer'
    },
    {
        id: 'theme_fall',
        name: 'Fall Theme',
        description: 'Autumn colors',
        icon: '🍂',
        cost: 150,
        category: 'theme',
        themeId: 'fall'
    },
    {
        id: 'theme_winter',
        name: 'Winter Theme',
        description: 'Cool winter palette',
        icon: '❄️',
        cost: 150,
        category: 'theme',
        themeId: 'winter'
    },
    {
        id: 'theme_custom',
        name: 'Custom Theme',
        description: 'Create your own color scheme',
        icon: '🎨',
        cost: 300,
        category: 'theme',
        themeId: 'custom'
    },
    {
        id: 'particles_gold',
        name: 'Gold Particles',
        description: 'Golden particle effects',
        icon: '🟡',
        cost: 50,
        category: 'particles',
        color: 'rgba(255, 215, 0, 0.9)'
    },
    {
        id: 'particles_blue',
        name: 'Blue Particles',
        description: 'Blue particle effects',
        icon: '🔵',
        cost: 50,
        category: 'particles',
        color: 'rgba(100, 149, 237, 0.9)'
    },
    {
        id: 'particles_red',
        name: 'Red Particles',
        description: 'Red particle effects',
        icon: '🔴',
        cost: 50,
        category: 'particles',
        color: 'rgba(255, 69, 58, 0.9)'
    },
    {
        id: 'particles_green',
        name: 'Green Particles',
        description: 'Green particle effects',
        icon: '🟢',
        cost: 50,
        category: 'particles',
        color: 'rgba(52, 199, 89, 0.9)'
    },
    {
        id: 'particles_purple',
        name: 'Purple Particles',
        description: 'Purple particle effects',
        icon: '🟣',
        cost: 50,
        category: 'particles',
        color: 'rgba(175, 82, 222, 0.9)'
    },
    {
        id: 'particles_rainbow',
        name: 'Rainbow Particles',
        description: 'Multi-color rainbow particles',
        icon: '🌈',
        cost: 150,
        category: 'particles',
        color: 'rainbow'
    }
];

let shopUpgrades = JSON.parse(localStorage.getItem('shopUpgrades') || '{}'); // { upgradeId: level }
let shopCosmetics = JSON.parse(localStorage.getItem('shopCosmetics') || '[]'); // Array of cosmetic IDs
let currentTheme = localStorage.getItem('currentTheme') || 'default';
let currentParticleColor = localStorage.getItem('currentParticleColor') || 'default';

// Sound system
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false'; // Default to true
let musicEnabled = localStorage.getItem('musicEnabled') !== 'false'; // Default to true
let audioContext = null;
let backgroundMusicGain = null;
let backgroundMusicOscillator = null;
let backgroundMusicInterval = null;

// Mini-Games state
const MINIGAMES_CONFIG = {
    timeChallenge: {
        name: 'Time Challenge',
        description: 'Tap 100 times in 30 seconds!',
        icon: '⏱️',
        targetTaps: 100,
        timeLimit: 30000 // 30 seconds in ms
    },
    endurance: {
        name: 'Endurance Mode',
        description: 'Tap continuously for as long as you can!',
        icon: '💪',
        iconActive: '🔥'
    },
    precision: {
        name: 'Precision Mode',
        description: 'Tap when the target indicator appears!',
        icon: '🎯',
        windowDuration: 500, // How long the target is active
        spawnInterval: 1500, // Time between target appearances
        difficultyIncrease: 50 // Reduce interval by this ms each successful tap
    },
    rhythm: {
        name: 'Rhythm Mode',
        description: 'Tap to the beat! Follow the rhythm pattern',
        icon: '🎵',
        bpm: 120, // Beats per minute
        patternLength: 8, // Number of beats in pattern
        tolerance: 150 // Timing tolerance in ms
    }
};

let minigameActive = false;
let currentMinigame = null;
let minigameState = {
    timeChallenge: { taps: 0, startTime: 0, endTime: 0, bestScore: parseInt(localStorage.getItem('minigame_timeChallenge_best') || '0') },
    endurance: { duration: 0, startTime: 0, lastTapTime: 0, bestScore: parseInt(localStorage.getItem('minigame_endurance_best') || '0') },
    precision: { score: 0, misses: 0, startTime: 0, targetActive: false, targetTimeout: null, spawnTimeout: null, difficulty: 0, bestScore: parseInt(localStorage.getItem('minigame_precision_best') || '0') },
    rhythm: { score: 0, misses: 0, startTime: 0, currentBeat: 0, lastTapTime: 0, perfectCount: 0, bestScore: parseInt(localStorage.getItem('minigame_rhythm_best') || '0') }
};
let minigameInterval = null;

// Tap Pattern System (for normal gameplay)
const TAP_PATTERNS = [
    {
        id: 'double_tap',
        name: 'Double Tap',
        pattern: [200, 200], // Tap intervals in ms
        bonus: 1.5, // 50% bonus
        icon: '⚡'
    },
    {
        id: 'triple_tap',
        name: 'Triple Tap',
        pattern: [150, 150, 150],
        bonus: 2.0, // 100% bonus
        icon: '🔥'
    },
    {
        id: 'rapid_fire',
        name: 'Rapid Fire',
        pattern: [100, 100, 100, 100],
        bonus: 2.5, // 150% bonus
        icon: '💥'
    },
    {
        id: 'rhythm_pattern',
        name: 'Rhythm Pattern',
        pattern: [250, 250, 500, 250],
        bonus: 3.0, // 200% bonus
        icon: '🎵'
    }
];

let activePattern = null;
let patternTapHistory = []; // Array of tap timestamps
let patternBonusActive = false;
let patternBonusEndTime = 0;

// Daily Challenges state (must be declared before initializeDailyChallenges is called)
const DAILY_CHALLENGES_CONFIG = {
    baseReward: 10,
    streakMultiplier: 0.1, // 10% bonus per streak day
    maxStreakBonus: 2.0 // Max 200% bonus (20 day streak)
};

// Daily challenges types
const DAILY_CHALLENGE_TYPES = [
    {
        id: 'taps',
        name: 'Tapper',
        icon: '👆',
        generateGoal: () => ({
            target: 50 + Math.floor(Math.random() * 200), // 50-250 taps
            current: 0,
            completed: false,
            reward: 10
        })
    },
    {
        id: 'combo',
        name: 'Combo Master',
        icon: '🔥',
        generateGoal: () => ({
            target: 10 + Math.floor(Math.random() * 40), // 10-50 combo
            current: 0,
            completed: false,
            reward: 15
        })
    },
    {
        id: 'speed',
        name: 'Speed Demon',
        icon: '⚡',
        generateGoal: () => ({
            target: 5 + Math.floor(Math.random() * 15), // 5-20 taps/sec
            current: 0,
            completed: false,
            reward: 20
        })
    },
    {
        id: 'rare',
        name: 'Coin Collector',
        icon: '💎',
        generateGoal: () => ({
            target: 1 + Math.floor(Math.random() * 4), // 1-5 rare coins
            current: 0,
            completed: false,
            reward: 25
        })
    },
    {
        id: 'session',
        name: 'Marathon',
        icon: '⏱️',
        generateGoal: () => ({
            target: 300 + Math.floor(Math.random() * 600), // 5-15 minutes (300-900 seconds)
            current: 0,
            completed: false,
            reward: 30
        })
    }
];

// Daily challenges state variables
let dailyChallenges = JSON.parse(localStorage.getItem('dailyChallenges') || 'null');
let dailyStreak = parseInt(localStorage.getItem('dailyStreak') || '0');
let lastDailyDate = localStorage.getItem('lastDailyDate') || null;
let dailySessionStartTime = null;

// Time Trials state
const TIME_TRIAL_CHALLENGES = [
    {
        id: 'taps_100',
        name: '100 Taps Speed Run',
        description: 'Reach 100 taps as fast as possible',
        icon: '💯',
        target: 'taps',
        targetValue: 100,
        reward: 50
    },
    {
        id: 'taps_500',
        name: '500 Taps Speed Run',
        description: 'Reach 500 taps as fast as possible',
        icon: '🔥',
        target: 'taps',
        targetValue: 500,
        reward: 150,
        unlockAt: 200 // Must have reached 200 taps before
    },
    {
        id: 'taps_1000',
        name: '1000 Taps Speed Run',
        description: 'Reach 1000 taps as fast as possible',
        icon: '👑',
        target: 'taps',
        targetValue: 1000,
        reward: 300,
        unlockAt: 500
    },
    {
        id: 'combo_50',
        name: '50 Combo Speed Run',
        description: 'Reach 50x combo as fast as possible',
        icon: '⚡',
        target: 'combo',
        targetValue: 50,
        reward: 100
    },
    {
        id: 'combo_100',
        name: '100 Combo Speed Run',
        description: 'Reach 100x combo as fast as possible',
        icon: '💎',
        target: 'combo',
        targetValue: 100,
        reward: 250,
        unlockAt: 50 // Must have reached 50 combo before
    },
    {
        id: 'speed_10',
        name: '10 Taps/sec Speed Run',
        description: 'Reach 10 taps per second as fast as possible',
        icon: '🚀',
        target: 'speed',
        targetValue: 10,
        reward: 75
    },
    {
        id: 'speed_20',
        name: '20 Taps/sec Speed Run',
        description: 'Reach 20 taps per second as fast as possible',
        icon: '⚡',
        target: 'speed',
        targetValue: 20,
        reward: 200,
        unlockAt: 15 // Must have reached 15 taps/sec before
    }
];

let timeTrialActive = false;
let currentTimeTrial = null;
let timeTrialStartTime = 0;
let timeTrialStartTapCount = 0;
let timeTrialStartCombo = 0;
let timeTrialStartSpeed = 0;
let timeTrialBestTimes = JSON.parse(localStorage.getItem('timeTrialBestTimes') || '{}'); // { challengeId: timeInMs }
let timeTrialInterval = null;

// Initialize daily challenges function
function initializeDailyChallenges() {
    const today = new Date().toDateString();
    
    // Check if it's a new day
    if (lastDailyDate !== today) {
        // Reset challenges for new day
        if (lastDailyDate) {
            // Check if streak should continue (played yesterday)
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();
            
            if (lastDailyDate === yesterdayStr) {
                // Continue streak
                dailyStreak++;
            } else {
                // Break streak
                dailyStreak = 1;
            }
        } else {
            // First time
            dailyStreak = 1;
        }
        
        // Generate new challenges
        dailyChallenges = DAILY_CHALLENGE_TYPES.map(type => ({
            type: type.id,
            name: type.name,
            icon: type.icon,
            ...type.generateGoal()
        }));
        
        lastDailyDate = today;
        localStorage.setItem('lastDailyDate', today);
        localStorage.setItem('dailyStreak', dailyStreak.toString());
        localStorage.setItem('dailyChallenges', JSON.stringify(dailyChallenges));
        
        // Reset session timer for session challenge
        dailySessionStartTime = Date.now();
    } else {
        // Same day, load existing challenges
        if (!dailyChallenges || dailyChallenges.length === 0) {
            // Fallback: generate if missing
            dailyChallenges = DAILY_CHALLENGE_TYPES.map(type => ({
                type: type.id,
                name: type.name,
                icon: type.icon,
                ...type.generateGoal()
            }));
            localStorage.setItem('dailyChallenges', JSON.stringify(dailyChallenges));
        }
        
        // Restore session start time if not set
        if (!dailySessionStartTime) {
            dailySessionStartTime = Date.now();
        }
    }
}

// Initialize stats
if (!localStorage.getItem('startTime')) {
    localStorage.setItem('startTime', startTime.toString());
}

// Initialize achievements
initializeAchievements();

// Initialize daily challenges
initializeDailyChallenges();

// Check and unlock skins
checkSkinUnlocks();
applyCoinSkin();

// Apply saved theme
function initializeTheme() {
    if (!currentTheme || currentTheme === 'default') {
        // Default theme - no class needed, already the default
        return;
    }
    
    // Try to find cosmetic to get themeId
    const cosmetic = SHOP_COSMETICS.find(c => c.id === currentTheme && c.category === 'theme');
    if (cosmetic && cosmetic.themeId) {
        applyTheme(cosmetic.themeId);
        return;
    }
    
    // Fallback: try to extract themeId from currentTheme string (handles legacy 'theme_xxx' format)
    const themeId = currentTheme.replace('theme_', '');
    if (THEMES[themeId]) {
        applyTheme(themeId);
    }
}

initializeTheme();

// Initialize sound system
initializeSoundSystem();

// Initialize session tracking
sessionStartTime = Date.now();

// Update display
updateDisplay();

// Initialize auto-tapper UI
if (tapCount >= AUTO_TAPPER_CONFIG.unlockAt) {
    autoTapperUnlocked = true;
    localStorage.setItem('autoTapperUnlocked', 'true');
}
updateAutoTapperUI();

// Initialize modals
initializeModals();

// Create particle container
const particleContainer = document.createElement('div');
particleContainer.id = 'particles';
document.body.appendChild(particleContainer);

// Coin click handler
coin.addEventListener('click', (e) => {
    // Handle mini-game taps first
    if (minigameActive && currentMinigame) {
        handleMinigameTap(e);
        return;
    }
    
    if (tapCount >= maxTaps) return;
    
    handleCoinTap(e, false);
});

// Rare coin click handler
rareCoin.addEventListener('click', (e) => {
    if (tapCount >= maxTaps || !rareCoinActive) return;
    
    handleCoinTap(e, true);
    
    // Track platinum coins
    if (rareCoinType === 'platinum') {
        platinumCoinsCaught++;
        localStorage.setItem('platinumCoinsCaught', platinumCoinsCaught.toString());
        if (platinumCoinsCaught >= 5) checkAchievement('platinum_hunter');
    }
    
    despawnRareCoin();
});

// Handle coin tap logic
function handleCoinTap(e, isRareCoin = false) {
    // Update combo
    updateCombo();
    
    // Determine tap value
    let tapValue = isRareCoin ? rareCoinValue : 1;
    
    // Apply multiplier
    tapValue *= currentMultiplier;
    
    // Apply combo bonus (combo gives bonus multiplier on top)
    // Prestige 10+ gives +50% combo bonus
    const comboMultiplier = prestigeLevel >= 10 ? COMBO_CONFIG.comboBonusMultiplier * 1.5 : COMBO_CONFIG.comboBonusMultiplier;
    const comboBonus = 1 + (comboCount * comboMultiplier / 100);
    tapValue = Math.floor(tapValue * comboBonus);
    
    // Apply prestige multiplier
    tapValue = Math.floor(tapValue * getPrestigeMultiplier());
    
    // Apply to tap count
    tapCount += tapValue;
    
    const now = Date.now();
    
    // Calculate taps per second (sliding window) - count actual taps, not multiplied
    tapHistory.push(now);
    tapHistory = tapHistory.filter(tapTime => now - tapTime < 1000);
    tapsPerSecond = tapHistory.length;
    
    if (tapsPerSecond > highestTapsPerSecond) {
        highestTapsPerSecond = tapsPerSecond;
        localStorage.setItem('highestTapsPerSecond', highestTapsPerSecond.toString());
    }
    
    // Track all-time best speed
    if (tapsPerSecond > bestAllTimeSpeed) {
        bestAllTimeSpeed = tapsPerSecond;
        localStorage.setItem('bestAllTimeSpeed', bestAllTimeSpeed.toString());
    }
    
    // Update lifetime taps (count actual taps, not multiplied values)
    totalLifetimeTaps += 1;
    if (totalLifetimeTaps % 100 === 0) { // Save every 100 taps for performance
        localStorage.setItem('totalLifetimeTaps', totalLifetimeTaps.toString());
    }
    
    // Earn skin currency (1 currency per 10 taps, rounded)
    const earnedCurrency = Math.floor(totalLifetimeTaps / 10) - Math.floor((totalLifetimeTaps - 1) / 10);
    if (earnedCurrency > 0) {
        skinCurrency += earnedCurrency;
        localStorage.setItem('skinCurrency', skinCurrency.toString());
    }
    
    lastTapTime = now;
    
    // Play tap sound
    playCoinTapSound(isRareCoin);
    
    // Animate coin with variation based on combo
    const tappedCoin = isRareCoin ? rareCoin : coin;
    animateCoinTap(tappedCoin, comboCount);
    
    // Create trail effect
    createCoinTrail(e, tappedCoin);
    
    // Create particles (enhanced effects for rare coins)
    createParticles(e, tappedCoin, currentMultiplier, isRareCoin ? rareCoinType : null);
    
    // Show tap number above coin
    const displayValue = isRareCoin ? `+${tapValue} (${rareCoinType}!)` : (tapValue > currentMultiplier ? `+${tapValue}` : null);
    showTapNumber(e, tapCount, displayValue);
    
    // Check for random multiplier drop (only on regular coin)
    if (!isRareCoin) {
        checkRandomMultiplierDrop();
        checkRareCoinSpawn();
    }
    
    // Check milestones
    checkMilestones();
    
    // Check auto-tapper unlock
    checkAutoTapperUnlock();
    
    // Check achievements
    if (tapCount === 1 && !achievements.includes('first_tap')) checkAchievement('first_tap');
    if (tapCount === 1000 && !achievements.includes('perfectionist')) checkAchievement('perfectionist');
    if (tapsPerSecond >= 20 && !achievements.includes('speed_demon')) checkAchievement('speed_demon');
    if (comboCount >= 50 && !achievements.includes('combo_master')) checkAchievement('combo_master');
    if (comboCount >= 100 && !achievements.includes('combo_king')) checkAchievement('combo_king');
    
    // Check skin unlocks
    checkSkinUnlocks();
    
    // Update daily challenges progress
    updateDailyChallengesProgress('taps', 1, tapsPerSecond, isRareCoin); // Count actual taps, not multiplied value
    
    // Track fastest 100 taps
    if (tapCount % 100 === 0 && tapCount >= 100) {
        if (fastest100StartTaps > 0) {
            const timeFor100 = Date.now() - fastest100StartTime;
            if (fastest100Taps === 0 || timeFor100 < fastest100Taps) {
                fastest100Taps = timeFor100;
                localStorage.setItem('fastest100Taps', fastest100Taps.toString());
                
                // Check speedster achievement (100 taps in under 10 seconds = 10000ms)
                if (timeFor100 < 10000 && !achievements.includes('speedster')) {
                    checkAchievement('speedster');
                }
            }
        }
        fastest100StartTaps = tapCount;
        fastest100StartTime = Date.now();
    }
    
    // Check combo king achievement
    if (comboCount >= 100 && !achievements.includes('combo_king')) {
        checkAchievement('combo_king');
    }
    
    // Update display
    updateDisplay();
    updateComboDisplay();
    checkDailyChallengeCombo();
    
    // Save to localStorage
    localStorage.setItem('tapCount', tapCount.toString());
}

// Get upgrade effects
function getUpgradeEffect(upgradeId) {
    const upgrade = SHOP_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return null;
    const level = shopUpgrades[upgradeId] || 0;
    if (level === 0) return null;
    return upgrade.effect(level);
}

// Get particle color based on cosmetic
function getParticleColor(coinType, multiplier) {
    // Use cosmetic particle color if set
    if (currentParticleColor !== 'default') {
        const cosmetic = SHOP_COSMETICS.find(c => c.id === currentParticleColor);
        if (cosmetic && cosmetic.color) {
            if (cosmetic.color === 'rainbow') {
                // Random rainbow color
                const hues = [0, 60, 120, 180, 240, 300];
                const hue = hues[Math.floor(Math.random() * hues.length)];
                return `hsla(${hue}, 100%, 50%, 0.9)`;
            }
            return cosmetic.color;
        }
    }
    
    // Default colors based on coin type
    if (coinType === 'platinum') {
        return 'rgba(230, 230, 250, 0.9)';
    } else if (coinType === 'golden') {
        return 'rgba(255, 215, 0, 0.9)';
    } else if (multiplier > 1) {
        return 'rgba(255, 215, 0, 0.9)';
    }
    return 'rgba(255, 165, 0, 0.8)';
}

// Create particle effect
function createParticles(event, element, multiplier = 1, coinType = null) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Base particle count
    let particleCount = 8;
    if (coinType === 'platinum') {
        particleCount = 20;
    } else if (coinType === 'golden') {
        particleCount = 15;
    } else if (multiplier > 1) {
        particleCount = 12;
    }
    
    // Apply particle quality upgrade
    const particleUpgrade = getUpgradeEffect('particle_quality');
    if (particleUpgrade) {
        particleCount = particleUpgrade.particleCount || particleCount;
    }
    
    const particleColor = getParticleColor(coinType, multiplier);
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.background = particleColor;
        particle.style.boxShadow = `0 0 15px ${particleColor}`;
        if (coinType === 'platinum') {
            particle.style.width = '12px';
            particle.style.height = '12px';
        }
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const baseVelocity = coinType === 'platinum' ? 100 : (coinType === 'golden' ? 80 : (multiplier > 1 ? 70 : 50));
        const velocity = baseVelocity + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particleContainer.appendChild(particle);
        
        let x = centerX;
        let y = centerY;
        let opacity = 1;
        
        const animate = () => {
            x += vx * 0.1;
            y += vy * 0.1;
            opacity -= 0.015;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Show tap number animation
function showTapNumber(event, number, multiplierText = null) {
    const tapNumber = document.createElement('div');
    tapNumber.className = 'tap-number';
    tapNumber.textContent = multiplierText || '+' + number;
    
    // Enhanced styling if multiplier is active
    if (multiplierText) {
        tapNumber.style.color = '#FFD700';
        tapNumber.style.fontSize = '2.5rem';
        tapNumber.style.textShadow = '0 0 15px rgba(255, 215, 0, 1), 0 2px 5px rgba(0, 0, 0, 0.5)';
    }
    
    const rect = coin.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 100;
    const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 100;
    
    tapNumber.style.left = x + 'px';
    tapNumber.style.top = y + 'px';
    
    document.body.appendChild(tapNumber);
    
    setTimeout(() => {
        tapNumber.style.transform = 'translateY(-50px) scale(1.5)';
        tapNumber.style.opacity = '0';
    }, 10);
    
    setTimeout(() => tapNumber.remove(), 500);
}

// Check and trigger milestones
function checkMilestones() {
    milestones.forEach(milestone => {
        if (tapCount === milestone.taps && !completedMilestones.includes(milestone.taps)) {
            completedMilestones.push(milestone.taps);
            localStorage.setItem('completedMilestones', JSON.stringify(completedMilestones));
            showMilestone(milestone.message);
            
            if (milestone.taps === maxTaps) {
        message.style.display = 'block';
                message.classList.add('celebration');
        coin.style.pointerEvents = 'none';
                coin.style.opacity = '0.6';
            }
        }
    });
}

// Show milestone notification
function showMilestone(text) {
    // Play milestone fanfare
    playMilestoneFanfare();
    
    const milestoneDiv = document.createElement('div');
    milestoneDiv.className = 'milestone-notification';
    milestoneDiv.textContent = text;
    document.body.appendChild(milestoneDiv);
    
    setTimeout(() => {
        milestoneDiv.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        milestoneDiv.classList.remove('show');
        setTimeout(() => milestoneDiv.remove(), 500);
    }, 3000);
}

// Update all displays
function updateDisplay() {
    counter.textContent = `Taps: ${tapCount.toLocaleString()}`;
    const progressPercent = Math.min((tapCount / maxTaps) * 100, 100);
    progress.style.width = `${progressPercent}%`;
    
    // Update progress text
    const progressText = document.getElementById('progress-text');
    if (progressText) {
        progressText.textContent = `${Math.floor(progressPercent)}%`;
    }
    
    // Update stats
    if (statsDisplay) {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const averageTapsPerSecond = elapsedSeconds > 0 ? (tapCount / elapsedSeconds).toFixed(2) : '0.00';
        const timeElapsed = formatTime(elapsedSeconds);
        
        statsDisplay.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Current Speed:</span>
                <span class="stat-value">${tapsPerSecond} taps/sec</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Best Speed:</span>
                <span class="stat-value">${highestTapsPerSecond} taps/sec</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Average:</span>
                <span class="stat-value">${averageTapsPerSecond} taps/sec</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Time:</span>
                <span class="stat-value">${timeElapsed}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Best Combo:</span>
                <span class="stat-value">${highestCombo}x</span>
            </div>
        `;
    }
}

// Format time
function formatTime(seconds, includeMs = false) {
    if (includeMs && seconds < 60) {
        // For time trials, show milliseconds
        return seconds.toFixed(2) + 's';
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

// Combo System Functions
function updateCombo() {
    const now = Date.now();
    
    // Get combo timeout with prestige bonus
    const comboTimeout = getComboTimeout();
    
    // Check if combo should continue (time since last tap)
    const timeSinceLastTap = now - lastTapTime;
    
    if (timeSinceLastTap <= comboTimeout) {
        // Continue combo
        comboCount++;
        if (comboCount > highestCombo) {
            highestCombo = comboCount;
            localStorage.setItem('highestCombo', highestCombo.toString());
        }
        
        // Track all-time best combo
        if (comboCount > bestAllTimeCombo) {
            bestAllTimeCombo = comboCount;
            localStorage.setItem('bestAllTimeCombo', bestAllTimeCombo.toString());
        }
        
        // Check for combo threshold effects
        checkComboThresholdEffects();
    } else {
        // Start new combo if too much time passed
        comboCount = 1;
        lastComboThreshold = 0; // Reset threshold tracking
    }
    
    // Get combo timeout with prestige bonus
    const comboTimeoutValue = getComboTimeout();
    
    // Reset combo timeout
    if (comboTimeoutHandle) {
        clearTimeout(comboTimeoutHandle);
    }
    
    // Set combo to break after inactivity (with prestige bonus)
    comboEndTime = now + comboTimeoutValue;
    comboTimeoutHandle = setTimeout(() => {
        if (comboCount > 5) {
            showMilestone(`Combo broken! Reached ${comboCount}x! 🎯`);
        }
        comboCount = 0;
        lastComboThreshold = 0; // Reset threshold tracking
        updateComboDisplay();
    }, comboTimeoutValue);
}

function updateComboDisplay() {
    if (comboCount > 0) {
        comboMeter.style.display = 'block';
        comboDisplay.textContent = `Combo: ${comboCount}x`;
        
        // Update combo bar (fill based on time remaining)
        const now = Date.now();
        const comboTimeout = getComboTimeout();
        const timeRemaining = Math.max(0, comboEndTime - now);
        const fillPercent = (timeRemaining / comboTimeout) * 100;
        comboFill.style.width = `${fillPercent}%`;
        
        // Color based on combo level
        if (comboCount >= 100) {
            comboFill.style.background = 'linear-gradient(90deg, #FFD700, #FF6B00, #FFD700)';
            comboDisplay.style.color = '#FFD700';
            comboDisplay.style.textShadow = '0 0 20px rgba(255, 215, 0, 1), 0 0 40px rgba(255, 140, 0, 0.8)';
        } else if (comboCount >= 50) {
            comboFill.style.background = 'linear-gradient(90deg, #FFD700, #FFA500)';
            comboDisplay.style.color = '#FFD700';
            comboDisplay.style.textShadow = '0 0 15px rgba(255, 215, 0, 0.8)';
        } else if (comboCount >= 30) {
            comboFill.style.background = 'linear-gradient(90deg, #FF6B6B, #FF8E53)';
            comboDisplay.style.color = '#FF6B6B';
            comboDisplay.style.textShadow = '0 0 10px rgba(255, 107, 107, 0.6)';
        } else if (comboCount >= 20) {
            comboFill.style.background = 'linear-gradient(90deg, #FF6B6B, #FF8E53)';
            comboDisplay.style.color = '#FF6B6B';
            comboDisplay.style.textShadow = '0 0 8px rgba(255, 107, 107, 0.5)';
        } else if (comboCount >= 10) {
            comboFill.style.background = 'linear-gradient(90deg, #4ECDC4, #44A08D)';
            comboDisplay.style.color = '#4ECDC4';
            comboDisplay.style.textShadow = '0 0 5px rgba(78, 205, 196, 0.5)';
        } else {
            comboFill.style.background = 'linear-gradient(90deg, #667eea, #764ba2)';
            comboDisplay.style.color = '#667eea';
            comboDisplay.style.textShadow = '0 0 5px rgba(102, 126, 234, 0.5)';
        }
        
        // Update coin transformation based on current combo level
        updateCoinComboTransform();
        
        // Check daily challenge combo progress
        checkDailyChallengeCombo();
    } else {
        comboMeter.style.display = 'none';
        // Reset coin transformation when combo breaks
        coin.style.transform = '';
        coin.classList.remove('combo-effect-active');
        coin.removeAttribute('data-combo-level');
        if (comboDisplay) comboDisplay.style.textShadow = '';
        
        // Reset coin size to base
        coin.style.width = '220px';
        coin.style.height = '220px';
    }
}

// Combo Effects Functions
function checkComboThresholdEffects() {
    // Find the highest threshold we've reached
    const threshold = COMBO_EFFECTS_CONFIG.thresholds
        .filter(t => comboCount >= t.combo && t.combo > lastComboThreshold)
        .sort((a, b) => b.combo - a.combo)[0];
    
    if (threshold) {
        lastComboThreshold = threshold.combo;
        triggerComboEffect(threshold);
        showMilestone(`${threshold.name}! ${comboCount}x Combo! 🔥`);
    }
}

function triggerComboEffect(threshold) {
    // Screen shake
    if (threshold.shake) {
        screenShake(threshold.shakeIntensity || 5, COMBO_EFFECTS_CONFIG.shakeDuration);
    }
    
    // Color flash
    if (threshold.flash) {
        colorFlash(threshold.flash, COMBO_EFFECTS_CONFIG.flashDuration);
    }
    
    // Coin transformation
    if (threshold.transform) {
        coinTransform(threshold.transform, COMBO_EFFECTS_CONFIG.transformDuration);
    }
    
    // Add animation class to combo display
    if (comboDisplay) {
        comboDisplay.classList.add('combo-threshold-hit');
        setTimeout(() => {
            comboDisplay.classList.remove('combo-threshold-hit');
        }, 500);
    }
}

function screenShake(intensity, duration) {
    const container = document.getElementById('container');
    if (!container) return;
    
    let startTime = Date.now();
    const originalTransform = container.style.transform || '';
    
    const shake = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
            const progress = elapsed / duration;
            const currentIntensity = intensity * (1 - progress); // Decrease over time
            
            const x = (Math.random() - 0.5) * currentIntensity;
            const y = (Math.random() - 0.5) * currentIntensity;
            
            container.style.transform = `translate(${x}px, ${y}px)`;
            requestAnimationFrame(shake);
        } else {
            container.style.transform = originalTransform;
        }
    };
    
    shake();
}

function colorFlash(color, duration) {
    const flashOverlay = document.createElement('div');
    flashOverlay.className = 'combo-flash-overlay';
    flashOverlay.style.backgroundColor = color;
    flashOverlay.style.opacity = '0';
    flashOverlay.style.pointerEvents = 'none';
    document.body.appendChild(flashOverlay);
    
    // Flash in
    requestAnimationFrame(() => {
        flashOverlay.style.transition = `opacity ${duration / 2}ms ease-out`;
        flashOverlay.style.opacity = '1';
        
        // Flash out
        setTimeout(() => {
            flashOverlay.style.transition = `opacity ${duration / 2}ms ease-in`;
            flashOverlay.style.opacity = '0';
            
            setTimeout(() => {
                flashOverlay.remove();
            }, duration / 2);
        }, duration / 2);
    });
}

function coinTransform(transform, duration) {
    coin.classList.add('combo-effect-active');
    
    // Set combo level for CSS animations
    if (comboCount >= 75) {
        coin.setAttribute('data-combo-level', 'high');
    } else if (comboCount >= 30) {
        coin.setAttribute('data-combo-level', 'medium');
    } else {
        coin.removeAttribute('data-combo-level');
    }
    
    coin.style.transition = `transform ${duration}ms ease-out`;
    coin.style.transform = transform;
    
    // Keep transform applied while in combo (don't reset after duration)
    // The transform will persist until combo breaks or next threshold is reached
}

function updateCoinComboTransform() {
    // Find the highest threshold we've reached
    const currentThreshold = COMBO_EFFECTS_CONFIG.thresholds
        .filter(t => comboCount >= t.combo)
        .sort((a, b) => b.combo - a.combo)[0];
    
    if (currentThreshold && currentThreshold.transform) {
        coin.classList.add('combo-effect-active');
        
        // Set combo level for CSS animations
        if (comboCount >= 75) {
            coin.setAttribute('data-combo-level', 'high');
        } else if (comboCount >= 30) {
            coin.setAttribute('data-combo-level', 'medium');
        } else {
            coin.removeAttribute('data-combo-level');
        }
        
        // Apply transform with smooth transition
        coin.style.transition = 'transform 0.2s ease-out';
        coin.style.transform = currentThreshold.transform;
    }
    
    // Update coin size based on combo
    updateCoinSizeByCombo();
}

// Coin animation variations
function animateCoinTap(coinElement, combo) {
    // Remove any existing animation classes
    coinElement.classList.remove('coin-clicked', 'spin-pattern-1', 'spin-pattern-2', 'spin-pattern-3', 'spin-pattern-4');
    
    // Choose spin pattern based on combo or random
    let spinPattern = 'coin-clicked'; // Default
    if (combo >= 50) {
        // High combo: use pattern 4 (most dramatic)
        spinPattern = 'spin-pattern-4';
    } else if (combo >= 30) {
        // Medium combo: use pattern 3
        spinPattern = 'spin-pattern-3';
    } else if (combo >= 10) {
        // Low combo: use pattern 2
        spinPattern = 'spin-pattern-2';
    } else {
        // Very low combo: random between default and pattern 1
        spinPattern = Math.random() < 0.5 ? 'coin-clicked' : 'spin-pattern-1';
    }
    
    coinElement.classList.add(spinPattern);
    
    // Remove animation class after animation completes
    const animationDuration = combo >= 50 ? 200 : combo >= 30 ? 180 : 150;
    setTimeout(() => {
        coinElement.classList.remove(spinPattern);
    }, animationDuration);
}

// Update coin size based on combo
function updateCoinSizeByCombo() {
    const baseSize = 220; // Base size in pixels
    let scale = 1;
    
    if (comboCount >= 100) {
        scale = 1.3; // 30% larger at 100+ combo
    } else if (comboCount >= 75) {
        scale = 1.25; // 25% larger at 75+ combo
    } else if (comboCount >= 50) {
        scale = 1.2; // 20% larger at 50+ combo
    } else if (comboCount >= 30) {
        scale = 1.15; // 15% larger at 30+ combo
    } else if (comboCount >= 10) {
        scale = 1.1; // 10% larger at 10+ combo
    } else if (comboCount > 0) {
        scale = 1.05; // 5% larger at any combo
    }
    
    // Apply size with smooth transition
    coin.style.transition = 'width 0.3s ease-out, height 0.3s ease-out';
    coin.style.width = `${baseSize * scale}px`;
    coin.style.height = `${baseSize * scale}px`;
    
    // Reset size when combo breaks (handled in updateComboDisplay when comboCount becomes 0)
}

// Create trail effect when coin is tapped
function createCoinTrail(event, coinElement) {
    if (!coinElement) return;
    
    const rect = coinElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create multiple trail particles
    const trailCount = Math.min(Math.floor(comboCount / 5) + 3, 12); // More trails at higher combos, max 12
    
    for (let i = 0; i < trailCount; i++) {
        setTimeout(() => {
            const trail = document.createElement('div');
            trail.className = 'coin-trail';
            
            // Random position around coin
            const angle = (Math.PI * 2 * i) / trailCount;
            const distance = 30 + Math.random() * 20;
            const startX = centerX + Math.cos(angle) * distance;
            const startY = centerY + Math.sin(angle) * distance;
            
            // Random end position (further out)
            const endDistance = 80 + Math.random() * 40;
            const endX = centerX + Math.cos(angle) * endDistance;
            const endY = centerY + Math.sin(angle) * endDistance;
            
            trail.style.left = `${startX}px`;
            trail.style.top = `${startY}px`;
            
            // Color based on combo
            let trailColor = '#FFD700'; // Gold default
            if (comboCount >= 75) {
                trailColor = '#FF1493'; // Deep pink
            } else if (comboCount >= 50) {
                trailColor = '#FF4500'; // Orange red
            } else if (comboCount >= 30) {
                trailColor = '#FFD700'; // Gold
            } else if (comboCount >= 10) {
                trailColor = '#FFA500'; // Orange
            }
            
            trail.style.background = `radial-gradient(circle, ${trailColor}, transparent)`;
            trail.style.boxShadow = `0 0 ${10 + comboCount / 2}px ${trailColor}`;
            
            document.body.appendChild(trail);
            
            // Animate trail
            requestAnimationFrame(() => {
                trail.style.transition = `all ${0.4 + Math.random() * 0.2}s ease-out`;
                trail.style.left = `${endX}px`;
                trail.style.top = `${endY}px`;
                trail.style.opacity = '0';
                trail.style.transform = `scale(${0.3 + Math.random() * 0.3})`;
            });
            
            // Remove trail after animation
            setTimeout(() => {
                if (trail.parentNode) {
                    trail.remove();
                }
            }, 600);
        }, i * 20); // Stagger trail creation
    }
}

// Rare Coin Functions
function checkRareCoinSpawn() {
    const now = Date.now();
    
    // Check cooldown
    if (now - lastRareCoinSpawn < RARE_COIN_CONFIG.spawnCooldown) {
        return;
    }
    
    // Check if rare coin is already active
    if (rareCoinActive) {
        return;
    }
    
    // Random chance to spawn (prestige 5+ gives +50% spawn chance)
    let spawnChance = RARE_COIN_CONFIG.spawnChance;
    if (prestigeLevel >= 5) {
        spawnChance *= 1.5;
    }
    if (Math.random() < spawnChance) {
        spawnRareCoin();
        lastRareCoinSpawn = now;
    }
}

function spawnRareCoin() {
    // Determine coin type
    const isPlatinum = Math.random() > RARE_COIN_CONFIG.goldenChance;
    rareCoinType = isPlatinum ? 'platinum' : 'golden';
    rareCoinValue = isPlatinum ? RARE_COIN_CONFIG.platinumValue : RARE_COIN_CONFIG.goldenValue;
    
    rareCoinActive = true;
    rareCoinEndTime = Date.now() + RARE_COIN_CONFIG.duration;
    
    // Update visual
    rareCoin.classList.add(`rare-coin-${rareCoinType}`);
    rareCoin.classList.add('rare-coin-spawn');
    rareCoin.style.display = 'block';
    
    // Show spawn notification
    const coinTypeEmoji = isPlatinum ? '💎' : '🪙';
    showMilestone(`${coinTypeEmoji} ${rareCoinType.charAt(0).toUpperCase() + rareCoinType.slice(1)} Coin Appeared! ${rareCoinValue}x value!`);
    
    // Auto despawn after duration
    setTimeout(() => {
        if (rareCoinActive) {
            despawnRareCoin();
        }
    }, RARE_COIN_CONFIG.duration);
    
    // Start pulsing animation and position
    animateRareCoin();
    updateRareCoinPosition();
}

function despawnRareCoin() {
    rareCoinActive = false;
    rareCoin.classList.remove('rare-coin-spawn', 'rare-coin-golden', 'rare-coin-platinum');
    rareCoin.style.display = 'none';
    rareCoin.style.animation = '';
}

function animateRareCoin() {
    if (!rareCoinActive) return;
    
    rareCoin.style.animation = 'rareCoinPulse 1.5s ease-in-out infinite';
    
    // Position near regular coin (using relative positioning)
    // The coin is positioned in the flow, we just need to ensure it's visible
    updateRareCoinPosition();
}

function updateRareCoinPosition() {
    if (!rareCoinActive) return;
    
    // Position next to regular coin (this works better with relative/absolute positioning)
    // Since rare coin is in the container flow, we can use transform to position it
    const coinRect = coin.getBoundingClientRect();
    const containerRect = document.getElementById('container').getBoundingClientRect();
    const offsetX = coinRect.left - containerRect.left + coinRect.width + 30;
    const offsetY = coinRect.top - containerRect.top;
    
    rareCoin.style.position = 'absolute';
    rareCoin.style.left = `${offsetX}px`;
    rareCoin.style.top = `${offsetY}px`;
}

// Update rare coin position on window resize
window.addEventListener('resize', () => {
    if (rareCoinActive) {
        updateRareCoinPosition();
    }
});

// Auto-Tapper Functions
function checkAutoTapperUnlock() {
    // Prestige level 1+ always has auto-tapper unlocked
    if (prestigeLevel >= 1 && !autoTapperUnlocked) {
        autoTapperUnlocked = true;
        localStorage.setItem('autoTapperUnlocked', 'true');
        updateAutoTapperUI();
    } else if (!autoTapperUnlocked && tapCount >= AUTO_TAPPER_CONFIG.unlockAt) {
        autoTapperUnlocked = true;
        localStorage.setItem('autoTapperUnlocked', 'true');
        updateAutoTapperUI();
        showMilestone('⚡ Auto-Tapper Unlocked!');
    }
}

function updateAutoTapperUI() {
    if (!autoTapperUnlocked) {
        autoTapperBtn.disabled = true;
        autoTapperStatus.textContent = `Unlock at ${AUTO_TAPPER_CONFIG.unlockAt} taps`;
        autoTapperTimer.textContent = '';
    } else if (autoTapperActive) {
        autoTapperBtn.classList.add('active');
        autoTapperText.textContent = 'Auto-Tapping...';
        autoTapperStatus.textContent = 'Automatically tapping for you!';
    } else {
        autoTapperBtn.disabled = false;
        autoTapperBtn.classList.remove('active');
        autoTapperText.textContent = 'Auto-Tapper';
        autoTapperStatus.textContent = 'Click to activate (20 seconds)';
        autoTapperTimer.textContent = '';
        autoTapperTimer.classList.remove('active');
    }
}

function activateAutoTapper() {
    if (autoTapperActive || tapCount >= maxTaps) return;
    
    autoTapperActive = true;
    autoTapperEndTime = Date.now() + AUTO_TAPPER_CONFIG.duration;
    updateAutoTapperUI();
    
    // Simulate clicks at regular intervals (faster with prestige)
    const tapInterval = getAutoTapperInterval();
    autoTapperInterval = setInterval(() => {
        if (Date.now() >= autoTapperEndTime || tapCount >= maxTaps) {
            deactivateAutoTapper();
            return;
        }
        
        // Simulate a tap
        const fakeEvent = {
            clientX: coin.getBoundingClientRect().left + coin.offsetWidth / 2,
            clientY: coin.getBoundingClientRect().top + coin.offsetHeight / 2
        };
        
        // Apply multipliers and bonuses (same as manual tap)
        let tapValue = currentMultiplier;
        const comboMultiplier = prestigeLevel >= 10 ? COMBO_CONFIG.comboBonusMultiplier * 1.5 : COMBO_CONFIG.comboBonusMultiplier;
        const comboBonus = 1 + (comboCount * comboMultiplier / 100);
        tapValue = Math.floor(tapValue * comboBonus * getPrestigeMultiplier());
        tapCount += tapValue;
        const now = Date.now();
        
        // Update tap history
        tapHistory.push(now);
        tapHistory = tapHistory.filter(tapTime => now - tapTime < 1000);
        tapsPerSecond = tapHistory.length;
        
        if (tapsPerSecond > highestTapsPerSecond) {
            highestTapsPerSecond = tapsPerSecond;
            localStorage.setItem('highestTapsPerSecond', highestTapsPerSecond.toString());
        }
        
        lastTapTime = now;
        
        // Animate coin with variation (reduced effects for auto-tapper)
        animateCoinTap(coin, comboCount);
        
        // Create trail effect (less frequent for auto-tapper to avoid spam)
        if (Math.random() < 0.2) { // Only 20% of auto-taps get trails
            createCoinTrail(fakeEvent, coin);
        }
        
        // Create particles
        createParticles(fakeEvent, coin, currentMultiplier);
        
        // Show tap number
        showTapNumber(fakeEvent, tapCount, tapValue > 1 ? `+${tapValue}` : null);
        
        // Check for random multiplier drop
        checkRandomMultiplierDrop();
        
        // Check for rare coin spawn
        checkRareCoinSpawn();
        
        // Check milestones
        checkMilestones();
        checkAutoTapperUnlock();
        
        // Update display
        updateDisplay();
        
        // Save to localStorage
        localStorage.setItem('tapCount', tapCount.toString());
    }, tapInterval);
    
    // Update timer display
    updateAutoTapperTimer();
}

function deactivateAutoTapper() {
    autoTapperActive = false;
    if (autoTapperInterval) {
        clearInterval(autoTapperInterval);
        autoTapperInterval = null;
    }
    updateAutoTapperUI();
    showMilestone('Auto-Tapper finished! 💫');
}

function updateAutoTapperTimer() {
    if (!autoTapperActive) return;
    
    const remaining = Math.max(0, autoTapperEndTime - Date.now());
    const seconds = Math.ceil(remaining / 1000);
    
    if (remaining > 0) {
        autoTapperTimer.textContent = `${seconds}s remaining`;
        autoTapperTimer.classList.add('active');
        setTimeout(updateAutoTapperTimer, 100);
    } else {
        autoTapperTimer.textContent = '';
        autoTapperTimer.classList.remove('active');
    }
}

// Auto-Tapper button click handler
autoTapperBtn.addEventListener('click', () => {
    if (!autoTapperUnlocked || autoTapperActive || tapCount >= maxTaps) return;
    activateAutoTapper();
});

// Multiplier Functions
function activateMultiplier(multiplier) {
    if (tapCount >= maxTaps) return;
    
    currentMultiplier = multiplier;
    multiplierActive = true;
    
    // Apply prestige unlock bonus: +20% duration at prestige 3+
    const baseDuration = MULTIPLIER_CONFIG[multiplier].duration;
    const durationBonus = prestigeLevel >= 3 ? 1.2 : 1.0;
    multiplierEndTime = Date.now() + (baseDuration * durationBonus);
    
    updateMultiplierUI();
    updateMultiplierTimer();
    
    // Visual feedback
    coin.classList.add('multiplier-active');
    showMilestone(`${multiplier}x Multiplier Activated! ✨`);
}

function deactivateMultiplier() {
    currentMultiplier = 1;
    multiplierActive = false;
    coin.classList.remove('multiplier-active');
    updateMultiplierUI();
}

function checkRandomMultiplierDrop() {
    if (multiplierActive) return; // Don't drop if already active
    
    // Check each multiplier tier for random drop
    for (const [multiplier, config] of Object.entries(MULTIPLIER_CONFIG)) {
        if (Math.random() < config.dropChance) {
            activateMultiplier(parseInt(multiplier));
            return; // Only one multiplier at a time
        }
    }
}

function updateMultiplierUI() {
    if (multiplierActive) {
        activeMultiplierDisplay.textContent = `${currentMultiplier}x MULTIPLIER ACTIVE! 🔥`;
        activeMultiplierDisplay.classList.add('active');
        multiplierButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('disabled');
        });
    } else {
        activeMultiplierDisplay.textContent = '';
        activeMultiplierDisplay.classList.remove('active');
        multiplierButtons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('disabled');
        });
    }
}

function updateMultiplierTimer() {
    if (!multiplierActive) {
        multiplierTimer.textContent = '';
        multiplierTimer.classList.remove('active');
        return;
    }
    
    const remaining = Math.max(0, multiplierEndTime - Date.now());
    const seconds = Math.ceil(remaining / 1000);
    
    if (remaining > 0) {
        multiplierTimer.textContent = `${seconds}s remaining`;
        multiplierTimer.classList.add('active');
        setTimeout(updateMultiplierTimer, 100);
    } else {
        deactivateMultiplier();
        showMilestone('Multiplier expired! 💫');
    }
}

// Initialize multiplier UI
updateMultiplierUI();

// Multiplier button click handlers
multiplierButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (multiplierActive || tapCount >= maxTaps) return;
        const multiplier = parseInt(btn.dataset.multiplier);
        activateMultiplier(multiplier);
    });
});

// Prestige System Functions
function initializeModals() {
    // Modal close buttons
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Feature button handlers
    prestigeBtn.addEventListener('click', () => {
        updatePrestigeModal();
        prestigeModal.style.display = 'block';
    });
    
    achievementsBtn.addEventListener('click', () => {
        updateAchievementsModal();
        achievementsModal.style.display = 'block';
    });
    
    leaderboardBtn.addEventListener('click', () => {
        updateLeaderboardModal();
        leaderboardModal.style.display = 'block';
    });
    
    skinsBtn.addEventListener('click', () => {
        updateSkinsModal();
        skinsModal.style.display = 'block';
    });
    
    minigamesBtn.addEventListener('click', () => {
        updateMinigamesModal();
        minigamesModal.style.display = 'block';
    });
    
    dailyBtn.addEventListener('click', () => {
        updateDailyModal();
        dailyModal.style.display = 'block';
    });
    
    shopBtn.addEventListener('click', () => {
        updateShopModal();
        if (shopModal) {
            shopModal.style.display = 'block';
        }
    });
    
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (shareModal) {
                shareModal.style.display = 'block';
            }
        });
    }
    
    if (timetrialBtn) {
        timetrialBtn.addEventListener('click', () => {
            updateTimeTrialModal();
            if (timetrialModal) {
                timetrialModal.style.display = 'block';
            }
        });
    }
    
    // Shop tab switching
    document.querySelectorAll('.shop-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update tab buttons
            document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update sections
            document.querySelectorAll('.shop-section').forEach(s => s.classList.remove('active'));
            document.getElementById(`shop-${targetTab}`).classList.add('active');
        });
    });
    
    confirmPrestigeBtn.addEventListener('click', performPrestige);
    
    // Share button handlers
    initializeShareButtons();
}

// Share Functions
function initializeShareButtons() {
    const shareScreenshotBtn = document.getElementById('share-screenshot-btn');
    const shareStatsBtn = document.getElementById('share-stats-btn');
    const shareTwitterBtn = document.getElementById('share-twitter-btn');
    const shareFacebookBtn = document.getElementById('share-facebook-btn');
    const shareWhatsappBtn = document.getElementById('share-whatsapp-btn');
    const copyStatsBtn = document.getElementById('copy-stats-btn');
    
    if (shareScreenshotBtn) {
        shareScreenshotBtn.addEventListener('click', takeScreenshot);
    }
    
    if (shareStatsBtn) {
        shareStatsBtn.addEventListener('click', shareStatsText);
    }
    
    if (shareTwitterBtn) {
        shareTwitterBtn.addEventListener('click', shareToTwitter);
    }
    
    if (shareFacebookBtn) {
        shareFacebookBtn.addEventListener('click', shareToFacebook);
    }
    
    if (shareWhatsappBtn) {
        shareWhatsappBtn.addEventListener('click', shareToWhatsApp);
    }
    
    if (copyStatsBtn) {
        copyStatsBtn.addEventListener('click', copyStatsToClipboard);
    }
}

function getStatsText() {
    const stats = {
        taps: tapCount.toLocaleString(),
        bestSpeed: highestTapsPerSecond.toFixed(1),
        highestCombo: highestCombo,
        prestigeLevel: prestigeLevel,
        achievements: achievements.length,
        totalAchievements: ACHIEVEMENTS.length,
        totalPlayTime: formatTime(totalPlayTime),
        sessionTime: formatTime(Math.floor((Date.now() - sessionStartTime) / 1000))
    };
    
    return `🎮 ZERO Coin Game Stats 🎮

💯 Total Taps: ${stats.taps}
⚡ Best Speed: ${stats.bestSpeed} taps/sec
🔥 Highest Combo: ${stats.highestCombo}x
🏆 Prestige Level: ${stats.prestigeLevel}
🎖️ Achievements: ${stats.achievements}/${stats.totalAchievements}
⏱️ Total Play Time: ${stats.totalPlayTime}
🎯 Session Time: ${stats.sessionTime}

#ZeroCoin #TappingGame #IdleGame`;
}

function takeScreenshot() {
    try {
        // Use html2canvas if available
        if (typeof html2canvas !== 'undefined') {
            const container = document.getElementById('container');
            if (!container) {
                createStatsImage();
                return;
            }
            
            html2canvas(container, {
                backgroundColor: getComputedStyle(document.body).backgroundColor,
                scale: 2
            }).then(canvas => {
                canvas.toBlob(blob => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `zero-coin-stats-${Date.now()}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                    showMilestone('Screenshot saved! 📸');
                });
            });
        } else {
            // Fallback: Create stats image manually
            createStatsImage();
        }
    } catch (e) {
        console.error('Error taking screenshot:', e);
        createStatsImage();
    }
}

function createStatsImage() {
    // Create a canvas with stats
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎮 ZERO Coin Game', canvas.width / 2, 60);
    
    // Stats
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '32px Arial';
    const stats = [
        `💯 Total Taps: ${tapCount.toLocaleString()}`,
        `⚡ Best Speed: ${highestTapsPerSecond.toFixed(1)} taps/sec`,
        `🔥 Highest Combo: ${highestCombo}x`,
        `🏆 Prestige Level: ${prestigeLevel}`,
        `🎖️ Achievements: ${achievements.length}/${ACHIEVEMENTS.length}`,
        `⏱️ Total Play Time: ${formatTime(totalPlayTime)}`
    ];
    
    let y = 150;
    stats.forEach(stat => {
        ctx.fillText(stat, canvas.width / 2, y);
        y += 60;
    });
    
    // Convert to blob and download
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `zero-coin-stats-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        showMilestone('Stats image saved! 📸');
    });
}

function shareStatsText() {
    const text = getStatsText();
    if (navigator.share) {
        navigator.share({
            title: 'ZERO Coin Game Stats',
            text: text
        }).then(() => {
            showMilestone('Shared successfully! 📤');
        }).catch(() => {
            copyStatsToClipboard();
        });
    } else {
        copyStatsToClipboard();
    }
}

function shareToTwitter() {
    const text = getStatsText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=550,height=420');
    showMilestone('Opening Twitter... 🐦');
}

function shareToFacebook() {
    const text = getStatsText();
    const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=550,height=420');
    showMilestone('Opening Facebook... 📘');
}

function shareToWhatsApp() {
    const text = getStatsText();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    showMilestone('Opening WhatsApp... 💬');
}

function copyStatsToClipboard() {
    const text = getStatsText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showMilestone('Stats copied to clipboard! 📋');
        }).catch(() => {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showMilestone('Stats copied to clipboard! 📋');
    } catch (err) {
        showMilestone('Could not copy. Please select and copy manually.');
    }
    
    document.body.removeChild(textArea);
}

// Time Trials Functions
function updateTimeTrialModal() {
    const timetrialList = document.getElementById('timetrial-list');
    const timetrialStatus = document.getElementById('timetrial-status');
    const timetrialLeaderboard = document.getElementById('timetrial-leaderboard-content');
    
    if (!timetrialList) return;
    
    if (timeTrialActive && currentTimeTrial) {
        // Show active trial status
        timetrialList.style.display = 'none';
        timetrialStatus.style.display = 'block';
        updateTimeTrialStatus();
    } else {
        // Show challenge list
        timetrialList.style.display = 'block';
        timetrialStatus.style.display = 'none';
        
        timetrialList.innerHTML = TIME_TRIAL_CHALLENGES.map(challenge => {
            const bestTime = timeTrialBestTimes[challenge.id];
            const isUnlocked = !challenge.unlockAt || 
                (challenge.target === 'taps' && tapCount >= challenge.unlockAt) ||
                (challenge.target === 'combo' && highestCombo >= challenge.unlockAt) ||
                (challenge.target === 'speed' && highestTapsPerSecond >= challenge.unlockAt);
            
            let bestTimeText = bestTime ? formatTime(bestTime / 1000, true) : 'No record';
            let statusText = isUnlocked ? '' : `🔒 Unlock at ${challenge.target === 'taps' ? challenge.unlockAt + ' taps' : challenge.target === 'combo' ? challenge.unlockAt + 'x combo' : challenge.unlockAt + ' taps/sec'}`;
            
            return `
                <div class="timetrial-item ${isUnlocked ? '' : 'locked'}">
                    <div class="timetrial-icon">${challenge.icon}</div>
                    <div class="timetrial-info">
                        <div class="timetrial-name">${challenge.name}</div>
                        <div class="timetrial-description">${challenge.description}</div>
                        <div class="timetrial-best">🏆 Best: ${bestTimeText}</div>
                        ${statusText ? `<div class="timetrial-status-text">${statusText}</div>` : ''}
                    </div>
                    <button class="timetrial-start-btn ${isUnlocked ? '' : 'disabled'}" 
                            data-challenge="${challenge.id}" 
                            ${isUnlocked ? '' : 'disabled'}>
                        ${isUnlocked ? 'Start' : '🔒'}
                    </button>
                </div>
            `;
        }).join('');
        
        // Add click handlers
        document.querySelectorAll('.timetrial-start-btn:not(.disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                const challengeId = btn.dataset.challenge;
                startTimeTrial(challengeId);
            });
        });
    }
    
    // Update leaderboard
    if (timetrialLeaderboard) {
        const sortedChallenges = TIME_TRIAL_CHALLENGES.filter(c => timeTrialBestTimes[c.id])
            .sort((a, b) => {
                const timeA = timeTrialBestTimes[a.id];
                const timeB = timeTrialBestTimes[b.id];
                return timeA - timeB;
            });
        
        if (sortedChallenges.length === 0) {
            timetrialLeaderboard.innerHTML = '<p>No records yet. Complete a time trial to set a record!</p>';
        } else {
            timetrialLeaderboard.innerHTML = sortedChallenges.map((challenge, index) => {
                const time = timeTrialBestTimes[challenge.id];
                return `
                    <div class="timetrial-leaderboard-item">
                        <div class="timetrial-leaderboard-rank">#${index + 1}</div>
                        <div class="timetrial-leaderboard-info">
                            <div class="timetrial-leaderboard-name">${challenge.icon} ${challenge.name}</div>
                            <div class="timetrial-leaderboard-time">${formatTime(time / 1000, true)}</div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

function startTimeTrial(challengeId) {
    if (timeTrialActive || minigameActive) {
        showMilestone('Finish current challenge first!');
        return;
    }
    
    const challenge = TIME_TRIAL_CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) return;
    
    // Check if unlocked
    if (challenge.unlockAt) {
        const isUnlocked = 
            (challenge.target === 'taps' && tapCount >= challenge.unlockAt) ||
            (challenge.target === 'combo' && highestCombo >= challenge.unlockAt) ||
            (challenge.target === 'speed' && highestTapsPerSecond >= challenge.unlockAt);
        if (!isUnlocked) return;
    }
    
    timeTrialActive = true;
    currentTimeTrial = challenge;
    timeTrialStartTime = Date.now();
    timeTrialStartTapCount = tapCount;
    timeTrialStartCombo = comboCount;
    timeTrialStartSpeed = tapsPerSecond;
    
    // Reset progress for this trial
    if (challenge.target === 'taps') {
        tapCount = 0; // Start from 0 for tap challenges
    } else if (challenge.target === 'combo') {
        comboCount = 0;
        lastComboThreshold = 0;
    }
    
    updateTimeTrialModal();
    updateDisplay();
    showMilestone(`Time Trial Started: ${challenge.name} ⏱️`);
    
    // Start update interval
    if (timeTrialInterval) clearInterval(timeTrialInterval);
    timeTrialInterval = setInterval(() => {
        checkTimeTrialProgress();
        updateTimeTrialStatus();
    }, 50); // Update every 50ms for smooth timer
}

function checkTimeTrialProgress() {
    if (!timeTrialActive || !currentTimeTrial) return;
    
    const challenge = currentTimeTrial;
    let targetReached = false;
    
    if (challenge.target === 'taps') {
        targetReached = tapCount >= challenge.targetValue;
    } else if (challenge.target === 'combo') {
        targetReached = comboCount >= challenge.targetValue;
    } else if (challenge.target === 'speed') {
        targetReached = tapsPerSecond >= challenge.targetValue;
    }
    
    if (targetReached) {
        completeTimeTrial();
    }
}

function completeTimeTrial() {
    if (!timeTrialActive || !currentTimeTrial) return;
    
    const challenge = currentTimeTrial;
    const elapsedTime = Date.now() - timeTrialStartTime;
    const previousBest = timeTrialBestTimes[challenge.id];
    
    // Restore original stats
    if (challenge.target === 'taps') {
        tapCount = timeTrialStartTapCount;
    }
    
    // Check if new record
    let isNewRecord = !previousBest || elapsedTime < previousBest;
    
    if (isNewRecord) {
        timeTrialBestTimes[challenge.id] = elapsedTime;
        localStorage.setItem('timeTrialBestTimes', JSON.stringify(timeTrialBestTimes));
        showMilestone(`🏆 NEW RECORD! ${challenge.name} - ${formatTime(elapsedTime / 1000, true)}!`);
        
        // Award reward
        skinCurrency += challenge.reward * 2; // Double reward for new record
        localStorage.setItem('skinCurrency', skinCurrency.toString());
    } else {
        // Award normal reward
        skinCurrency += challenge.reward;
        localStorage.setItem('skinCurrency', skinCurrency.toString());
        showMilestone(`Time Trial Complete! ${formatTime(elapsedTime / 1000, true)} (+${challenge.reward}💰)`);
    }
    
    // Stop trial
    timeTrialActive = false;
    currentTimeTrial = null;
    if (timeTrialInterval) {
        clearInterval(timeTrialInterval);
        timeTrialInterval = null;
    }
    
    updateDisplay();
    updateTimeTrialModal();
}

function updateTimeTrialStatus() {
    if (!timeTrialActive || !currentTimeTrial) return;
    
    const challengeNameEl = document.getElementById('timetrial-challenge-name');
    const timerEl = document.getElementById('timetrial-timer');
    const progressEl = document.getElementById('timetrial-progress');
    
    if (challengeNameEl) {
        challengeNameEl.textContent = currentTimeTrial.name;
    }
    
    if (timerEl) {
        const elapsed = (Date.now() - timeTrialStartTime) / 1000;
        timerEl.textContent = formatTime(elapsed, true);
    }
    
    if (progressEl) {
        let current = 0;
        let target = currentTimeTrial.targetValue;
        
        if (currentTimeTrial.target === 'taps') {
            current = tapCount;
        } else if (currentTimeTrial.target === 'combo') {
            current = comboCount;
        } else if (currentTimeTrial.target === 'speed') {
            current = tapsPerSecond;
        }
        
        const progressPercent = Math.min((current / target) * 100, 100);
        progressEl.innerHTML = `
            <div class="timetrial-progress-text">
                Progress: ${current} / ${target} ${currentTimeTrial.target === 'taps' ? 'taps' : currentTimeTrial.target === 'combo' ? 'combo' : 'taps/sec'}
            </div>
            <div class="timetrial-progress-bar">
                <div class="timetrial-progress-fill" style="width: ${progressPercent}%"></div>
            </div>
        `;
    }
}

function updatePrestigeModal() {
    const prestigeLevelEl = document.getElementById('prestige-level');
    const prestigeMultiplierEl = document.getElementById('prestige-multiplier');
    const prestigeSpeedEl = document.getElementById('prestige-speed');
    const prestigeGainEl = document.getElementById('prestige-gain');
    
    if (prestigeLevelEl) prestigeLevelEl.textContent = prestigeLevel;
    if (prestigeMultiplierEl) {
        const bonus = (prestigePoints * PRESTIGE_CONFIG.multiplierPerPoint * 100).toFixed(1);
        prestigeMultiplierEl.textContent = `+${bonus}%`;
    }
    if (prestigeSpeedEl) {
        const speedBonus = (prestigePoints * PRESTIGE_CONFIG.speedPerPoint * 100).toFixed(1);
        prestigeSpeedEl.textContent = `+${speedBonus}%`;
    }
    if (prestigeGainEl) {
        const canPrestige = tapCount >= PRESTIGE_CONFIG.requiredTaps;
        prestigeGainEl.textContent = canPrestige ? PRESTIGE_CONFIG.pointsPerPrestige : 0;
        confirmPrestigeBtn.disabled = !canPrestige;
    }
    
    // Show unlocked features
    const prestigeInfo = document.getElementById('prestige-info');
    if (prestigeInfo) {
        let unlocksHTML = '';
        Object.entries(PRESTIGE_CONFIG.unlocks).forEach(([level, desc]) => {
            if (prestigeLevel >= parseInt(level)) {
                unlocksHTML += `<div class="prestige-unlock unlocked">✓ Level ${level}: ${desc}</div>`;
            } else {
                unlocksHTML += `<div class="prestige-unlock locked">🔒 Level ${level}: ${desc}</div>`;
            }
        });
        
        const unlocksSection = prestigeInfo.querySelector('.prestige-unlocks');
        if (unlocksSection) {
            unlocksSection.innerHTML = unlocksHTML;
        } else {
            const unlocksDiv = document.createElement('div');
            unlocksDiv.className = 'prestige-unlocks';
            unlocksDiv.innerHTML = '<h3>Prestige Unlocks:</h3>' + unlocksHTML;
            prestigeInfo.appendChild(unlocksDiv);
        }
    }
}

function performPrestige() {
    if (tapCount < PRESTIGE_CONFIG.requiredTaps) {
        alert('You need at least 1000 taps to prestige!');
        return;
    }
    
    // Gain prestige points
    prestigePoints += PRESTIGE_CONFIG.pointsPerPrestige;
    prestigeLevel++;
    totalPrestiges++;
    localStorage.setItem('totalPrestiges', totalPrestiges.toString());
    
    // Earn bonus skin currency from prestige (50 currency per prestige)
    skinCurrency += 50;
    localStorage.setItem('skinCurrency', skinCurrency.toString());
    
    // Reset progress
    tapCount = 0;
    comboCount = 0;
    currentMultiplier = 1;
    multiplierActive = false;
    autoTapperActive = false;
    completedMilestones = [];
    
    // Clear intervals
    if (autoTapperInterval) {
        clearInterval(autoTapperInterval);
        autoTapperInterval = null;
    }
    
    // Reset UI
    message.style.display = 'none';
    coin.style.pointerEvents = 'auto';
    coin.style.opacity = '1';
    
    // Save to localStorage
    localStorage.setItem('prestigeLevel', prestigeLevel.toString());
    localStorage.setItem('prestigePoints', prestigePoints.toString());
    localStorage.setItem('tapCount', '0');
    localStorage.setItem('completedMilestones', '[]');
    localStorage.removeItem('autoTapperUnlocked');
    
    // Check achievements
    checkAchievement('prestiger');
    if (prestigeLevel >= 5) checkAchievement('multi_prestiger');
    
    // Close modal and update display
    prestigeModal.style.display = 'none';
    updateDisplay();
    updateAutoTapperUI();
    updateMultiplierUI();
    updateComboDisplay();
    
    showMilestone(`Prestiged! Gained ${PRESTIGE_CONFIG.pointsPerPrestige} prestige point! 🏆`);
}

function getPrestigeMultiplier() {
    return 1 + (prestigePoints * PRESTIGE_CONFIG.multiplierPerPoint);
}

function getPrestigeSpeed() {
    return 1 + (prestigePoints * PRESTIGE_CONFIG.speedPerPoint);
}

// Get auto-tapper speed with prestige bonus (faster = lower interval)
function getAutoTapperInterval() {
    const baseInterval = AUTO_TAPPER_CONFIG.tapInterval;
    const speedBonus = getPrestigeSpeed();
    // Lower interval = faster tapping (speed bonus reduces interval)
    return Math.max(50, baseInterval / speedBonus); // Minimum 50ms
}

// Get combo timeout with prestige bonus (longer timeout = easier to maintain)
function getComboTimeout() {
    const baseTimeout = COMBO_CONFIG.maxInactivityTime;
    const speedBonus = getPrestigeSpeed();
    // Speed bonus extends combo timeout slightly
    return baseTimeout * (1 + (speedBonus - 1) * 0.5); // Extend by 50% of speed bonus
}

// Tap Pattern Functions
function checkTapPattern() {
    const now = Date.now();
    
    // Add current tap to history
    patternTapHistory.push(now);
    
    // Keep only recent taps (last 2 seconds)
    patternTapHistory = patternTapHistory.filter(tapTime => now - tapTime < 2000);
    
    // Check if any pattern matches
    for (const pattern of TAP_PATTERNS) {
        if (patternTapHistory.length >= pattern.pattern.length) {
            // Get recent taps matching pattern length
            const recentTaps = patternTapHistory.slice(-pattern.pattern.length);
            const intervals = [];
            
            // Calculate intervals between taps
            for (let i = 1; i < recentTaps.length; i++) {
                intervals.push(recentTaps[i] - recentTaps[i - 1]);
            }
            
            // Check if intervals match pattern (with tolerance)
            let matches = true;
            const tolerance = 50; // 50ms tolerance
            
            for (let i = 0; i < intervals.length && i < pattern.pattern.length - 1; i++) {
                if (Math.abs(intervals[i] - pattern.pattern[i + 1]) > tolerance) {
                    matches = false;
                    break;
                }
            }
            
            if (matches) {
                activatePatternBonus(pattern);
                patternTapHistory = []; // Reset after successful pattern
                break;
            }
        }
    }
}

function activatePatternBonus(pattern) {
    activePattern = pattern.id;
    patternBonusActive = true;
    patternBonusEndTime = Date.now() + 5000; // 5 second bonus
    
    // Show pattern indicator
    showPatternIndicator(pattern);
    
    // Show bonus notification
    showMilestone(`${pattern.icon} ${pattern.name} Pattern! +${Math.floor((pattern.bonus - 1) * 100)}% Bonus!`);
    
    // Play pattern sound
    if (soundEnabled && audioContext) {
        playPatternSound();
    }
    
    // Auto-hide after bonus expires
    setTimeout(() => {
        patternBonusActive = false;
        activePattern = null;
        hidePatternIndicator();
    }, 5000);
}

function showPatternIndicator(pattern) {
    const indicator = document.getElementById('pattern-indicator');
    const patternName = document.getElementById('pattern-name');
    const patternVisual = document.getElementById('pattern-visual');
    
    if (indicator && patternName && patternVisual) {
        patternName.textContent = `${pattern.icon} ${pattern.name} Active!`;
        
        // Create visual pattern representation
        patternVisual.innerHTML = pattern.pattern.map((interval, index) => {
            return `<span class="pattern-beat ${index === 0 ? 'active' : ''}">●</span>`;
        }).join('');
        
        indicator.style.display = 'block';
        
        // Animate pattern beats
        let beatIndex = 0;
        const beatInterval = setInterval(() => {
            if (!patternBonusActive) {
                clearInterval(beatInterval);
                return;
            }
            
            const beats = patternVisual.querySelectorAll('.pattern-beat');
            if (beats.length > 0) {
                beats.forEach((beat, i) => {
                    beat.classList.toggle('active', i === beatIndex);
                });
                
                beatIndex = (beatIndex + 1) % pattern.pattern.length;
            }
        }, pattern.pattern[0] || 200);
    }
}

function hidePatternIndicator() {
    const indicator = document.getElementById('pattern-indicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

function playPatternSound() {
    if (!audioContext) return;
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 523.25; // C5
        oscillator.type = 'sine';
        
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        oscillator.start(now);
        oscillator.stop(now + 0.2);
    } catch (e) {
        console.warn('Error playing pattern sound:', e);
    }
}

// Rhythm Mini-Game Functions
let rhythmBeatInterval = null;
let rhythmNextBeatTime = 0;
let rhythmPattern = [];

function startRhythmGame() {
    const config = MINIGAMES_CONFIG.rhythm;
    const beatDuration = (60 / config.bpm) * 1000; // Convert BPM to ms
    
    // Generate rhythm pattern (some beats require taps, some don't)
    rhythmPattern = [];
    for (let i = 0; i < config.patternLength; i++) {
        rhythmPattern.push(Math.random() > 0.3); // 70% chance of tap required
    }
    
    rhythmNextBeatTime = Date.now() + beatDuration;
    
    // Start beat indicator
    updateRhythmVisual();
    
    // Schedule beats
    rhythmBeatInterval = setInterval(() => {
        if (!minigameActive || currentMinigame !== 'rhythm') {
            clearInterval(rhythmBeatInterval);
            return;
        }
        
        rhythmNextBeatTime = Date.now() + beatDuration;
        updateRhythmVisual();
        
        // Check if player missed a required tap
        const currentBeat = minigameState.rhythm.currentBeat;
        if (currentBeat < rhythmPattern.length && rhythmPattern[currentBeat]) {
            // Beat required a tap, check if it was missed
            const timeSinceBeat = Date.now() - (rhythmNextBeatTime - beatDuration);
            if (timeSinceBeat > config.tolerance) {
                // Missed the beat
                minigameState.rhythm.misses++;
                if (minigameState.rhythm.misses >= 5) {
                    endMinigame();
                    return;
                }
            }
        }
        
        minigameState.rhythm.currentBeat = (minigameState.rhythm.currentBeat + 1) % rhythmPattern.length;
    }, beatDuration);
}

function handleRhythmTap() {
    if (!minigameActive || currentMinigame !== 'rhythm') return;
    
    const config = MINIGAMES_CONFIG.rhythm;
    const now = Date.now();
    const timeSinceBeat = Math.abs(now - rhythmNextBeatTime);
    
    const currentBeat = minigameState.rhythm.currentBeat;
    const requiresTap = rhythmPattern[currentBeat];
    
    if (!requiresTap) {
        // Tapped when shouldn't have
        minigameState.rhythm.misses++;
        showMilestone('Wrong beat! ⚠️');
    } else if (timeSinceBeat <= config.tolerance) {
        // Perfect timing!
        minigameState.rhythm.score += 10;
        minigameState.rhythm.perfectCount++;
        showMilestone('Perfect! ✨');
        
        // Play beat sound
        if (soundEnabled && audioContext) {
            playRhythmBeatSound();
        }
    } else if (timeSinceBeat <= config.tolerance * 2) {
        // Good timing
        minigameState.rhythm.score += 5;
        showMilestone('Good! 👍');
    } else {
        // Miss
        minigameState.rhythm.misses++;
        showMilestone('Miss! ⚠️');
    }
    
    if (minigameState.rhythm.misses >= 5) {
        endMinigame();
        return;
    }
    
    // Animate coin
    coin.classList.add('coin-clicked');
    setTimeout(() => coin.classList.remove('coin-clicked'), 150);
}

function playRhythmBeatSound() {
    if (!audioContext) return;
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 440; // A4
        oscillator.type = 'sine';
        
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    } catch (e) {
        console.warn('Error playing rhythm beat:', e);
    }
}

function updateRhythmVisual() {
    const minigameActiveEl = document.getElementById('minigame-active');
    if (!minigameActiveEl || currentMinigame !== 'rhythm') return;
    
    const state = minigameState.rhythm;
    
    // Create visual beat indicator
    const beatVisual = rhythmPattern.map((requiresTap, index) => {
        const isCurrent = index === state.currentBeat;
        const isPast = index < state.currentBeat;
        return `<span class="rhythm-beat ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''} ${requiresTap ? 'required' : 'skip'}">${requiresTap ? '●' : '○'}</span>`;
    }).join('');
    
    minigameActiveEl.innerHTML = `
        <div class="minigame-info">
            <h3>🎵 Rhythm Mode</h3>
            <div class="rhythm-beats">${beatVisual}</div>
            <div class="minigame-stats">
                <div>Score: ${state.score}</div>
                <div>Perfect: ${state.perfectCount}</div>
                <div>Misses: ${state.misses}/5</div>
            </div>
            <div class="minigame-instruction">Tap when the beat indicator shows ●</div>
            <button class="minigame-stop-btn" onclick="stopMinigame()">Stop Game</button>
        </div>
    `;
}

// Achievements System Functions
function initializeAchievements() {
    // Load unlocked achievements
    achievements.forEach(achievement => {
        if (achievements.includes(achievement.id)) {
            achievement.unlocked = true;
        }
    });
    
    // Check initial achievements
    if (tapCount > 0 && !achievements.includes('first_tap')) checkAchievement('first_tap');
    if (tapCount >= 1000 && !achievements.includes('perfectionist')) checkAchievement('perfectionist');
    if (prestigeLevel > 0 && !achievements.includes('prestiger')) checkAchievement('prestiger');
    if (prestigeLevel >= 5 && !achievements.includes('multi_prestiger')) checkAchievement('multi_prestiger');
    if (unlockedSkins.length >= 3 && !achievements.includes('collector')) checkAchievement('collector');
    if (platinumCoinsCaught >= 5 && !achievements.includes('platinum_hunter')) checkAchievement('platinum_hunter');
    if (highestCombo >= 50 && !achievements.includes('combo_master')) checkAchievement('combo_master');
    if (highestCombo >= 100 && !achievements.includes('combo_king')) checkAchievement('combo_king');
    if (fastest100Taps > 0 && fastest100Taps < 10000 && !achievements.includes('speedster')) checkAchievement('speedster');
}

function checkAchievement(achievementId) {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement || achievements.includes(achievementId)) return;
    
    achievements.push(achievementId);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    
    // Show unlock notification with animation
    showAchievementUnlock(achievement);
    
    // Also show milestone notification
    showMilestone(`Achievement Unlocked: ${achievement.icon} ${achievement.name}!`);
}

function showAchievementUnlock(achievement) {
    // Create achievement unlock overlay
    const unlockOverlay = document.createElement('div');
    unlockOverlay.className = 'achievement-unlock-overlay';
    
    const badge = document.createElement('div');
    badge.className = `achievement-badge rarity-${achievement.rarity}`;
    
    const icon = document.createElement('div');
    icon.className = 'achievement-badge-icon';
    icon.textContent = achievement.icon;
    
    const glow = document.createElement('div');
    glow.className = 'achievement-badge-glow';
    
    const info = document.createElement('div');
    info.className = 'achievement-badge-info';
    info.innerHTML = `
        <div class="achievement-badge-name">${achievement.name}</div>
        <div class="achievement-badge-desc">${achievement.desc}</div>
        <div class="achievement-badge-rarity">${achievement.rarity.toUpperCase()}</div>
    `;
    
    badge.appendChild(glow);
    badge.appendChild(icon);
    badge.appendChild(info);
    unlockOverlay.appendChild(badge);
    
    document.body.appendChild(unlockOverlay);
    
    // Trigger animation
    setTimeout(() => {
        unlockOverlay.classList.add('show');
        badge.classList.add('animate');
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
        unlockOverlay.classList.remove('show');
        setTimeout(() => unlockOverlay.remove(), 500);
    }, 4000);
}

function updateAchievementsModal() {
    const achievementsList = document.getElementById('achievements-list');
    if (!achievementsList) return;
    
    // Group achievements by category
    const categories = {};
    ACHIEVEMENTS.forEach(achievement => {
        if (!categories[achievement.category]) {
            categories[achievement.category] = [];
        }
        categories[achievement.category].push(achievement);
    });
    
    achievementsList.innerHTML = Object.entries(categories).map(([category, categoryAchievements]) => {
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        const categoryItems = categoryAchievements.map(achievement => {
            const unlocked = achievements.includes(achievement.id);
            return `
                <div class="achievement-item ${unlocked ? 'unlocked' : 'locked'} rarity-${achievement.rarity}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-desc">${achievement.desc}</div>
                        <div class="achievement-rarity-badge rarity-${achievement.rarity}">${achievement.rarity.toUpperCase()}</div>
                    </div>
                    <div class="achievement-status">${unlocked ? '<div class="achievement-check">✓</div>' : '<div class="achievement-lock">🔒</div>'}</div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="achievement-category">
                <div class="achievement-category-header">${categoryName} Achievements</div>
                ${categoryItems}
            </div>
        `;
    }).join('');
}

// Leaderboard System Functions
function updateLeaderboardModal() {
    const leaderboardStats = document.getElementById('leaderboard-stats');
    if (!leaderboardStats) return;
    
    const sessionTime = Math.floor((Date.now() - sessionStartTime) / 1000);
    const currentSpeed = tapsPerSecond;
    const isNewBestSpeed = currentSpeed > 0 && currentSpeed >= bestAllTimeSpeed;
    const isNewBestCombo = comboCount > 0 && comboCount >= bestAllTimeCombo;
    
    leaderboardStats.innerHTML = `
        <div class="leaderboard-section">
            <div class="leaderboard-section-title">⚡ Speed Records</div>
            <div class="leaderboard-item ${isNewBestSpeed && currentSpeed > 0 ? 'leaderboard-record' : ''}">
                <span class="leaderboard-label">
                    Current Speed
                    ${isNewBestSpeed && currentSpeed > 0 ? '<span class="leaderboard-new-badge">NEW BEST!</span>' : ''}
                </span>
                <span class="leaderboard-value">${currentSpeed} taps/sec</span>
            </div>
            <div class="leaderboard-item ${bestAllTimeSpeed > 0 ? 'leaderboard-best' : ''}">
                <span class="leaderboard-label">Best All-Time Speed:</span>
                <span class="leaderboard-value">${bestAllTimeSpeed} taps/sec</span>
            </div>
            <div class="leaderboard-item">
                <span class="leaderboard-label">Best This Session:</span>
                <span class="leaderboard-value">${highestTapsPerSecond} taps/sec</span>
            </div>
        </div>
        
        <div class="leaderboard-section">
            <div class="leaderboard-section-title">🔥 Combo Records</div>
            <div class="leaderboard-item ${isNewBestCombo && comboCount > 0 ? 'leaderboard-record' : ''}">
                <span class="leaderboard-label">
                    Current Combo
                    ${isNewBestCombo && comboCount > 0 ? '<span class="leaderboard-new-badge">NEW BEST!</span>' : ''}
                </span>
                <span class="leaderboard-value">${comboCount}x</span>
            </div>
            <div class="leaderboard-item ${bestAllTimeCombo > 0 ? 'leaderboard-best' : ''}">
                <span class="leaderboard-label">Best All-Time Combo:</span>
                <span class="leaderboard-value">${bestAllTimeCombo}x</span>
            </div>
            <div class="leaderboard-item">
                <span class="leaderboard-label">Best This Session:</span>
                <span class="leaderboard-value">${highestCombo}x</span>
            </div>
        </div>
        
        <div class="leaderboard-section">
            <div class="leaderboard-section-title">🎯 Tap Records</div>
            <div class="leaderboard-item">
                <span class="leaderboard-label">Current Taps:</span>
                <span class="leaderboard-value">${tapCount.toLocaleString()}</span>
            </div>
            <div class="leaderboard-item leaderboard-best">
                <span class="leaderboard-label">Total Lifetime Taps:</span>
                <span class="leaderboard-value">${totalLifetimeTaps.toLocaleString()}</span>
            </div>
            ${fastest100Taps > 0 ? `
            <div class="leaderboard-item leaderboard-best">
                <span class="leaderboard-label">Fastest 100 Taps:</span>
                <span class="leaderboard-value">${(fastest100Taps / 1000).toFixed(2)}s</span>
            </div>
            ` : ''}
        </div>
        
        <div class="leaderboard-section">
            <div class="leaderboard-section-title">⏱️ Time Records</div>
            <div class="leaderboard-item">
                <span class="leaderboard-label">Current Session:</span>
                <span class="leaderboard-value">${formatTime(sessionTime)}</span>
            </div>
            <div class="leaderboard-item leaderboard-best">
                <span class="leaderboard-label">Best Session Time:</span>
                <span class="leaderboard-value">${formatTime(bestSessionTime)}</span>
            </div>
            <div class="leaderboard-item">
                <span class="leaderboard-label">Longest Session:</span>
                <span class="leaderboard-value">${formatTime(longestSession)}</span>
            </div>
            <div class="leaderboard-item">
                <span class="leaderboard-label">Total Play Time:</span>
                <span class="leaderboard-value">${formatTime(totalPlayTime)}</span>
            </div>
        </div>
        
        <div class="leaderboard-section">
            <div class="leaderboard-section-title">🏆 Progression</div>
            <div class="leaderboard-item">
                <span class="leaderboard-label">Current Prestige Level:</span>
                <span class="leaderboard-value">${prestigeLevel}</span>
            </div>
            <div class="leaderboard-item leaderboard-best">
                <span class="leaderboard-label">Total Prestiges:</span>
                <span class="leaderboard-value">${totalPrestiges}</span>
            </div>
            <div class="leaderboard-item">
                <span class="leaderboard-label">Achievements:</span>
                <span class="leaderboard-value">${achievements.length}/${ACHIEVEMENTS.length}</span>
            </div>
            <div class="leaderboard-item">
                <span class="leaderboard-label">Platinum Coins Caught:</span>
                <span class="leaderboard-value">${platinumCoinsCaught}</span>
            </div>
            <div class="leaderboard-item">
                <span class="leaderboard-label">Skins Unlocked:</span>
                <span class="leaderboard-value">${unlockedSkins.length}/${COIN_SKINS.length}</span>
            </div>
        </div>
    `;
}

// Coin Skins System Functions
function checkSkinUnlocks() {
    COIN_SKINS.forEach(skin => {
        // Check milestone unlocks
        if (skin.unlockMethod === 'milestone' && tapCount >= skin.unlockAt && !unlockedSkins.includes(skin.id)) {
            unlockedSkins.push(skin.id);
            localStorage.setItem('unlockedSkins', JSON.stringify(unlockedSkins));
            showMilestone(`Coin Skin Unlocked: ${skin.icon} ${skin.name}!`);
        }
    });
    
    // Check collector achievement
    if (unlockedSkins.length >= 3) {
        checkAchievement('collector');
    }
}

function purchaseSkin(skinId) {
    const skin = COIN_SKINS.find(s => s.id === skinId);
    if (!skin || skin.unlockMethod !== 'purchase') return false;
    
    if (unlockedSkins.includes(skinId)) {
        return false; // Already unlocked
    }
    
    if (skinCurrency < skin.cost) {
        return false; // Not enough currency
    }
    
    // Purchase the skin
    skinCurrency -= skin.cost;
    unlockedSkins.push(skinId);
    localStorage.setItem('skinCurrency', skinCurrency.toString());
    localStorage.setItem('unlockedSkins', JSON.stringify(unlockedSkins));
    
    showMilestone(`Coin Skin Purchased: ${skin.icon} ${skin.name}!`);
    checkAchievement('collector');
    
    return true;
}

function applyCoinSkin() {
    const skin = COIN_SKINS.find(s => s.id === currentSkin);
    if (!skin) {
        currentSkin = 'default';
        localStorage.setItem('currentSkin', 'default');
    }
    
    // Remove all skin classes first
    coin.className = coin.className.replace(/coin-skin-\w+/g, '');
    
    // Apply skin filter/transform (add class if not default)
    if (currentSkin !== 'default') {
        coin.classList.add(`coin-skin-${currentSkin}`);
    }
}

function updateSkinsModal() {
    const skinsList = document.getElementById('skins-list');
    if (!skinsList) return;
    
    // Show currency
    const currencyDisplay = document.querySelector('.skin-currency-display');
    if (!currencyDisplay) {
        const currencyDiv = document.createElement('div');
        currencyDiv.className = 'skin-currency-display';
        skinsList.parentNode.insertBefore(currencyDiv, skinsList);
    }
    const currencyEl = document.querySelector('.skin-currency-display');
    if (currencyEl) {
        currencyEl.innerHTML = `<div class="currency-amount">💰 Currency: <span class="currency-value">${skinCurrency}</span></div>`;
    }
    
    skinsList.innerHTML = COIN_SKINS.map(skin => {
        const unlocked = unlockedSkins.includes(skin.id);
        const isActive = currentSkin === skin.id;
        const canAfford = skinCurrency >= skin.cost;
        
        let unlockText = '';
        if (skin.unlockMethod === 'free') {
            unlockText = 'Free';
        } else if (skin.unlockMethod === 'milestone') {
            unlockText = `Unlocks at ${skin.unlockAt} taps`;
        } else if (skin.unlockMethod === 'purchase') {
            unlockText = `Cost: ${skin.cost} 💰`;
        }
        
        return `
            <div class="skin-item ${unlocked ? 'unlocked' : 'locked'} ${isActive ? 'active' : ''} rarity-${skin.rarity}">
                <div class="skin-preview">
                    <div class="skin-icon coin-skin-preview-${skin.id}">${skin.icon}</div>
                </div>
                <div class="skin-info">
                    <div class="skin-name">${skin.name}</div>
                    <div class="skin-unlock">${unlockText}</div>
                    <div class="skin-rarity rarity-${skin.rarity}">${skin.rarity.toUpperCase()}</div>
                </div>
                ${unlocked ? `
                    <button class="skin-select-btn ${isActive ? 'selected' : ''}" 
                            data-skin="${skin.id}" 
                            ${isActive ? 'disabled' : ''}>
                        ${isActive ? 'Active' : 'Select'}
                    </button>
                ` : skin.unlockMethod === 'purchase' ? `
                    <button class="skin-purchase-btn ${canAfford ? '' : 'disabled'}" 
                            data-skin="${skin.id}"
                            ${canAfford ? '' : 'disabled'}>
                        ${canAfford ? `Buy (${skin.cost}💰)` : `Need ${skin.cost - skinCurrency} more`}
                    </button>
                ` : '<div class="skin-locked">🔒</div>'}
            </div>
        `;
    }).join('');
    
    // Add click handlers for select buttons
    document.querySelectorAll('.skin-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const skinId = btn.dataset.skin;
            currentSkin = skinId;
            localStorage.setItem('currentSkin', skinId);
            applyCoinSkin();
            updateSkinsModal();
        });
    });
    
    // Add click handlers for purchase buttons
    document.querySelectorAll('.skin-purchase-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const skinId = btn.dataset.skin;
            if (purchaseSkin(skinId)) {
                updateSkinsModal();
            }
        });
    });
}

// Mini-Games Functions
function updateMinigamesModal() {
    const minigamesList = document.getElementById('minigames-list');
    const minigameActiveEl = document.getElementById('minigame-active');
    
    if (!minigamesList) return;
    
    if (minigameActive) {
        // Show active game UI
        minigamesList.style.display = 'none';
        minigameActiveEl.style.display = 'block';
        updateActiveMinigameUI();
    } else {
        // Show game selection
        minigamesList.style.display = 'block';
        minigameActiveEl.style.display = 'none';
        
        minigamesList.innerHTML = Object.entries(MINIGAMES_CONFIG).map(([gameId, game]) => {
            const state = minigameState[gameId];
            const bestScore = state.bestScore || 0;
            let bestScoreText = '';
            
            if (gameId === 'timeChallenge') {
                bestScoreText = bestScore > 0 ? `Best: ${bestScore} taps` : 'No best score';
            } else if (gameId === 'endurance') {
                bestScoreText = bestScore > 0 ? `Best: ${formatTime(Math.floor(bestScore / 1000))}` : 'No best score';
            } else if (gameId === 'precision') {
                bestScoreText = bestScore > 0 ? `Best: ${bestScore} points` : 'No best score';
            } else if (gameId === 'rhythm') {
                bestScoreText = bestScore > 0 ? `Best: ${bestScore} points` : 'No best score';
            }
            
            return `
                <div class="minigame-item">
                    <div class="minigame-icon">${game.icon}</div>
                    <div class="minigame-info">
                        <div class="minigame-name">${game.name}</div>
                        <div class="minigame-description">${game.description}</div>
                        <div class="minigame-best">${bestScoreText}</div>
                    </div>
                    <button class="minigame-start-btn" data-game="${gameId}">Play</button>
                </div>
            `;
        }).join('');
        
        // Add click handlers
        document.querySelectorAll('.minigame-start-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const gameId = btn.dataset.game;
                startMinigame(gameId);
            });
        });
    }
}

function startMinigame(gameId) {
    if (minigameActive) return;
    
    currentMinigame = gameId;
    minigameActive = true;
    
    // Reset game state
    if (gameId === 'timeChallenge') {
        minigameState.timeChallenge.taps = 0;
        minigameState.timeChallenge.startTime = Date.now();
        minigameState.timeChallenge.endTime = 0;
    } else if (gameId === 'endurance') {
        minigameState.endurance.duration = 0;
        minigameState.endurance.startTime = Date.now();
        minigameState.endurance.lastTapTime = Date.now();
    } else if (gameId === 'precision') {
        minigameState.precision.score = 0;
        minigameState.precision.misses = 0;
        minigameState.precision.startTime = Date.now();
        minigameState.precision.targetActive = false;
        minigameState.precision.difficulty = 0;
        spawnPrecisionTarget();
    } else if (gameId === 'rhythm') {
        minigameState.rhythm.score = 0;
        minigameState.rhythm.misses = 0;
        minigameState.rhythm.startTime = Date.now();
        minigameState.rhythm.currentBeat = 0;
        minigameState.rhythm.lastTapTime = 0;
        minigameState.rhythm.perfectCount = 0;
        startRhythmGame();
    }
    
    updateMinigamesModal();
    
    // Start game loop
    minigameInterval = setInterval(() => {
        updateActiveMinigameUI();
        checkMinigameEnd();
    }, 100);
    
    // Special handling for time challenge
    if (gameId === 'timeChallenge') {
        setTimeout(() => {
            if (currentMinigame === 'timeChallenge' && minigameActive) {
                endMinigame();
            }
        }, MINIGAMES_CONFIG.timeChallenge.timeLimit);
    }
}

function handleMinigameTap(e) {
    if (!minigameActive || !currentMinigame) return;
    
    const gameId = currentMinigame;
    
    if (gameId === 'timeChallenge') {
        minigameState.timeChallenge.taps++;
        // Animate coin
        coin.classList.add('coin-clicked');
        setTimeout(() => coin.classList.remove('coin-clicked'), 150);
        
    } else if (gameId === 'endurance') {
        // Track time and update last tap time
        const now = Date.now();
        minigameState.endurance.lastTapTime = now;
        minigameState.endurance.duration = now - minigameState.endurance.startTime;
        // Animate coin
        coin.classList.add('coin-clicked');
        setTimeout(() => coin.classList.remove('coin-clicked'), 150);
        
    } else if (gameId === 'precision') {
        if (minigameState.precision.targetActive) {
            // Success!
            minigameState.precision.score++;
            minigameState.precision.difficulty = Math.min(minigameState.precision.difficulty + 1, 20);
            despawnPrecisionTarget();
            spawnPrecisionTarget();
            
            // Visual feedback
            coin.classList.add('coin-clicked');
            setTimeout(() => coin.classList.remove('coin-clicked'), 150);
            showMilestone('Perfect! ✨');
        } else {
            // Miss!
            minigameState.precision.misses++;
            if (minigameState.precision.misses >= 3) {
                endMinigame();
                return;
            }
            showMilestone('Miss! Try again! ⚠️');
        }
    }
    
    updateActiveMinigameUI();
}

function spawnPrecisionTarget() {
    if (!minigameActive || currentMinigame !== 'precision') return;
    
    const config = MINIGAMES_CONFIG.precision;
    const interval = Math.max(500, config.spawnInterval - (minigameState.precision.difficulty * config.difficultyIncrease));
    
    minigameState.precision.spawnTimeout = setTimeout(() => {
        if (!minigameActive || currentMinigame !== 'precision') return;
        
        // Show target indicator
        coin.classList.add('precision-target');
        minigameState.precision.targetActive = true;
        
        // Target disappears after window duration
        minigameState.precision.targetTimeout = setTimeout(() => {
            if (minigameState.precision.targetActive) {
                minigameState.precision.misses++;
                despawnPrecisionTarget();
                if (minigameState.precision.misses >= 3) {
                    endMinigame();
                } else {
                    spawnPrecisionTarget();
                }
            }
        }, config.windowDuration);
    }, interval);
}

function despawnPrecisionTarget() {
    coin.classList.remove('precision-target');
    minigameState.precision.targetActive = false;
    if (minigameState.precision.targetTimeout) {
        clearTimeout(minigameState.precision.targetTimeout);
        minigameState.precision.targetTimeout = null;
    }
}

function checkMinigameEnd() {
    if (!minigameActive || !currentMinigame) return;
    
    const gameId = currentMinigame;
    
    if (gameId === 'endurance') {
        // Check if user stopped tapping (no taps in last 2 seconds)
        const now = Date.now();
        const timeSinceLastTap = now - minigameState.endurance.lastTapTime;
        if (minigameState.endurance.duration > 1000 && timeSinceLastTap > 2000) {
            endMinigame();
        }
    }
}

function updateActiveMinigameUI() {
    const minigameActiveEl = document.getElementById('minigame-active');
    if (!minigameActiveEl || !minigameActive || !currentMinigame) return;
    
    const gameId = currentMinigame;
    const config = MINIGAMES_CONFIG[gameId];
    const state = minigameState[gameId];
    
    let content = `<h3>${config.icon} ${config.name}</h3>`;
    
    if (gameId === 'timeChallenge') {
        const elapsed = Date.now() - state.startTime;
        const remaining = Math.max(0, MINIGAMES_CONFIG.timeChallenge.timeLimit - elapsed);
        const remainingSeconds = Math.ceil(remaining / 1000);
        const progress = (state.taps / MINIGAMES_CONFIG.timeChallenge.targetTaps) * 100;
        
        content += `
            <div class="minigame-stats">
                <div class="minigame-stat">
                    <span class="minigame-stat-label">Taps:</span>
                    <span class="minigame-stat-value">${state.taps}/${MINIGAMES_CONFIG.timeChallenge.targetTaps}</span>
                </div>
                <div class="minigame-stat">
                    <span class="minigame-stat-label">Time:</span>
                    <span class="minigame-stat-value">${remainingSeconds}s</span>
                </div>
            </div>
            <div class="minigame-progress-bar">
                <div class="minigame-progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
            </div>
        `;
        
    } else if (gameId === 'endurance') {
        const duration = Math.floor((Date.now() - state.startTime) / 1000);
        
        content += `
            <div class="minigame-stats">
                <div class="minigame-stat">
                    <span class="minigame-stat-label">Duration:</span>
                    <span class="minigame-stat-value">${formatTime(duration)}</span>
                </div>
                <div class="minigame-stat">
                    <span class="minigame-stat-label">Best:</span>
                    <span class="minigame-stat-value">${formatTime(Math.floor(state.bestScore / 1000))}</span>
                </div>
            </div>
            <div class="minigame-instruction">Keep tapping! Don't stop!</div>
        `;
        
    } else if (gameId === 'precision') {
        content += `
            <div class="minigame-stats">
                <div class="minigame-stat">
                    <span class="minigame-stat-label">Score:</span>
                    <span class="minigame-stat-value">${state.score}</span>
                </div>
                <div class="minigame-stat">
                    <span class="minigame-stat-label">Misses:</span>
                    <span class="minigame-stat-value">${state.misses}/3</span>
                </div>
                <div class="minigame-stat">
                    <span class="minigame-stat-label">Best:</span>
                    <span class="minigame-stat-value">${state.bestScore}</span>
                </div>
            </div>
            <div class="minigame-instruction">
                ${state.targetActive ? '<span class="precision-indicator">🎯 TAP NOW!</span>' : 'Wait for the target...'}
            </div>
        `;
    } else if (gameId === 'rhythm') {
        updateRhythmVisual();
        return; // updateRhythmVisual sets innerHTML
    }
    
    content += `<button class="minigame-stop-btn" onclick="stopMinigame()">Stop Game</button>`;
    
    minigameActiveEl.innerHTML = content;
}

function endMinigame() {
    if (!minigameActive || !currentMinigame) return;
    
    const gameId = currentMinigame;
    const state = minigameState[gameId];
    let success = false;
    let reward = 0;
    let message = '';
    
    if (gameId === 'timeChallenge') {
        state.endTime = Date.now();
        const finalTaps = state.taps;
        const targetTaps = MINIGAMES_CONFIG.timeChallenge.targetTaps;
        
        if (finalTaps >= targetTaps) {
            success = true;
            message = `Challenge Complete! ${finalTaps} taps in 30 seconds! 🎉`;
            reward = 20;
        } else {
            message = `Time's up! You got ${finalTaps}/${targetTaps} taps. Try again!`;
            reward = Math.floor(finalTaps / 10); // 1 currency per 10 taps
        }
        
        if (finalTaps > state.bestScore) {
            state.bestScore = finalTaps;
            localStorage.setItem('minigame_timeChallenge_best', finalTaps.toString());
        }
        
    } else if (gameId === 'endurance') {
        const finalDuration = state.duration;
        
        message = `Endurance Mode Complete! You lasted ${formatTime(Math.floor(finalDuration / 1000))}! 💪`;
        reward = Math.floor(finalDuration / 1000); // 1 currency per second
        
        if (finalDuration > state.bestScore) {
            state.bestScore = finalDuration;
            localStorage.setItem('minigame_endurance_best', finalDuration.toString());
        }
        success = true;
        
    } else if (gameId === 'precision') {
        const finalScore = state.score;
        
        if (state.misses >= 3) {
            message = `Game Over! Final Score: ${finalScore} points. You missed 3 times.`;
        } else {
            message = `Great job! Final Score: ${finalScore} points! 🎯`;
            success = true;
        }
        
        reward = Math.floor(finalScore / 2); // 1 currency per 2 points
        
        if (finalScore > state.bestScore) {
            state.bestScore = finalScore;
            localStorage.setItem('minigame_precision_best', finalScore.toString());
        }
    } else if (gameId === 'rhythm') {
        const finalScore = state.score;
        const perfectCount = state.perfectCount;
        
        if (state.misses >= 5) {
            message = `Game Over! Final Score: ${finalScore} points. You missed 5 times.`;
        } else {
            message = `Rhythm Mode Complete! Score: ${finalScore} points (${perfectCount} perfect beats)! 🎵`;
            success = true;
        }
        
        reward = Math.floor(finalScore / 5); // 1 currency per 5 points
        
        if (finalScore > state.bestScore) {
            state.bestScore = finalScore;
            localStorage.setItem('minigame_rhythm_best', finalScore.toString());
        }
        
        // Clean up rhythm interval
        if (rhythmBeatInterval) {
            clearInterval(rhythmBeatInterval);
            rhythmBeatInterval = null;
        }
    }
    
    // Award currency
    if (reward > 0) {
        skinCurrency += reward;
        localStorage.setItem('skinCurrency', skinCurrency.toString());
        message += ` +${reward} 💰`;
    }
    
    // Cleanup
    if (gameId === 'precision') {
        despawnPrecisionTarget();
        if (state.spawnTimeout) {
            clearTimeout(state.spawnTimeout);
            state.spawnTimeout = null;
        }
    } else if (gameId === 'rhythm') {
        if (rhythmBeatInterval) {
            clearInterval(rhythmBeatInterval);
            rhythmBeatInterval = null;
        }
    }
    
    if (minigameInterval) {
        clearInterval(minigameInterval);
        minigameInterval = null;
    }
    
    minigameActive = false;
    currentMinigame = null;
    
    showMilestone(message);
    updateMinigamesModal();
}

function stopMinigame() {
    if (minigameActive) {
        endMinigame();
    }
}

// Make stopMinigame available globally for onclick
window.stopMinigame = stopMinigame;

// Daily Challenges Functions
function updateDailyChallengesProgress(challengeType, tapValue, currentSpeed, isRareCoin = false) {
    if (!dailyChallenges || !Array.isArray(dailyChallenges)) return;
    
    dailyChallenges.forEach(challenge => {
        if (challenge.completed) return;
        
        if (challenge.type === 'taps' && challengeType === 'taps') {
            challenge.current += tapValue;
            if (challenge.current >= challenge.target) {
                completeDailyChallenge(challenge);
            }
        } else if (challenge.type === 'speed' && challengeType === 'taps') {
            if (currentSpeed > challenge.current) {
                challenge.current = currentSpeed;
                if (challenge.current >= challenge.target) {
                    completeDailyChallenge(challenge);
                }
            }
        } else if (challenge.type === 'rare' && challengeType === 'taps' && isRareCoin) {
            challenge.current++;
            if (challenge.current >= challenge.target) {
                completeDailyChallenge(challenge);
            }
        }
    });
    
    // Save progress
    localStorage.setItem('dailyChallenges', JSON.stringify(dailyChallenges));
}

function updateDailyChallengesSession() {
    if (!dailyChallenges || !Array.isArray(dailyChallenges)) return;
    if (!dailySessionStartTime) return;
    
    const sessionTime = Math.floor((Date.now() - dailySessionStartTime) / 1000);
    
    dailyChallenges.forEach(challenge => {
        if (challenge.completed) return;
        
        if (challenge.type === 'session') {
            challenge.current = sessionTime;
            if (challenge.current >= challenge.target) {
                completeDailyChallenge(challenge);
            }
        }
    });
    
    // Save progress
    localStorage.setItem('dailyChallenges', JSON.stringify(dailyChallenges));
}

function completeDailyChallenge(challenge) {
    if (challenge.completed) return;
    
    challenge.completed = true;
    challenge.current = challenge.target; // Ensure it's exactly at target
    
    // Calculate reward with streak bonus
    const streakBonus = Math.min(1 + (dailyStreak * DAILY_CHALLENGES_CONFIG.streakMultiplier), DAILY_CHALLENGES_CONFIG.maxStreakBonus);
    const finalReward = Math.floor(challenge.reward * streakBonus);
    
    // Award currency
    skinCurrency += finalReward;
    localStorage.setItem('skinCurrency', skinCurrency.toString());
    
    // Show notification
    showMilestone(`Daily Challenge Complete: ${challenge.icon} ${challenge.name}! +${finalReward} 💰 (${dailyStreak} day streak!)`);
    
    // Save
    localStorage.setItem('dailyChallenges', JSON.stringify(dailyChallenges));
}

function checkDailyChallengeCombo() {
    if (!dailyChallenges || !Array.isArray(dailyChallenges)) return;
    
    dailyChallenges.forEach(challenge => {
        if (challenge.completed) return;
        if (challenge.type === 'combo') {
            if (comboCount > challenge.current) {
                challenge.current = comboCount;
                if (challenge.current >= challenge.target) {
                    completeDailyChallenge(challenge);
                }
                localStorage.setItem('dailyChallenges', JSON.stringify(dailyChallenges));
            }
        }
    });
}

function updateDailyModal() {
    const dailyStreakEl = document.getElementById('daily-streak');
    const dailyChallengesListEl = document.getElementById('daily-challenges-list');
    
    if (!dailyStreakEl || !dailyChallengesListEl) return;
    
    // Update streak display
    const streakBonus = Math.min(dailyStreak * DAILY_CHALLENGES_CONFIG.streakMultiplier * 100, (DAILY_CHALLENGES_CONFIG.maxStreakBonus - 1) * 100);
    dailyStreakEl.innerHTML = `
        <div class="daily-streak-container">
            <div class="daily-streak-icon">🔥</div>
            <div class="daily-streak-info">
                <div class="daily-streak-label">Daily Streak</div>
                <div class="daily-streak-value">${dailyStreak} day${dailyStreak !== 1 ? 's' : ''}</div>
                <div class="daily-streak-bonus">+${streakBonus.toFixed(0)}% Reward Bonus</div>
            </div>
        </div>
    `;
    
    // Update challenges list
    if (!dailyChallenges || !Array.isArray(dailyChallenges) || dailyChallenges.length === 0) {
        dailyChallengesListEl.innerHTML = '<p>No challenges available. Check back tomorrow!</p>';
        return;
    }
    
    dailyChallengesListEl.innerHTML = dailyChallenges.map((challenge, index) => {
        const challengeType = DAILY_CHALLENGE_TYPES.find(t => t.id === challenge.type);
        const progress = Math.min((challenge.current / challenge.target) * 100, 100);
        const streakBonus = Math.min(1 + (dailyStreak * DAILY_CHALLENGES_CONFIG.streakMultiplier), DAILY_CHALLENGES_CONFIG.maxStreakBonus);
        const finalReward = Math.floor(challenge.reward * streakBonus);
        
        let targetText = '';
        if (challenge.type === 'taps') {
            targetText = `${challenge.target} taps`;
        } else if (challenge.type === 'combo') {
            targetText = `${challenge.target}x combo`;
        } else if (challenge.type === 'speed') {
            targetText = `${challenge.target} taps/sec`;
        } else if (challenge.type === 'rare') {
            targetText = `${challenge.target} rare coin${challenge.target > 1 ? 's' : ''}`;
        } else if (challenge.type === 'session') {
            targetText = formatTime(challenge.target);
        }
        
        return `
            <div class="daily-challenge-item ${challenge.completed ? 'completed' : ''}">
                <div class="daily-challenge-icon">${challenge.icon}</div>
                <div class="daily-challenge-info">
                    <div class="daily-challenge-name">${challenge.name}</div>
                    <div class="daily-challenge-target">Target: ${targetText}</div>
                    <div class="daily-challenge-progress-bar">
                        <div class="daily-challenge-progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="daily-challenge-progress-text">
                        ${challenge.current} / ${challenge.target}
                    </div>
                </div>
                <div class="daily-challenge-reward">
                    <div class="daily-challenge-reward-amount">${finalReward} 💰</div>
                    ${challenge.completed ? '<div class="daily-challenge-check">✓</div>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Shop Functions
function updateShopModal() {
    const shopCurrencyEl = document.getElementById('shop-currency');
    const shopUpgradesEl = document.getElementById('shop-upgrades');
    const shopCosmeticsEl = document.getElementById('shop-cosmetics');
    
    if (!shopCurrencyEl || !shopUpgradesEl || !shopCosmeticsEl) return;
    
    // Update currency display
    shopCurrencyEl.innerHTML = `
        <div class="shop-currency-display">
            <span class="shop-currency-icon">💰</span>
            <span class="shop-currency-label">Currency:</span>
            <span class="shop-currency-value">${skinCurrency}</span>
        </div>
    `;
    
    // Update upgrades section
    shopUpgradesEl.innerHTML = SHOP_UPGRADES.map(upgrade => {
        const currentLevel = shopUpgrades[upgrade.id] || 0;
        const isMaxLevel = currentLevel >= upgrade.maxLevel;
        const nextLevel = currentLevel + 1;
        const nextCost = upgrade.cost * nextLevel;
        const canAfford = skinCurrency >= nextCost;
        
        let effectText = '';
        const currentEffect = currentLevel > 0 ? upgrade.effect(currentLevel) : null;
        
        if (upgrade.id === 'animation_speed' && currentEffect) {
            effectText = `Current: ${((1 - currentEffect.animationSpeed) * 100).toFixed(0)}% faster`;
        } else if (upgrade.id === 'particle_quality' && currentEffect) {
            effectText = `Current: ${currentEffect.particleCount} particles, size ${currentEffect.particleSize}px`;
        } else if (upgrade.id === 'particle_duration' && currentEffect) {
            effectText = `Current: ${(currentEffect.particleDuration * 100).toFixed(0)}% duration`;
        }
        
        return `
            <div class="shop-item upgrade-item">
                <div class="shop-item-icon">${upgrade.icon}</div>
                <div class="shop-item-info">
                    <div class="shop-item-name">${upgrade.name}</div>
                    <div class="shop-item-description">${upgrade.description}</div>
                    <div class="shop-item-level">Level: ${currentLevel}/${upgrade.maxLevel}</div>
                    ${effectText ? `<div class="shop-item-effect">${effectText}</div>` : ''}
                </div>
                <div class="shop-item-action">
                    ${isMaxLevel ? 
                        '<div class="shop-item-max">MAX LEVEL</div>' :
                        `<button class="shop-buy-btn ${canAfford ? '' : 'disabled'}" 
                                 data-upgrade="${upgrade.id}"
                                 ${canAfford ? '' : 'disabled'}>
                            Buy Level ${nextLevel}
                            <span class="shop-buy-cost">${nextCost} 💰</span>
                        </button>`
                    }
                </div>
            </div>
        `;
    }).join('');
    
    // Update cosmetics section
    shopCosmeticsEl.innerHTML = SHOP_COSMETICS.map(cosmetic => {
        const isOwned = cosmetic.cost === 0 || shopCosmetics.includes(cosmetic.id); // Free themes are always owned
        const isActive = (cosmetic.category === 'theme' && currentTheme === cosmetic.id) || 
                        (cosmetic.category === 'particles' && currentParticleColor === cosmetic.id);
        const canAfford = skinCurrency >= cosmetic.cost;
        const costDisplay = cosmetic.cost === 0 ? 'FREE' : `${cosmetic.cost} 💰`;
        
        return `
            <div class="shop-item cosmetic-item ${isOwned ? 'owned' : ''} ${isActive ? 'active' : ''}">
                <div class="shop-item-icon">${cosmetic.icon}</div>
                <div class="shop-item-info">
                    <div class="shop-item-name">${cosmetic.name}</div>
                    <div class="shop-item-description">${cosmetic.description}</div>
                </div>
                <div class="shop-item-action">
                    ${isOwned ? 
                        (isActive ? 
                            '<div class="shop-item-active">ACTIVE</div>' :
                            `<button class="shop-apply-btn" data-cosmetic="${cosmetic.id}">
                                Apply
                            </button>`
                        ) :
                        `<button class="shop-buy-btn ${canAfford ? '' : 'disabled'}" 
                                 data-cosmetic="${cosmetic.id}"
                                 ${canAfford ? '' : 'disabled'}>
                            Buy
                            <span class="shop-buy-cost">${costDisplay}</span>
                        </button>`
                    }
                </div>
            </div>
        `;
    }).join('');
    
    // Add click handlers for upgrades
    document.querySelectorAll('.shop-buy-btn[data-upgrade]').forEach(btn => {
        btn.addEventListener('click', () => {
            const upgradeId = btn.dataset.upgrade;
            buyUpgrade(upgradeId);
        });
    });
    
    // Add click handlers for cosmetics
    document.querySelectorAll('.shop-buy-btn[data-cosmetic]').forEach(btn => {
        btn.addEventListener('click', () => {
            const cosmeticId = btn.dataset.cosmetic;
            buyCosmetic(cosmeticId);
        });
    });
    
    document.querySelectorAll('.shop-apply-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const cosmeticId = btn.dataset.cosmetic;
            applyCosmetic(cosmeticId);
        });
    });
}

function buyUpgrade(upgradeId) {
    const upgrade = SHOP_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return false;
    
    const currentLevel = shopUpgrades[upgradeId] || 0;
    if (currentLevel >= upgrade.maxLevel) return false;
    
    const nextLevel = currentLevel + 1;
    const cost = upgrade.cost * nextLevel;
    
    if (skinCurrency < cost) return false;
    
    // Purchase
    skinCurrency -= cost;
    shopUpgrades[upgradeId] = nextLevel;
    
    localStorage.setItem('skinCurrency', skinCurrency.toString());
    localStorage.setItem('shopUpgrades', JSON.stringify(shopUpgrades));
    
    showMilestone(`${upgrade.name} upgraded to Level ${nextLevel}! ⚡`);
    updateShopModal();
    
    return true;
}

function buyCosmetic(cosmeticId) {
        const cosmetic = SHOP_COSMETICS.find(c => c.id === cosmeticId);
    if (!cosmetic) return false;
    
    // Free themes don't need to be purchased
    if (cosmetic.cost === 0 && cosmetic.category === 'theme') {
        shopCosmetics.push(cosmeticId);
        localStorage.setItem('shopCosmetics', JSON.stringify(shopCosmetics));
        applyCosmetic(cosmeticId);
        updateShopModal();
        return true;
    }
    
    if (shopCosmetics.includes(cosmeticId)) return false;
    if (skinCurrency < cosmetic.cost) return false;
    
    // Purchase
    skinCurrency -= cosmetic.cost;
    shopCosmetics.push(cosmeticId);
    
    localStorage.setItem('skinCurrency', skinCurrency.toString());
    localStorage.setItem('shopCosmetics', JSON.stringify(shopCosmetics));
    
    showMilestone(`${cosmetic.name} purchased! ${cosmetic.icon}`);
    
    // Auto-apply if it's a theme
    if (cosmetic.category === 'theme') {
        applyCosmetic(cosmeticId);
    }
    
    updateShopModal();
    return true;
}

function applyCosmetic(cosmeticId) {
    const cosmetic = SHOP_COSMETICS.find(c => c.id === cosmeticId);
    // Free themes are always available
    const isFreeTheme = cosmetic && cosmetic.category === 'theme' && cosmetic.cost === 0;
    if (!cosmetic || (!shopCosmetics.includes(cosmeticId) && !isFreeTheme)) return false;
    
    if (cosmetic.category === 'theme') {
        const themeId = cosmetic.themeId || cosmeticId.replace('theme_', '');
        currentTheme = cosmeticId;
        localStorage.setItem('currentTheme', cosmeticId);
        applyTheme(themeId);
        
        // If custom theme, show color picker
        if (themeId === 'custom') {
            showCustomThemePicker();
        }
    } else if (cosmetic.category === 'particles') {
        currentParticleColor = cosmeticId;
        localStorage.setItem('currentParticleColor', cosmeticId);
    }
    
    updateShopModal();
    return true;
}

// Theme application function
function applyTheme(themeId) {
    // Remove all theme classes
    const themeClasses = ['theme-dark', 'theme-light', 'theme-rainbow', 'theme-spring', 'theme-summer', 'theme-fall', 'theme-winter', 'theme-custom'];
    document.body.classList.remove(...themeClasses);
    
    // Get theme configuration
    const theme = THEMES[themeId] || THEMES.default;
    
    // Apply theme class
    if (theme.class) {
        document.body.classList.add(theme.class);
    }
    
    // Apply custom colors if it's a custom theme
    if (themeId === 'custom' && customThemeColors) {
        applyCustomThemeColors(customThemeColors);
    }
}

// Apply custom theme colors
function applyCustomThemeColors(colors) {
    const root = document.documentElement;
    if (colors.primary) {
        root.style.setProperty('--custom-primary', colors.primary);
        document.body.style.background = colors.primary;
    }
    if (colors.text) {
        root.style.setProperty('--custom-text', colors.text);
        document.querySelectorAll('.text-light, .game-title, #counter, #message').forEach(el => {
            el.style.color = colors.text;
        });
    }
    if (colors.accent) {
        root.style.setProperty('--custom-accent', colors.accent);
    }
}

// Show custom theme color picker
function showCustomThemePicker() {
    // Create or show custom theme picker modal
    let pickerModal = document.getElementById('custom-theme-picker');
    if (!pickerModal) {
        pickerModal = document.createElement('div');
        pickerModal.id = 'custom-theme-picker';
        pickerModal.className = 'modal';
        pickerModal.innerHTML = `
            <div class="modal-content custom-theme-picker-content">
                <span class="close-modal">&times;</span>
                <h2>🎨 Custom Theme</h2>
                <div class="custom-theme-controls">
                    <div class="theme-color-control">
                        <label>Primary Color:</label>
                        <input type="color" id="theme-primary-color" value="${customThemeColors?.primary?.match(/#[0-9a-fA-F]{6}/)?.[0] || '#667eea'}">
                        <input type="color" id="theme-primary-color-2" value="${customThemeColors?.primary2 || '#764ba2'}">
                    </div>
                    <div class="theme-color-control">
                        <label>Text Color:</label>
                        <input type="color" id="theme-text-color" value="${customThemeColors?.text || '#ffffff'}">
                    </div>
                    <div class="theme-color-control">
                        <label>Accent Color:</label>
                        <input type="color" id="theme-accent-color" value="${customThemeColors?.accent || '#FFD700'}">
                    </div>
                    <button id="save-custom-theme" class="shop-buy-btn">Save Theme</button>
                </div>
            </div>
        `;
        document.body.appendChild(pickerModal);
        
        // Add event listeners
        const closeBtn = pickerModal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                pickerModal.style.display = 'none';
            });
        }
        
        const saveBtn = document.getElementById('save-custom-theme');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const primaryColor = document.getElementById('theme-primary-color').value;
                const primaryColor2 = document.getElementById('theme-primary-color-2').value;
                const textColor = document.getElementById('theme-text-color').value;
                const accentColor = document.getElementById('theme-accent-color').value;
                
                customThemeColors = {
                    primary: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor2} 100%)`,
                    primary2: primaryColor2,
                    text: textColor,
                    accent: accentColor
                };
                
                localStorage.setItem('customThemeColors', JSON.stringify(customThemeColors));
                applyTheme('custom');
                pickerModal.style.display = 'none';
                showMilestone('Custom theme saved! 🎨');
            });
        }
        
        // Close on outside click
        pickerModal.addEventListener('click', (e) => {
            if (e.target === pickerModal) {
                pickerModal.style.display = 'none';
            }
        });
    }
    
    // Update color inputs if modal already exists
    if (customThemeColors) {
        const primary1 = document.getElementById('theme-primary-color');
        const primary2 = document.getElementById('theme-primary-color-2');
        const text = document.getElementById('theme-text-color');
        const accent = document.getElementById('theme-accent-color');
        
        if (primary1 && customThemeColors.primary) {
            const color1 = customThemeColors.primary.match(/#[0-9a-fA-F]{6}/)?.[0] || '#667eea';
            primary1.value = color1;
        }
        if (primary2 && customThemeColors.primary2) {
            primary2.value = customThemeColors.primary2;
        }
        if (text && customThemeColors.text) {
            text.value = customThemeColors.text;
        }
        if (accent && customThemeColors.accent) {
            accent.value = customThemeColors.accent;
        }
    }
    
    pickerModal.style.display = 'block';
}

// Sound System Functions
function initializeSoundSystem() {
    try {
        // Initialize AudioContext (required for Web Audio API)
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Setup sound toggle button
        const soundToggle = document.getElementById('sound-toggle');
        const musicToggle = document.getElementById('music-toggle');
        
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                soundEnabled = !soundEnabled;
                localStorage.setItem('soundEnabled', soundEnabled.toString());
                updateSoundControls();
            });
        }
        
        if (musicToggle) {
            musicToggle.addEventListener('click', () => {
                musicEnabled = !musicEnabled;
                localStorage.setItem('musicEnabled', musicEnabled.toString());
                updateSoundControls();
                if (musicEnabled) {
                    startBackgroundMusic();
                } else {
                    stopBackgroundMusic();
                }
            });
        }
        
        updateSoundControls();
        
        // Start background music if enabled
        if (musicEnabled) {
            startBackgroundMusic();
        }
    } catch (e) {
        console.warn('Audio context not supported:', e);
    }
}

function updateSoundControls() {
    const soundIcon = document.getElementById('sound-icon');
    const musicIcon = document.getElementById('music-icon');
    
    if (soundIcon) {
        soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    }
    
    if (musicIcon) {
        musicIcon.textContent = musicEnabled ? '🎵' : '🔇';
    }
}

function playCoinTapSound(isRareCoin = false) {
    if (!soundEnabled || !audioContext) return;
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different frequencies for rare coins
        const baseFreq = isRareCoin ? 880 : 440; // Higher pitch for rare coins
        oscillator.frequency.value = baseFreq;
        oscillator.type = 'sine';
        
        // Envelope: quick attack, quick decay
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01); // Quick attack
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1); // Quick decay
        
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    } catch (e) {
        console.warn('Error playing tap sound:', e);
    }
}

function playMilestoneFanfare() {
    if (!soundEnabled || !audioContext) return;
    
    try {
        // Play a sequence of notes for a fanfare
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (C major chord)
        const noteDuration = 0.15;
        const now = audioContext.currentTime;
        
        notes.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            const startTime = now + (index * noteDuration);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + noteDuration);
        });
    } catch (e) {
        console.warn('Error playing fanfare:', e);
    }
}

function startBackgroundMusic() {
    if (!musicEnabled || !audioContext || backgroundMusicInterval) return;
    
    try {
        // Create a simple looping melody using oscillators
        const melody = [
            { note: 261.63, duration: 0.3 }, // C4
            { note: 293.66, duration: 0.3 }, // D4
            { note: 329.63, duration: 0.3 }, // E4
            { note: 349.23, duration: 0.3 }, // F4
            { note: 392.00, duration: 0.5 }, // G4
            { note: 440.00, duration: 0.5 }, // A4
            { note: 493.88, duration: 0.5 }, // B4
            { note: 523.25, duration: 0.7 }, // C5
        ];
        
        let noteIndex = 0;
        const playNote = () => {
            if (!musicEnabled) return;
            
            const note = melody[noteIndex];
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = note.note;
            oscillator.type = 'sine';
            
            const now = audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.05, now + 0.01); // Very quiet
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.duration * 0.8);
            
            oscillator.start(now);
            oscillator.stop(now + note.duration);
            
            noteIndex = (noteIndex + 1) % melody.length;
        };
        
        // Play first note immediately
        playNote();
        
        // Calculate total duration of melody
        const totalDuration = melody.reduce((sum, note) => sum + note.duration, 0);
        
        // Schedule next plays
        backgroundMusicInterval = setInterval(() => {
            if (musicEnabled) {
                playNote();
            }
        }, totalDuration * 1000);
    } catch (e) {
        console.warn('Error starting background music:', e);
    }
}

function stopBackgroundMusic() {
    if (backgroundMusicInterval) {
        clearInterval(backgroundMusicInterval);
        backgroundMusicInterval = null;
    }
}

// Update stats every second
setInterval(() => {
    if (tapCount < maxTaps) {
        // Remove old taps from history
        const now = Date.now();
        tapHistory = tapHistory.filter(tapTime => now - tapTime < 1000);
        tapsPerSecond = tapHistory.length;
        updateDisplay();
        
        // Track longest session
        const sessionTime = Math.floor((now - sessionStartTime) / 1000);
        if (sessionTime > longestSession) {
            longestSession = sessionTime;
            localStorage.setItem('longestSession', longestSession.toString());
        }
        
        // Track best session time
        if (sessionTime > bestSessionTime) {
            bestSessionTime = sessionTime;
            localStorage.setItem('bestSessionTime', bestSessionTime.toString());
        }
        
        // Update total play time
        totalPlayTime++;
        if (totalPlayTime % 60 === 0) { // Save every minute
            localStorage.setItem('totalPlayTime', totalPlayTime.toString());
        }
        
        // Check marathon achievement (1 hour = 3600 seconds)
        if (sessionTime >= 3600 && !achievements.includes('marathon')) {
            checkAchievement('marathon');
        }
        
        // Check endurance achievement (3 hours = 10800 seconds)
        if (sessionTime >= 10800 && !achievements.includes('endurance')) {
            checkAchievement('endurance');
        }
    }
    
    // Check multiplier expiration
    if (multiplierActive && Date.now() >= multiplierEndTime) {
        deactivateMultiplier();
    }
    
    // Update combo display (for bar animation)
    if (comboCount > 0) {
        updateComboDisplay();
    }
    
    // Update rare coin position if active
    if (rareCoinActive) {
        updateRareCoinPosition();
    }
    
    // Update daily challenges session time
    updateDailyChallengesSession();
    
    // Check time trial progress
    if (timeTrialActive) {
        checkTimeTrialProgress();
    }
}, 100);

// Initial milestone check
if (tapCount >= maxTaps) {
    message.style.display = 'block';
    message.classList.add('celebration');
    coin.style.pointerEvents = 'none';
    coin.style.opacity = '0.6';
}