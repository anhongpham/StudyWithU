function css(node) {
  const P = (name, delay) => node.style.setProperty(name,`${delay}s`);
  const time = new Date();
  const hours = time.getHours() * 3600;
  const minutes = time.getMinutes() * 60;
  const seconds = time.getSeconds();

  P('--delay-hours',  -Math.abs(hours + minutes + seconds));
  P('--delay-minutes', -Math.abs(minutes + seconds));
  P('--delay-seconds', -Math.abs(seconds));
}

/* Run */
css(document.getElementById('css'))