    const links = {
      calcBtn: 'https://srccom.github.io/s',
      calcBtn2: 'https://srccom.github.io/r',
      calcBtn3: 'https://srccom.github.io/q',
      calcBtn4: 'https://srccom.github.io/ret'
    };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    Object.keys(links).forEach(id => {
      const btn = document.getElementById(id);

      

      btn.addEventListener('pointerdown', e => {
        btn.classList.add('is-pressed');
        if (reduceMotion) return;
        const rect = btn.getBoundingClientRect();
        const dot = document.createElement('span');
        dot.className = 'ripple';
        dot.style.left = (e.clientX - rect.left) + 'px';
        dot.style.top = (e.clientY - rect.top) + 'px';
        dot.style.setProperty('--r', Math.ceil(rect.width / 5) + 6);
        btn.appendChild(dot);
        dot.addEventListener('animationend', () => dot.remove());
      });

      const release = () => btn.classList.remove('is-pressed');
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => btn.addEventListener(t, release));

      



      btn.addEventListener('click', () => {
        btn.classList.remove('is-done');
        void btn.offsetWidth;
        btn.classList.add('is-done');
        setTimeout(() => { window.location.href = links[id]; }, reduceMotion ? 0 : 260);
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