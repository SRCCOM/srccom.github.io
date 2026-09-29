<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>حساب النتائج</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alan+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">

  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --text: #1d1d1f;
      --muted: #86868b;
      --border: #ccc;
      --surface: #fff;
      --bg: #f5f5f7;
      --green: #00b295;
      --green-light: #4fdcc6;
      --shadow: 0 12px 32px rgba(0,0,0,.08), 0 2px 8px rgba(0,0,0,.04);
      color-scheme: light dark;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --text: #f5f5f7; --muted: #8e8e93; --border: #38383a;
        --surface: #1c1c1e; --bg: #000;
        --shadow: 0 12px 32px rgba(0,0,0,.55), 0 2px 8px rgba(0,0,0,.35);
      }
    }

    html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }

    body {
      min-height: 100vh;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: clamp(14px, 3vh, 26px);
      padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right))
               max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
      background: var(--bg);
      color: var(--text);
      font-family: "Alan Sans", "SF Pro Text", "Segoe UI", Tahoma, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    h1 {
      font-size: clamp(22px, 5vw, 30px);
      font-weight: 700;
      line-height: 1.3;
      text-align: center;
    }

    .sub {
      display: grid;
      width: 100%;
      max-width: 400px;
      margin-top: calc(clamp(14px, 3vh, 26px) * -0.4);
      font-size: clamp(12.5px, 3.3vw, 14px);
      font-weight: 300;
      line-height: 1.9;
      color: var(--muted);
      text-align: center;
    }
    .sub > span { grid-area: 1 / 1; }
    .sub .ghost { visibility: hidden; }
    .sub .typed.typing::after {
      content: "";
      display: inline-block;
      width: 1.5px;
      height: 1em;
      margin-inline-start: 2px;
      vertical-align: text-bottom;
      background: var(--green);
      animation: blink .8s steps(1) infinite;
    }
    @keyframes blink { 50% { opacity: 0; } }

    .card {
      width: 100%;
      max-width: 340px;
      padding: clamp(18px, 4vw, 26px) clamp(16px, 4vw, 22px) clamp(34px, 7vw, 46px);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 22px;
      box-shadow: var(--shadow);
    }
    .card h2 {
      margin-bottom: 16px;
      font-size: 13px;
      font-weight: 600;
      color: var(--muted);
      text-align: center;
    }

    .btn-col { display: flex; flex-direction: column; align-items: center; gap: 12px; }

    .btn {
      width: 100%;
      max-width: 210px;
      padding: 10px 14px;
      font: inherit;
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      background: var(--green);
      border: 2px solid var(--green-light);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--green-light) 30%, transparent);
      border-radius: 980px;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      transition: opacity .15s ease, transform .1s ease;
    }
    .btn:hover { opacity: .85; }
    .btn:active { transform: scale(.97); }

    main {
      margin-block: auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: clamp(14px, 3vh, 26px);
    }

    footer { text-align: center; padding-top: 12px; }
    .welcome { font-size: 14px; font-weight: 600; }
    .clock { margin-top: 4px; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }

    @media (max-height: 420px) {
      body { justify-content: flex-start; }
    }
    @media (prefers-reduced-motion: reduce) {
      .btn { transition: none; }
    }
  </style>
</head>

<body>
  <main>
  <h1>حساب النتائج</h1>
  <p class="sub" id="sub" aria-label="الحاسبة الوظيفية هي موقع يقدم عدة خدمات تساعدك في معرفة نظام تدرجك الوظيفي ومراقبة الغبن وتأخر الترقيات والعلاوات إذا ما وجدت">
    <span class="ghost" aria-hidden="true">الحاسبة الوظيفية هي موقع يقدم عدة خدمات تساعدك في معرفة نظام تدرجك الوظيفي ومراقبة الغبن وتأخر الترقيات والعلاوات إذا ما وجدت</span>
    <span class="typed" id="typed" aria-hidden="true"></span>
  </p>

  <section class="card" aria-label="أزرار الحساب">
    <h2>اختر نوع الحساب</h2>
    <div class="btn-col">
      <button id="calcBtn" class="btn" type="button">حساب قصاصة الراتب</button>
      <button id="calcBtn2" class="btn" type="button">حساب مدور الخدمة</button>
      <button id="calcBtn3" class="btn" type="button">حساب مدة التسريع</button>
    </div>
  </section>
  </main>

  <footer>
    <p class="welcome">أهلًا وسهلًا بكم</p>
    <p class="clock" id="clock" dir="rtl"></p>
  </footer>

  <script>
    const links = {
      calcBtn: 'https://srccom.github.io/s',
      calcBtn2: 'https://srccom.github.io/r',
      calcBtn3: 'https://srccom.github.io/q'
    };
    Object.keys(links).forEach(id => {
      document.getElementById(id).addEventListener('click', () => {
        window.location.href = links[id];
      });
    });

    (function typeWriter() {
      const el = document.getElementById('typed');
      const chars = Array.from(document.querySelector('#sub .ghost').textContent);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = chars.join('');
        return;
      }
      let i = 0;
      el.classList.add('typing');
      const timer = setInterval(() => {
        el.textContent += chars[i++];
        if (i >= chars.length) {
          clearInterval(timer);
          setTimeout(() => el.classList.remove('typing'), 1500);
        }
      }, 28);
    })();

    const clock = document.getElementById('clock');
    const fmt = new Intl.DateTimeFormat('ar-u-ca-gregory', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    function tick() { clock.textContent = fmt.format(new Date()); }
    tick();
    setInterval(tick, 1000);
  </script>
</body>
</html>
