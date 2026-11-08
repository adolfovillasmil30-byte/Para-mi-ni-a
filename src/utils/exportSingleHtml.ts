/**
 * Generates and downloads a complete standalone single-file index.html
 * containing pure HTML, CSS and Vanilla JS with all romantic features embedded.
 */

export function downloadStandaloneIndexHtml() {
  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gracias por decir que si mi niña - Nuestro primer álbum</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    :root {
      --bg: #FAF6F0;
      --card-bg: #FDFBF7;
      --text: #4A3E3D;
      --muted: #8C7A75;
      --rose: #B83A4B;
      --rose-light: #F7E3E5;
      --rose-border: #EAD7D1;
      --gold: #D4AF37;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Poppins', sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }
    canvas#hearts-canvas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }
    .container {
      position: relative;
      z-index: 10;
      max-width: 900px;
      margin: 0 auto;
      padding: 2.5rem 1.25rem 4rem;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .font-script {
      font-family: 'Great Vibes', cursive;
    }
    .font-serif {
      font-family: 'Playfair Display', Georgia, serif;
    }
    .font-cormorant {
      font-family: 'Cormorant Garamond', Georgia, serif;
    }
    .music-btn {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 50;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid var(--rose-border);
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      color: var(--text);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      backdrop-filter: blur(8px);
      transition: all 0.2s;
    }
    .music-btn:hover {
      background: var(--rose-light);
    }
    .music-btn.active {
      background: #F7EBE8;
      border-color: var(--rose);
      color: var(--rose);
    }
    /* Section 1: Lock / Welcome */
    .welcome-card {
      background: var(--card-bg);
      border: 1px solid var(--rose-border);
      border-radius: 2rem;
      padding: 3rem 2rem;
      text-align: center;
      box-shadow: 0 15px 35px rgba(184, 58, 75, 0.06);
      width: 100%;
      max-width: 580px;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .flourish {
      font-size: 2.5rem;
      color: var(--rose);
      line-height: 1;
      margin-bottom: 0.5rem;
    }
    .sub-kicker {
      font-size: 1.5rem;
      color: var(--gold);
      margin-bottom: 0.5rem;
    }
    h1.main-title {
      font-size: 2.2rem;
      color: #2D1E1C;
      font-weight: 700;
      line-height: 1.25;
      margin-bottom: 1.5rem;
    }
    .divider {
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      margin: 0 auto 1.75rem;
    }
    .lock-form {
      margin-top: 1rem;
    }
    .input-group {
      position: relative;
      margin-bottom: 1rem;
    }
    .secret-input {
      width: 100%;
      padding: 0.85rem 1.25rem;
      border-radius: 1rem;
      border: 1.5px solid var(--rose-border);
      background: #FFFFFF;
      font-size: 1rem;
      text-align: center;
      color: var(--text);
      outline: none;
      transition: all 0.2s;
      letter-spacing: 2px;
    }
    .secret-input:focus {
      border-color: var(--rose);
      box-shadow: 0 0 0 3px rgba(184, 58, 75, 0.12);
    }
    .unlock-btn {
      width: 100%;
      padding: 0.85rem 1.5rem;
      border-radius: 1rem;
      border: none;
      background: linear-gradient(135deg, #B83A4B, #9E2A3B);
      color: #FFFFFF;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(184, 58, 75, 0.25);
      transition: all 0.2s;
    }
    .unlock-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(184, 58, 75, 0.35);
    }
    .error-msg {
      margin-top: 1rem;
      font-size: 0.88rem;
      color: #B83A4B;
      background: #FDF0F2;
      border: 1px solid #F5D3D8;
      border-radius: 0.75rem;
      padding: 0.6rem 1rem;
      display: none;
      animation: shake 0.4s ease;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }

    /* Section 2: Protected Album */
    .album-section {
      display: none;
      width: 100%;
      max-width: 820px;
      animation: fadeIn 0.8s ease forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .album-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }
    .album-title {
      font-size: 2.4rem;
      color: #2D1E1C;
      font-weight: 700;
    }
    .album-subtitle {
      font-size: 0.95rem;
      color: var(--muted);
      margin-top: 0.5rem;
    }
    .memories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.25rem;
      width: 100%;
    }
    .memory-item {
      background: var(--card-bg);
      border: 1px solid var(--rose-border);
      border-radius: 1.25rem;
      padding: 1.5rem 1.25rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    }
    .memory-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #F7D6D9, #D4AF37);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .memory-item:hover {
      transform: translateY(-5px);
      border-color: #E2B7B0;
      box-shadow: 0 12px 24px rgba(184, 58, 75, 0.1);
    }
    .memory-item:hover::before {
      opacity: 1;
    }
    .item-icon-circle {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #FAF0ED;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      margin-bottom: 1rem;
      border: 1px solid #F0D5CF;
    }
    .item-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #3A2A28;
      margin-bottom: 0.35rem;
    }
    .item-kicker {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--muted);
    }

    /* Modal / Pop-up Card */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(43, 27, 23, 0.45);
      backdrop-filter: blur(4px);
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .modal-card {
      background: var(--card-bg);
      border: 1px solid var(--rose-border);
      border-radius: 1.75rem;
      width: 100%;
      max-width: 480px;
      padding: 2.25rem 2rem;
      position: relative;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      text-align: center;
      animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes modalPop {
      from { transform: scale(0.92); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: transparent;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: var(--muted);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-close:hover {
      background: #F7EBE8;
      color: var(--rose);
    }
    .modal-icon {
      font-size: 2.2rem;
      margin-bottom: 0.75rem;
    }
    .modal-item-title {
      font-size: 1.6rem;
      color: #2D1E1C;
      margin-bottom: 0.25rem;
    }
    .modal-tender {
      background: #FAF3F0;
      border: 1px solid #EFE1DC;
      border-radius: 1rem;
      padding: 1.25rem;
      margin: 1.25rem 0;
      text-align: left;
    }
    .modal-tender-title {
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--rose);
      margin-bottom: 0.4rem;
    }
    .modal-poetic {
      font-size: 1.05rem;
      font-style: italic;
      line-height: 1.6;
      color: #3A2A28;
    }
    .relock-link {
      margin-top: 2rem;
      background: none;
      border: none;
      color: var(--muted);
      font-size: 0.8rem;
      cursor: pointer;
      text-decoration: underline;
    }
    .relock-link:hover {
      color: var(--rose);
    }
  </style>
</head>
<body>
  <!-- Music Box Toggle -->
  <button id="music-btn" class="music-btn">
    <span>🎵</span> <span id="music-text">Música romántica</span>
  </button>

  <!-- Background Hearts Canvas -->
  <canvas id="hearts-canvas"></canvas>

  <div class="container">
    <!-- SECCIÓN 1: PANTALLA DE INICIO Y ACCESO POR CLAVE -->
    <div id="lock-section" class="welcome-card">
      <div class="flourish font-script">♥</div>
      <div class="sub-kicker font-script">Para mi persona favorita</div>
      <!-- MENSAJE PRINCIPAL REQUERIDO EXACTO -->
      <h1 class="main-title font-serif">Gracias por decir que si mi niña</h1>
      <div class="divider"></div>

      <div class="lock-form">
        <p style="font-size: 0.88rem; color: #8C7A75; margin-bottom: 1.25rem;">
          Aquí guardo con todo mi amor los momentos más hermosos e inolvidables que hemos compartido juntos.<br>Introduce nuestra clave para abrir nuestro álbum:
        </p>

        <div class="input-group">
          <input 
            type="password" 
            id="password-input" 
            class="secret-input" 
            placeholder="Introduce la clave..."
            autocomplete="off"
          />
        </div>

        <button id="unlock-btn" class="unlock-btn">
          ✨ Abrir nuestro álbum
        </button>

        <div id="error-message" class="error-msg">
          Mmm, intenta de nuevo, mi amor
        </div>
      </div>
    </div>

    <!-- SECCIÓN 2: NUESTRO PRIMER ÁLBUM (PROTEGIDO) -->
    <div id="album-section" class="album-section">
      <div class="album-header">
        <span class="font-script" style="font-size: 2rem; color: #B83A4B; display: block;">Nuestra Historia</span>
        <h2 class="album-title font-serif">Nuestro primer álbum</h2>
        <p class="album-subtitle">11 capítulos inolvidables guardados en el corazón</p>
        <div class="divider" style="margin-top: 1rem;"></div>
      </div>

      <div class="memories-grid" id="memories-grid">
        <!-- Generado dinámicamente con los 11 elementos exactos -->
      </div>

      <div style="text-align: center; margin-top: 2rem;">
        <button id="relock-btn" class="relock-link">🔒 Cerrar y proteger álbum</button>
      </div>
    </div>
  </div>

  <!-- POP-UP MODAL CARDS -->
  <div id="memory-modal" class="modal-overlay">
    <div class="modal-card">
      <button id="modal-close-btn" class="modal-close">&times;</button>
      <div class="modal-icon" id="modal-icon">✨</div>
      <div id="modal-tagline" style="font-size: 0.75rem; text-transform: uppercase; color: #B83A4B; letter-spacing: 1px; font-weight: 600;"></div>
      <h3 class="modal-item-title font-serif" id="modal-title"></h3>
      
      <div class="modal-tender">
        <div class="modal-tender-title" id="modal-tender-title">Un recuerdo inolvidable...</div>
        <div class="modal-poetic font-cormorant" id="modal-poetic"></div>
      </div>

      <p style="font-size: 0.78rem; color: #8C7A75; font-style: italic;">
        "Gracias por cada segundo a tu lado, mi niña."
      </p>
    </div>
  </div>

  <script>
    // 11 ELEMENTOS EXACTOS REQUERIDOS
    const MEMORIES = [
      {
        id: 1,
        text: "1- la fiesta",
        tagline: "El instante en que todo empezó",
        tender: "Un recuerdo inolvidable...",
        poetic: "Donde entre tantas luces y canciones, tu mirada fue lo único que detuvo por completo mi mundo.",
        icon: "✨"
      },
      {
        id: 2,
        text: "2- 31 oct.",
        tagline: "Noche de magia",
        tender: "Un recuerdo inolvidable...",
        poetic: "Esa fecha mágica donde lo inesperado se convirtió en el regalo más lindo que la vida me pudo dar.",
        icon: "🎃"
      },
      {
        id: 3,
        text: "3- hasta luego",
        tagline: "La dulce espera",
        tender: "Un recuerdo inolvidable...",
        poetic: "Despedirnos siempre fue difícil, pero saber que volvería a verte hacía que cada latido valiera la pena.",
        icon: "⏳"
      },
      {
        id: 4,
        text: "4- esa noche",
        tagline: "Bajo las estrellas",
        tender: "Un recuerdo inolvidable...",
        poetic: "Cuando las horas se pasaron como segundos y comprendí que quería quedarme en tus brazos para siempre.",
        icon: "🌙"
      },
      {
        id: 5,
        text: "5- llamadas",
        tagline: "Horas sin final",
        tender: "Un recuerdo inolvidable...",
        poetic: "Quedarnos dormidos hablando, riéndonos de todo y no queriendo colgar nunca.",
        icon: "📞"
      },
      {
        id: 6,
        text: "6- la piscina",
        tagline: "Risas bajo el sol",
        tender: "Un recuerdo inolvidable...",
        poetic: "Salpicadas de agua, tu risa cristalina y ese momento de frescura y complicidad tan nuestro.",
        icon: "🌊"
      },
      {
        id: 7,
        text: "7- titulo",
        tagline: "Nuestra verdad",
        tender: "Un recuerdo inolvidable...",
        poetic: "Buscando la palabra precisa para nombrar lo que somos, aunque cualquier título se queda corto ante tanto amor.",
        icon: "✒️"
      },
      {
        id: 8,
        text: "8- fCaDMv",
        tagline: "Nuestra clave secreta",
        tender: "Un recuerdo inolvidable...",
        poetic: "Las seis letras sagradas que guardan nuestros secretos más íntimos y que solo nosotros dos conocemos.",
        icon: "🔑"
      },
      {
        id: 9,
        text: "9- tarde o temprano",
        tagline: "El destino escrito",
        tender: "Un recuerdo inolvidable...",
        poetic: "Porque siempre supe en el fondo del corazón que tarde o temprano íbamos a terminar juntos.",
        icon: "🧭"
      },
      {
        id: 10,
        text: "10- las visitas",
        tagline: "Kilómetros de ilusión",
        tender: "Un recuerdo inolvidable...",
        poetic: "Esos instantes en que verte un ratito cambiaba la semana entera y llenaba mi corazón de luz.",
        icon: "🏡"
      },
      {
        id: 11,
        text: "11- comienzo",
        tagline: "El mejor 'Sí'",
        tender: "Un recuerdo inolvidable...",
        poetic: "El inicio de nuestra hermosa historia de amor. Gracias por darme el sí más esperado, mi niña.",
        icon: "💖"
      }
    ];

    // Floating Hearts Canvas
    const canvas = document.getElementById('hearts-canvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const heartColors = [
      'rgba(244, 187, 194, ',
      'rgba(235, 148, 161, ',
      'rgba(218, 165, 152, ',
      'rgba(224, 188, 140, '
    ];

    const hearts = [];
    const count = 22;

    function createHeart(initY) {
      return {
        x: Math.random() * width,
        y: initY !== undefined ? initY : height + 20,
        size: 8 + Math.random() * 14,
        speedY: 0.5 + Math.random() * 0.6,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayDist: 15 + Math.random() * 20,
        angle: Math.random() * Math.PI * 2,
        opacity: 0.15 + Math.random() * 0.2,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        rot: (Math.random() - 0.5) * 0.4
      };
    }

    for (let i = 0; i < count; i++) {
      hearts.push(createHeart(Math.random() * height));
    }

    function drawHeart(x, y, size, rot, color, op) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      const topH = size * 0.3;
      ctx.moveTo(0, topH);
      ctx.bezierCurveTo(-size/2, -topH, -size, size/3, 0, size);
      ctx.bezierCurveTo(size, size/3, size/2, -topH, 0, topH);
      ctx.fillStyle = color + op + ')';
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < hearts.length; i++) {
        const h = hearts[i];
        h.y -= h.speedY;
        h.angle += h.swaySpeed;
        const curX = h.x + Math.sin(h.angle) * h.swayDist;
        drawHeart(curX, h.y, h.size, h.rot, h.color, h.opacity);
        if (h.y < -30) hearts[i] = createHeart(height + 20);
      }
      requestAnimationFrame(animate);
    }
    animate();

    // DOM Elements
    const lockSection = document.getElementById('lock-section');
    const albumSection = document.getElementById('album-section');
    const passwordInput = document.getElementById('password-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const errorMsg = document.getElementById('error-message');
    const memoriesGrid = document.getElementById('memories-grid');
    const relockBtn = document.getElementById('relock-btn');

    // Modal elements
    const modal = document.getElementById('memory-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalIcon = document.getElementById('modal-icon');
    const modalTagline = document.getElementById('modal-tagline');
    const modalTitle = document.getElementById('modal-title');
    const modalTenderTitle = document.getElementById('modal-tender-title');
    const modalPoetic = document.getElementById('modal-poetic');

    // Populate Album Grid
    MEMORIES.forEach(item => {
      const card = document.createElement('div');
      card.className = 'memory-item';
      card.innerHTML = \`
        <div class="item-icon-circle">\${item.icon}</div>
        <div class="item-kicker">\${item.tagline}</div>
        <div class="item-title font-serif">\${item.text}</div>
      \`;
      card.addEventListener('click', () => {
        openModal(item);
      });
      memoriesGrid.appendChild(card);
    });

    // Check Password Function
    function checkPassword() {
      const entered = passwordInput.value.trim();
      if (entered === "152314") {
        // Correct Password
        errorMsg.style.display = 'none';
        lockSection.style.display = 'none';
        albumSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Incorrect Password
        errorMsg.textContent = "Mmm, intenta de nuevo, mi amor";
        errorMsg.style.display = 'block';
        passwordInput.style.borderColor = '#B83A4B';
        setTimeout(() => {
          passwordInput.style.borderColor = 'var(--rose-border)';
        }, 800);
      }
    }

    unlockBtn.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkPassword();
    });

    relockBtn.addEventListener('click', () => {
      albumSection.style.display = 'none';
      lockSection.style.display = 'block';
      passwordInput.value = '';
      errorMsg.style.display = 'none';
    });

    function openModal(item) {
      modalIcon.textContent = item.icon;
      modalTagline.textContent = item.tagline;
      modalTitle.textContent = item.text;
      modalTenderTitle.textContent = item.tender;
      modalPoetic.textContent = '"' + item.poetic + '"';
      modal.style.display = 'flex';
    }

    modalCloseBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

    // Web Audio romantic ambient generator
    let audioCtx = null;
    let isPlaying = false;
    let musicTimer = null;
    let noteIdx = 0;
    const melody = [523.25, 659.25, 783.99, 987.77, 1046.50, 783.99, 880.00, 659.25, 587.33, 698.46, 880.00, 659.25, 523.25, 659.25, 783.99, 587.33];

    function playTone(freq) {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 1.8);
    }

    function stepMusic() {
      if (!isPlaying) return;
      playTone(melody[noteIdx]);
      noteIdx = (noteIdx + 1) % melody.length;
      musicTimer = setTimeout(stepMusic, 540);
    }

    const musicBtn = document.getElementById('music-btn');
    musicBtn.addEventListener('click', () => {
      if (isPlaying) {
        isPlaying = false;
        clearTimeout(musicTimer);
        musicBtn.classList.remove('active');
        document.getElementById('music-text').textContent = 'Música romántica';
      } else {
        isPlaying = true;
        musicBtn.classList.add('active');
        document.getElementById('music-text').textContent = 'Música sonando ♥';
        stepMusic();
      }
    });
  <\/script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nuestro_primer_album_romantico.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
