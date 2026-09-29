 
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

    const clock = document.getElementById('clock');
    const fmt = new Intl.DateTimeFormat('ar-u-ca-gregory', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    function tick() { clock.textContent = fmt.format(new Date()); }
    tick();
    setInterval(tick, 1000);
  