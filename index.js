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