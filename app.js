/* ===================================================================
   MODERN BIRTHDAY INTERACTIVE EXPERIENCE - CORE APPLICATION LOGIC
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ---------------------------------------------------------
     DEFAULT CONFIGURATION & PERSISTENCE
     --------------------------------------------------------- */
  const defaultPhotos = [
    {
      url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
      date: "'24 08 12",
      caption: '"Hari di mana senyummu menjadi pemandangan paling menenangkan di dunia..."'
    },
    {
      url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
      date: "'24 11 05",
      caption: '"Tawa lepas yang nggak pernah gagal menghangatkan setiap suasana."'
    },
    {
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      date: "'25 01 01",
      caption: '"Menyambut tahun baru dengan harapan-harapan indah bersamamu."'
    },
    {
      url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
      date: "'25 05 20",
      caption: '"Momen sederhana yang selalu meninggalkan rasa syukur mendalam."'
    },
    {
      url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80',
      date: "'26 09 29",
      caption: '"Selamat merayakan usia yang baru! Semoga makin bersinar dan bahagia selalu! ✨"'
    }
  ];

  let config = {
    name: 'Alya Putri',
    pin: '1208',
    hint: 'Format: <strong>DDMM</strong> (Tanggal &amp; bulan lahir kamu, contoh: 12 Agustus = <strong>1208</strong>)',
    sender: 'Dari Seseorang yang Selalu Mengagumimu ✨',
    reward: 'Traktir Makan Malam Bebas Pilih Tempat + 1 Hari Penuh Menuruti Keinginanmu! 🥂✨',
    letter: `Selamat bertambah usia yang manis! 🎂✨

Di usiamu yang baru ini, aku berdoa semoga setiap langkah yang kamu tapaki selalu dilimpahi keberkahan, rezeki yang tak pernah putus, dan hati yang senantiasa tenang serta bahagia.

Terima kasih sudah terlahir ke dunia dan menjadi sosok yang begitu luar biasa. Senyumanmu selalu mampu menghadirkan kehangatan bagi orang-orang di sekitarmu.

Semoga semua impian dan cita-cita besarmu diijabah satu per satu oleh Tuhan Yang Maha Baik. Tetaplah menjadi versi dirimu yang ceria, tangguh, dan memesona.

Selamat menikmati hari istimewamu! 💖`,
    photos: defaultPhotos
  };

  // Load from local storage if available
  try {
    const saved = localStorage.getItem('hbd_editorial_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      config = { ...config, ...parsed };
      if (!config.photos || config.photos.length === 0) {
        config.photos = defaultPhotos;
      }
    }
  } catch (e) {
    console.warn('Storage read error:', e);
  }

  /* ---------------------------------------------------------
     AUTHENTIC AUDIO & SYNTHESIZED SOUND EFFECTS
     --------------------------------------------------------- */
  const hbdAudio = document.getElementById('hbdAudio');
  const quickSoundBtn = document.getElementById('quickSoundBtn');
  const spotifyPlayer = document.getElementById('spotifyPlayer');
  const playerProgressFill = document.getElementById('playerProgressFill');
  const playerCelebrantTag = document.getElementById('playerCelebrantTag');

  let isAudioPlaying = false;
  let audioContext = null;

  function initAudioCtx() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  // Tactile keypad click sound
  function playClickFX(freq = 480) {
    initAudioCtx();
    if (!audioContext) return;
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);
      gain.gain.setValueAtTime(0.06, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + 0.08);
    } catch (e) {}
  }

  // Mechanical Camera Shutter Sound
  function playShutterFX() {
    initAudioCtx();
    if (!audioContext) return;
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1400, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, audioContext.currentTime + 0.09);
      gain.gain.setValueAtTime(0.18, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + 0.09);

      // Rewind gear click
      setTimeout(() => {
        try {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.type = 'sawtooth';
          osc2.frequency.setValueAtTime(320, audioContext.currentTime);
          osc2.frequency.linearRampToValueAtTime(450, audioContext.currentTime + 0.14);
          gain2.gain.setValueAtTime(0.06, audioContext.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.start();
          osc2.stop(audioContext.currentTime + 0.15);
        } catch (e) {}
      }, 80);
    } catch (e) {}
  }

  // Candle Extinguish Sound
  function playBlowFX() {
    initAudioCtx();
    if (!audioContext) return;
    try {
      const bufferSize = audioContext.sampleRate * 0.35;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioContext.createBufferSource();
      noise.buffer = buffer;

      const filter = audioContext.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(700, audioContext.currentTime);
      filter.Q.setValueAtTime(2.5, audioContext.currentTime);

      const gain = audioContext.createGain();
      gain.gain.setValueAtTime(0.16, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.32);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioContext.destination);
      noise.start();
    } catch (e) {}
  }

  // Balloon Pop Sound
  function playPopFX() {
    initAudioCtx();
    if (!audioContext) return;
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.08);
      gain.gain.setValueAtTime(0.25, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + 0.08);
    } catch (e) {}
  }

  // Unlock Success Chime
  function playUnlockFX() {
    initAudioCtx();
    if (!audioContext) return;
    const chords = [523.25, 659.25, 783.99, 1046.50];
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, audioContext.currentTime);
          gain.gain.setValueAtTime(0.12, audioContext.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.4);
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.start();
          osc.stop(audioContext.currentTime + 0.4);
        } catch (e) {}
      }, idx * 90);
    });
  }

  // Audio Playback Controller
  function playGenuineAudio() {
    if (!hbdAudio) return;
    hbdAudio.play().then(() => {
      isAudioPlaying = true;
      updateAudioUIState();
    }).catch(err => {
      console.log('Audio autoplay prevented, awaiting user click:', err);
    });
  }

  function pauseGenuineAudio() {
    if (!hbdAudio) return;
    hbdAudio.pause();
    isAudioPlaying = false;
    updateAudioUIState();
  }

  function toggleAudio() {
    if (isAudioPlaying) {
      pauseGenuineAudio();
    } else {
      playGenuineAudio();
    }
  }

  function updateAudioUIState() {
    if (quickSoundBtn) {
      quickSoundBtn.classList.toggle('playing', isAudioPlaying);
    }
    // Show/hide the mini player bar based on playing state
    if (spotifyPlayer) {
      spotifyPlayer.classList.toggle('playing', isAudioPlaying);
    }
  }

  if (quickSoundBtn) quickSoundBtn.addEventListener('click', toggleAudio);

  // Auto-play music when page loads.
  // Browser autoplay policy requires a user gesture first;
  // we try immediately and fallback to first-click-on-page.
  function attemptAutoPlay() {
    if (!hbdAudio) return;
    hbdAudio.play().then(() => {
      isAudioPlaying = true;
      updateAudioUIState();
    }).catch(() => {
      // Autoplay blocked — wait for first user interaction
      const onFirstInteraction = () => {
        playGenuineAudio();
        document.removeEventListener('click', onFirstInteraction);
        document.removeEventListener('touchstart', onFirstInteraction);
      };
      document.addEventListener('click', onFirstInteraction);
      document.addEventListener('touchstart', onFirstInteraction);
    });
  }
  attemptAutoPlay();

  // Sync Audio Progress Scrubber
  if (hbdAudio && playerProgressFill) {
    hbdAudio.addEventListener('timeupdate', () => {
      if (hbdAudio.duration) {
        const pct = (hbdAudio.currentTime / hbdAudio.duration) * 100;
        playerProgressFill.style.width = `${pct}%`;
      }
    });
  }

  /* ---------------------------------------------------------
     SCENE NAVIGATION SYSTEM
     --------------------------------------------------------- */
  function showScene(sceneId) {
    document.querySelectorAll('.scene').forEach(scene => {
      scene.classList.remove('active');
    });
    const target = document.getElementById(sceneId);
    if (target) {
      target.classList.add('active');
    }
  }

  /* ---------------------------------------------------------
     SCENE 1: EDITORIAL LOADING SCREEN
     --------------------------------------------------------- */
  const progressFill = document.getElementById('progressFill');
  const progressPercent = document.getElementById('progressPercent');
  const loadingStatusText = document.getElementById('loadingStatusText');
  const btnProceedPin = document.getElementById('btnProceedPin');

  const loadingStatuses = [
    'Mengumpulkan lembar-lembar kenangan terindah...',
    'Menyiapkan lilin dan kue perayaan spesial... 🎂',
    'Menghangatkan melodi hari ulang tahunmu... 🎵',
    'Menyegel voucher dan surat penuh rahasia... 💌',
    'Surprise kamu telah siap seutuhnya! ✨'
  ];

  let currentLoadingPct = 0;
  function startEditorialLoading() {
    const timer = setInterval(() => {
      const step = Math.floor(Math.random() * 12) + 7;
      currentLoadingPct += step;

      if (currentLoadingPct >= 100) {
        currentLoadingPct = 100;
        clearInterval(timer);
        if (progressFill) progressFill.style.width = '100%';
        if (progressPercent) progressPercent.textContent = '100%';
        if (loadingStatusText) loadingStatusText.textContent = loadingStatuses[4];
        if (btnProceedPin) {
          btnProceedPin.removeAttribute('disabled');
        }
        triggerMicroConfetti();
      } else {
        if (progressFill) progressFill.style.width = `${currentLoadingPct}%`;
        if (progressPercent) progressPercent.textContent = `${String(currentLoadingPct).padStart(2, '0')}%`;
        const textIdx = Math.min(Math.floor((currentLoadingPct / 100) * 4), 3);
        if (loadingStatusText) loadingStatusText.textContent = loadingStatuses[textIdx];
      }
    }, 240);
  }

  startEditorialLoading();

  if (btnProceedPin) {
    btnProceedPin.addEventListener('click', () => {
      playClickFX(540);
      showScene('scene-pin');
    });
  }

  /* ---------------------------------------------------------
     SCENE 2: iOS-INSPIRED PASSCODE SECURITY
     --------------------------------------------------------- */
  let enteredPin = '';
  const pinDots = document.querySelectorAll('#pinDotsWrapper .pin-dot');
  const pinDotsWrapper = document.getElementById('pinDotsWrapper');
  const pinHintDisplay = document.getElementById('pinHintDisplay');

  function renderPinHint() {
    if (pinHintDisplay) {
      pinHintDisplay.innerHTML = config.hint;
    }
  }
  renderPinHint();

  function updatePinIndicators() {
    pinDots.forEach((dot, index) => {
      if (index < enteredPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
        dot.classList.remove('error');
      }
    });
  }

  function handleKeypadInput(digit) {
    if (enteredPin.length < 4) {
      enteredPin += digit;
      playClickFX(400 + enteredPin.length * 80);
      updatePinIndicators();

      if (enteredPin.length === 4) {
        setTimeout(verifyEnteredPin, 160);
      }
    }
  }

  function verifyEnteredPin() {
    const target = (config.pin || '1208').trim();
    if (enteredPin === target) {
      // PIN SUCCESS
      playUnlockFX();
      triggerConfetti();

      pinDots.forEach(dot => {
        dot.style.background = '#2ecc71';
        dot.style.borderColor = '#2ecc71';
        dot.style.boxShadow = '0 0 14px #2ecc71';
      });

      // Start the genuine Happy Birthday song!
      playGenuineAudio();

      setTimeout(() => {
        showScene('scene-camera');
        initCameraExperience();
      }, 700);
    } else {
      // PIN ERROR
      playClickFX(160);
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      pinDots.forEach(dot => dot.classList.add('error'));
      if (pinDotsWrapper) pinDotsWrapper.classList.add('shake-anim');

      setTimeout(() => {
        enteredPin = '';
        updatePinIndicators();
        if (pinDotsWrapper) pinDotsWrapper.classList.remove('shake-anim');
        pinDots.forEach(dot => dot.classList.remove('error'));
      }, 600);
    }
  }

  document.querySelectorAll('.numpad-key[data-key]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      handleKeypadInput(key);
    });
  });

  const keyClear = document.getElementById('keyClear');
  if (keyClear) {
    keyClear.addEventListener('click', () => {
      playClickFX(320);
      enteredPin = '';
      updatePinIndicators();
    });
  }

  const keyBackspace = document.getElementById('keyBackspace');
  if (keyBackspace) {
    keyBackspace.addEventListener('click', () => {
      playClickFX(350);
      if (enteredPin.length > 0) {
        enteredPin = enteredPin.slice(0, -1);
        updatePinIndicators();
      }
    });
  }

  /* ---------------------------------------------------------
     SCENE 3: RETRO CAMERA VIEWFINDER & REEL (FUJI / LEICA)
     --------------------------------------------------------- */
  const carouselTrack = document.getElementById('carouselTrack');
  const storySegmentsBar = document.getElementById('storySegmentsBar');
  const filmDateStamp = document.getElementById('filmDateStamp');
  const photoCounter = document.getElementById('photoCounter');
  const slideCaption = document.getElementById('slideCaption');
  const camPrevBtn = document.getElementById('camPrevBtn');
  const camNextBtn = document.getElementById('camNextBtn');
  const shutterBtn = document.getElementById('shutterBtn');
  const cameraFlash = document.getElementById('cameraFlash');
  const recTimer = document.getElementById('recTimer');
  const filmSimTag = document.getElementById('filmSimTag');
  const viewfinderLens = document.getElementById('viewfinderLens');
  const btnGoToCake = document.getElementById('btnGoToCake');
  const tapZoneLeft = document.getElementById('tapZoneLeft');
  const tapZoneRight = document.getElementById('tapZoneRight');

  let currentPhotoIdx = 0;
  let recSecs = 24;
  let recInterval = null;

  function renderCameraSlides() {
    const photos = config.photos && config.photos.length > 0 ? config.photos : defaultPhotos;

    // Render Story Bars
    if (storySegmentsBar) {
      storySegmentsBar.innerHTML = '';
      photos.forEach((_, idx) => {
        const seg = document.createElement('div');
        seg.className = `story-segment ${idx === 0 ? 'active' : ''}`;
        storySegmentsBar.appendChild(seg);
      });
    }

    // Render Image Slides
    if (carouselTrack) {
      carouselTrack.innerHTML = '';
      photos.forEach((photo, idx) => {
        const slide = document.createElement('div');
        slide.className = `camera-slide ${idx === 0 ? 'active' : ''}`;
        slide.innerHTML = `<img src="${photo.url}" alt="Memory photo ${idx + 1}" loading="lazy">`;
        carouselTrack.appendChild(slide);
      });
    }

    updateSlideView();
  }

  function updateSlideView() {
    const photos = config.photos && config.photos.length > 0 ? config.photos : defaultPhotos;
    const slides = document.querySelectorAll('.camera-slide');
    const segments = document.querySelectorAll('.story-segment');

    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentPhotoIdx);
    });

    segments.forEach((seg, idx) => {
      seg.classList.remove('filled', 'active');
      if (idx < currentPhotoIdx) {
        seg.classList.add('filled');
      } else if (idx === currentPhotoIdx) {
        seg.classList.add('active');
      }
    });

    const cur = photos[currentPhotoIdx];
    if (cur) {
      if (filmDateStamp) filmDateStamp.textContent = cur.date || "'26 09 29";
      if (photoCounter) photoCounter.textContent = `${currentPhotoIdx + 1} / ${photos.length}`;
      if (slideCaption) slideCaption.textContent = cur.caption || '';
    }
  }

  function nextPhoto() {
    const photos = config.photos && config.photos.length > 0 ? config.photos : defaultPhotos;
    playClickFX(520);
    currentPhotoIdx = (currentPhotoIdx + 1) % photos.length;
    updateSlideView();
  }

  function prevPhoto() {
    const photos = config.photos && config.photos.length > 0 ? config.photos : defaultPhotos;
    playClickFX(470);
    currentPhotoIdx = (currentPhotoIdx - 1 + photos.length) % photos.length;
    updateSlideView();
  }

  if (camNextBtn) camNextBtn.addEventListener('click', nextPhoto);
  if (camPrevBtn) camPrevBtn.addEventListener('click', prevPhoto);
  if (tapZoneRight) tapZoneRight.addEventListener('click', nextPhoto);
  if (tapZoneLeft) tapZoneLeft.addEventListener('click', prevPhoto);

  // Shutter Snapshot Button
  if (shutterBtn) {
    shutterBtn.addEventListener('click', () => {
      playShutterFX();
      if (cameraFlash) {
        cameraFlash.classList.add('flash-active');
        setTimeout(() => {
          cameraFlash.classList.remove('flash-active');
        }, 110);
      }
      triggerMicroConfetti();
      spawnFloatingReaction('✨');
    });
  }

  // Film Simulation Filter Chips
  document.querySelectorAll('.sim-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      playClickFX(580);
      document.querySelectorAll('.sim-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const sim = chip.getAttribute('data-sim');
      if (viewfinderLens) {
        viewfinderLens.className = `viewfinder-lens sim-${sim}`;
      }
      if (filmSimTag) {
        filmSimTag.textContent = sim.toUpperCase();
      }
    });
  });

  // Floating Reactions Bar (Instagram / TikTok Live style)
  document.querySelectorAll('.reaction-bubble').forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.getAttribute('data-emoji') || '❤️';
      playClickFX(650);
      spawnFloatingReaction(emoji);
    });
  });

  function spawnFloatingReaction(emoji) {
    const overlay = document.getElementById('reactionsOverlay');
    if (!overlay) return;

    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = emoji;

    // Random horizontal position near center-right
    const randomLeft = Math.floor(Math.random() * 40) + 45;
    heart.style.left = `${randomLeft}%`;
    heart.style.bottom = '80px';

    overlay.appendChild(heart);
    setTimeout(() => heart.remove(), 2400);
  }

  function initCameraExperience() {
    renderCameraSlides();
    if (!recInterval) {
      recInterval = setInterval(() => {
        recSecs++;
        const mins = String(Math.floor(recSecs / 60)).padStart(2, '0');
        const secs = String(recSecs % 60).padStart(2, '0');
        if (recTimer) recTimer.textContent = `${mins}:${secs}`;
      }, 1000);
    }
  }

  if (btnGoToCake) {
    btnGoToCake.addEventListener('click', () => {
      playClickFX(620);
      showScene('scene-celebration');
      initCelebrationExperience();
    });
  }

  /* ---------------------------------------------------------
     SCENE 4: GRAND CELEBRATION (CAKE, SCRATCH CARD, WISHES)
     --------------------------------------------------------- */
  const hbdCelebrantName = document.getElementById('hbdCelebrantName');
  const cakeInstruction = document.getElementById('cakeInstruction');
  const wishRevealCard = document.getElementById('wishRevealCard');
  const envelopeWrap = document.getElementById('envelopeWrap');
  const envToLabel = document.getElementById('envToLabel');
  const rewardTitle = document.getElementById('rewardTitle');
  const rewardDesc = document.getElementById('rewardDesc');
  const scratchCanvas = document.getElementById('scratchCanvas');
  let candlesLit = 3;

  function initCelebrationExperience() {
    if (hbdCelebrantName) {
      hbdCelebrantName.textContent = `Happy Birthday, ${config.name}!`;
    }
    if (playerCelebrantTag) {
      playerCelebrantTag.textContent = `Special Dedicated to ${config.name}`;
    }
    if (envToLabel) {
      envToLabel.textContent = `Untuk: ${config.name}`;
    }
    if (rewardDesc) {
      rewardDesc.textContent = config.reward;
    }

    // Trigger grand confetti
    triggerGrandConfetti();

    // Reset candles
    resetCelebrationCandles();

    // Init Scratch-off ticket
    initScratchTicket();

    // Render floating balloons
    renderBalloonsCluster();
  }

  function resetCelebrationCandles() {
    candlesLit = 3;
    document.querySelectorAll('.candle').forEach(c => c.classList.remove('extinguished'));
    if (wishRevealCard) wishRevealCard.classList.remove('show');
    if (cakeInstruction) cakeInstruction.textContent = 'Ketuk lilin untuk meniup & memanjatkan permohonan 🕯️';
  }

  // Extinguish candles on tap
  document.querySelectorAll('.candle').forEach(candle => {
    candle.addEventListener('click', (e) => {
      e.stopPropagation();
      extinguishCandle(candle);
    });
  });

  const cakeWrapper = document.getElementById('cakeWrapper');
  if (cakeWrapper) {
    cakeWrapper.addEventListener('click', () => {
      document.querySelectorAll('.candle:not(.extinguished)').forEach(candle => {
        extinguishCandle(candle);
      });
    });
  }

  function extinguishCandle(candleEl) {
    if (candleEl.classList.contains('extinguished')) return;

    candleEl.classList.add('extinguished');
    playBlowFX();
    candlesLit--;

    // Spawn realistic smoke particle
    const smoke = document.createElement('div');
    smoke.className = 'smoke-particle';
    candleEl.appendChild(smoke);
    setTimeout(() => smoke.remove(), 1400);

    if (candlesLit <= 0) {
      triggerGrandConfetti();
      playUnlockFX();
      if (cakeInstruction) {
        cakeInstruction.textContent = 'Semua lilin padam! Permohonanmu telah dikirim ke semesta! ✨';
      }
      if (wishRevealCard) {
        wishRevealCard.classList.add('show');
      }
    }
  }

  /* ---------------------------------------------------------
     FEATURE: INTERACTIVE SCRATCH-OFF VOUCHER CARD
     --------------------------------------------------------- */
  let isScratching = false;
  let scratchedPct = 0;
  let isRewardUnlocked = false;

  function initScratchTicket() {
    if (!scratchCanvas) return;
    const ctx = scratchCanvas.getContext('2d');
    const width = scratchCanvas.width;
    const height = scratchCanvas.height;

    // Fill canvas with silver foil texture
    ctx.globalCompositeOperation = 'source-over';
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#b8b5c4');
    grad.addColorStop(0.3, '#dedae8');
    grad.addColorStop(0.7, '#9f9cae');
    grad.addColorStop(1, '#cac7d6');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative foil stamp text
    ctx.fillStyle = '#4a4756';
    ctx.font = 'bold 13px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('★ GOSOK DI SINI UNTUK MEMBUKA KADO ★', width / 2, height / 2 - 6);

    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6d6a7d';
    ctx.fillText('Kupon Hadiah Rahasia Khusus Hari Ulang Tahunmu', width / 2, height / 2 + 14);

    isRewardUnlocked = false;
    scratchedPct = 0;

    function scratch(x, y) {
      if (isRewardUnlocked) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();

      // Check scratched percentage occasionally
      if (Math.random() < 0.25) {
        checkScratchProgress(ctx, width, height);
      }
    }

    function checkScratchProgress(context, w, h) {
      try {
        const imgData = context.getImageData(0, 0, w, h);
        const pixels = imgData.data;
        let transparent = 0;
        for (let i = 3; i < pixels.length; i += 16) {
          if (pixels[i] === 0) transparent++;
        }
        const totalSampled = pixels.length / 16;
        scratchedPct = Math.round((transparent / totalSampled) * 100);

        if (scratchedPct > 45 && !isRewardUnlocked) {
          isRewardUnlocked = true;
          context.clearRect(0, 0, w, h);
          triggerConfetti();
          playUnlockFX();
          showAppToast('🎉 Selamat! Kupon hadiahmu berhasil terbuka!');
        }
      } catch (e) {}
    }

    function getEventPos(e) {
      const rect = scratchCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const scaleX = scratchCanvas.width / rect.width;
      const scaleY = scratchCanvas.height / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }

    scratchCanvas.onmousedown = (e) => {
      isScratching = true;
      const pos = getEventPos(e);
      scratch(pos.x, pos.y);
    };

    window.onmousemove = (e) => {
      if (!isScratching) return;
      const pos = getEventPos(e);
      scratch(pos.x, pos.y);
    };

    window.onmouseup = () => { isScratching = false; };

    // Mobile Touch Events
    scratchCanvas.ontouchstart = (e) => {
      isScratching = true;
      const pos = getEventPos(e);
      scratch(pos.x, pos.y);
    };

    scratchCanvas.ontouchmove = (e) => {
      if (!isScratching) return;
      e.preventDefault();
      const pos = getEventPos(e);
      scratch(pos.x, pos.y);
    };

    scratchCanvas.ontouchend = () => { isScratching = false; };
  }

  /* ---------------------------------------------------------
     FEATURE: SHOOTING STAR WISH CAPSULE
     --------------------------------------------------------- */
  const btnSendWish = document.getElementById('btnSendWish');
  const userWishInput = document.getElementById('userWishInput');

  if (btnSendWish) {
    btnSendWish.addEventListener('click', () => {
      const wishText = userWishInput.value.trim();
      if (!wishText) {
        showAppToast('Tuliskan harapanmu terlebih dahulu ya! ✨');
        return;
      }

      // Save wish
      try {
        localStorage.setItem('hbd_user_wish', wishText);
      } catch (e) {}

      playUnlockFX();
      triggerConfetti();

      // Launch shooting star particle
      const star = document.createElement('div');
      star.className = 'shooting-star-particle';
      star.style.left = '45%';
      star.style.top = '60%';
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 1600);

      userWishInput.value = '';
      showAppToast('🌌 Harapanmu telah melesat menuju bintang-bintang! Semoga terkabul!');
    });
  }

  /* ---------------------------------------------------------
     FEATURE: BALLOONS PARADE MINI-GAME
     --------------------------------------------------------- */
  const balloonCluster = document.getElementById('balloonCluster');
  const balloonAffirmations = [
    'Semoga rezekimu mengalir deras tanpa henti! 💖',
    'Makin glowing, sehat, dan awet muda selalu! ✨',
    'Semua impian & target hebatmu lekas tercapai! 🚀',
    'Dikelilingi orang-orang yang tulus menyayangimu! 🌸',
    'Selalu dipeluk kebahagiaan dan kedamaian hati! 🌟'
  ];

  const balloonPalette = ['#e67389', '#70d6ff', '#e5c38e', '#b388ff'];

  function renderBalloonsCluster() {
    if (!balloonCluster) return;
    balloonCluster.innerHTML = '';

    balloonPalette.forEach((color, idx) => {
      const node = document.createElement('div');
      node.className = 'balloon-node';
      node.innerHTML = `
        <div class="balloon-orb" style="background: ${color}; color: ${color};"></div>
        <div class="balloon-twine"></div>
      `;

      node.addEventListener('click', () => {
        playPopFX();
        triggerMicroConfetti();
        node.style.transform = 'scale(1.4)';
        node.style.opacity = '0';
        setTimeout(() => { node.style.visibility = 'hidden'; }, 150);

        showAppToast(balloonAffirmations[idx % balloonAffirmations.length]);
      });

      balloonCluster.appendChild(node);
    });
  }

  function showAppToast(msg) {
    let toast = document.querySelector('.app-toast-alert');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'app-toast-alert';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
  }

  /* ---------------------------------------------------------
     FEATURE: WAX-SEALED LOVE LETTER MODAL
     --------------------------------------------------------- */
  const letterModal = document.getElementById('letterModal');
  const closeLetterBtn = document.getElementById('closeLetterBtn');
  const letterToName = document.getElementById('letterToName');
  const letterBodyText = document.getElementById('letterBodyText');
  const letterFromName = document.getElementById('letterFromName');
  const replayCelebrationBtn = document.getElementById('replayCelebrationBtn');
  const shareWishBtn = document.getElementById('shareWishBtn');

  if (envelopeWrap) {
    envelopeWrap.addEventListener('click', () => {
      playUnlockFX();
      openLoveLetter();
    });
  }

  function openLoveLetter() {
    if (letterToName) letterToName.textContent = `Untuk ${config.name} yang Sangat Istimewa,`;
    if (letterFromName) letterFromName.textContent = config.sender;

    if (letterBodyText) {
      letterBodyText.textContent = '';
      letterModal.classList.add('open');
      typewriterPrint(config.letter, letterBodyText);
    }
    triggerConfetti();
  }

  function closeLoveLetter() {
    if (letterModal) letterModal.classList.remove('open');
  }

  if (closeLetterBtn) closeLetterBtn.addEventListener('click', closeLoveLetter);

  function typewriterPrint(text, container) {
    let idx = 0;
    container.textContent = '';
    const speed = 16;
    function printNext() {
      if (idx < text.length) {
        container.textContent += text.charAt(idx);
        idx++;
        setTimeout(printNext, speed);
      }
    }
    printNext();
  }

  if (replayCelebrationBtn) {
    replayCelebrationBtn.addEventListener('click', () => {
      triggerGrandConfetti();
      playUnlockFX();
    });
  }

  if (shareWishBtn) {
    shareWishBtn.addEventListener('click', () => {
      const shareMsg = `🎉 Selamat Ulang Tahun, ${config.name}!\n\n${config.letter}\n\n${config.sender}`;
      if (navigator.share) {
        navigator.share({
          title: `Happy Birthday ${config.name}`,
          text: shareMsg,
          url: window.location.href
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareMsg);
        showAppToast('✅ Pesan ucapan berhasil disalin ke clipboard!');
      }
    });
  }

  /* ---------------------------------------------------------
     FEATURE: CUSTOMIZER DRAWER
     --------------------------------------------------------- */
  const settingsModal = document.getElementById('settingsModal');
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const btnSaveSettings = document.getElementById('btnSaveSettings');
  const inputName = document.getElementById('inputName');
  const inputPin = document.getElementById('inputPin');
  const inputHint = document.getElementById('inputHint');
  const inputSender = document.getElementById('inputSender');
  const inputReward = document.getElementById('inputReward');
  const inputLetter = document.getElementById('inputLetter');
  const inputCustomFiles = document.getElementById('inputCustomFiles');
  const btnResetDefaultPhotos = document.getElementById('btnResetDefaultPhotos');

  if (openSettingsBtn) {
    openSettingsBtn.addEventListener('click', () => {
      inputName.value = config.name;
      inputPin.value = config.pin;
      inputHint.value = config.hint;
      inputSender.value = config.sender;
      inputReward.value = config.reward;
      inputLetter.value = config.letter;
      settingsModal.classList.add('open');
    });
  }

  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', () => {
      settingsModal.classList.remove('open');
    });
  }

  // Handle Local Photo File Pickers
  if (inputCustomFiles) {
    inputCustomFiles.addEventListener('change', (e) => {
      const files = Array.from(e.target.files).slice(0, 5);
      if (files.length === 0) return;

      const userPhotos = [];
      let count = 0;

      files.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          userPhotos.push({
            url: ev.target.result,
            date: `'26 09 29`,
            caption: `"Momen spesial kita bersama ${config.name}..."`
          });
          count++;
          if (count === files.length) {
            config.photos = userPhotos;
            showAppToast(`📸 Berhasil memuat ${files.length} foto kenangan!`);
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }

  if (btnResetDefaultPhotos) {
    btnResetDefaultPhotos.addEventListener('click', () => {
      config.photos = defaultPhotos;
      showAppToast('Foto dikembalikan ke template bawaan.');
    });
  }

  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', () => {
      config.name = inputName.value.trim() || 'Alya Putri';
      config.pin = inputPin.value.trim() || '1208';
      config.hint = inputHint.value.trim() || 'Format: DDMM';
      config.sender = inputSender.value.trim() || 'Dari Sahabatmu';
      config.reward = inputReward.value.trim() || 'Traktir Makan Bebas Pilih Tempat! 🥂✨';
      config.letter = inputLetter.value.trim();

      try {
        localStorage.setItem('hbd_editorial_v2', JSON.stringify(config));
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }

      renderPinHint();
      if (hbdCelebrantName) hbdCelebrantName.textContent = `Happy Birthday, ${config.name}!`;
      if (playerCelebrantTag) playerCelebrantTag.textContent = `Special Dedicated to ${config.name}`;
      if (envToLabel) envToLabel.textContent = `Untuk: ${config.name}`;
      if (rewardDesc) rewardDesc.textContent = config.reward;

      renderCameraSlides();
      settingsModal.classList.remove('open');
      showAppToast('✅ Pengaturan berhasil diperbarui!');
    });
  }

  /* ---------------------------------------------------------
     CONFETTI PARTICLE EFFECTS
     --------------------------------------------------------- */
  function triggerMicroConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.7 }
      });
    }
  }

  function triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.6 }
      });
    }
  }

  function triggerGrandConfetti() {
    if (typeof confetti === 'function') {
      const end = Date.now() + 2.4 * 1000;
      const colors = ['#e5c38e', '#e67389', '#70d6ff', '#ffd166', '#ffffff'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }
});
