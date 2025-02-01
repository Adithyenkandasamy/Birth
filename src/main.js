import './style.css';
import { Howl } from 'howler';
import { formatDistance } from 'date-fns';

const targetDate = new Date('2025-02-07T00:00:00');
const images = [
  'https://placekitten.com/800/800',
  'https://placekitten.com/801/801',
  'https://placekitten.com/802/802',
  'https://placekitten.com/803/803',
  'https://placekitten.com/804/804',
  'https://placekitten.com/805/805',
  'https://placekitten.com/806/806',
  'https://placekitten.com/807/807',
  'https://placekitten.com/808/808',
  'https://placekitten.com/809/809'
];

const bgMusic = new Howl({
  src: ['https://assets.mixkit.co/music/preview/mixkit-happy-birthday-tune-527.mp3'],
  loop: true,
  volume: 0.7
});

function createConfetti() {
  const colors = ['#ff69b4', '#ff1493', '#ff00ff', '#ff0000', '#ffd700', '#ff8c00'];
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 3 + 's';
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 10 + 5 + 'px';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }
}

function isBirthdayToday() {
  const now = new Date();
  return now.getFullYear() === 2025 && now.getMonth() === 1 && now.getDate() === 7;
}

function createApp() {
  const app = document.getElementById('app');
  const isToday = isBirthdayToday();
  
  app.innerHTML = `
    <div class="p-4 min-h-screen bg-gradient-to-b from-black via-pink-900 to-black flex flex-col items-center justify-center">
      <h1 id="countdown" class="text-6xl text-center text-pink-500 font-bold mb-4 sparkle"></h1>
      
      ${isToday ? `
        <div id="mainImage" class="w-full max-w-2xl h-64 mb-4 relative overflow-hidden rounded-lg transform hover:scale-105 transition-transform duration-500">
          <img src="${images[0]}" class="w-full h-full object-cover shadow-2xl" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
        </div>
        
        <p id="message" class="text-3xl text-center text-white mb-8 fade-in hidden bounce">
          🎂 Happy Birthday! May all your wishes come true! 🎈
        </p>
        
        <div id="gallery" class="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl">
          ${images.map(src => `
            <div class="gallery-item relative overflow-hidden rounded-lg">
              <img src="${src}" 
                   class="w-full aspect-square object-cover cursor-pointer"
                   onclick="window.selectImage('${src}')" />
              <div class="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          `).join('')}
        </div>
      ` : `
        <p class="text-2xl text-center text-white mt-8 fade-in">
          Come back on February 7th, 2025 for a special surprise! 🎁
        </p>
      `}
    </div>
  `;

  if (!isToday) {
    const installPrompt = document.createElement('div');
    installPrompt.className = 'fixed bottom-4 left-4 right-4 bg-pink-500 text-white p-4 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300';
    installPrompt.innerHTML = `
      Install this app to not miss the special day:<br>
      📱 iOS: Tap share button → "Add to Home Screen"<br>
      🤖 Android: Tap menu → "Add to Home Screen"
    `;
    document.body.appendChild(installPrompt);
    
    setTimeout(() => {
      installPrompt.classList.add('fade-out');
      setTimeout(() => installPrompt.remove(), 1000);
    }, 10000);
  }
}

function updateCountdown() {
  const now = new Date();
  const countdownEl = document.getElementById('countdown');
  
  if (now >= targetDate) {
    countdownEl.textContent = "🎉 Happy Birthday! 🎉";
    if (isBirthdayToday()) {
      startCelebration();
    }
  } else {
    countdownEl.textContent = formatDistance(targetDate, now, { addSuffix: true });
    setTimeout(updateCountdown, 1000);
  }
}

function startCelebration() {
  document.getElementById('message')?.classList.remove('hidden');
  bgMusic.play();
  
  const mainImage = document.querySelector('#mainImage img');
  if (mainImage) {
    mainImage.classList.add('image-explosion');
    
    setInterval(createConfetti, 2000);
    
    let currentIndex = 0;
    setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      mainImage.style.opacity = '0';
      setTimeout(() => {
        mainImage.src = images[currentIndex];
        mainImage.style.opacity = '1';
        mainImage.classList.remove('image-explosion');
        void mainImage.offsetWidth;
        mainImage.classList.add('image-explosion');
      }, 300);
    }, 3000);
  }
}

window.selectImage = (src) => {
  const mainImage = document.querySelector('#mainImage img');
  if (mainImage) {
    mainImage.style.opacity = '0';
    setTimeout(() => {
      mainImage.src = src;
      mainImage.style.opacity = '1';
      mainImage.classList.remove('image-explosion');
      void mainImage.offsetWidth;
      mainImage.classList.add('image-explosion');
      createConfetti();
    }, 300);
  }
};

function checkBirthdayAndNotify() {
  if (isBirthdayToday()) {
    const lastCheck = localStorage.getItem('lastBirthdayCheck');
    const today = new Date().toDateString();
    
    if (lastCheck !== today) {
      localStorage.setItem('lastBirthdayCheck', today);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 Happy Birthday!', {
          body: 'Your special day has arrived! Open the app to celebrate!',
          icon: '/icon-192.png'
        });
      } else {
        alert('🎉 Happy Birthday! Your special day has arrived!');
      }
    }
  }
}

document.addEventListener('click', () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}, { once: true });

createApp();
updateCountdown();
checkBirthdayAndNotify();