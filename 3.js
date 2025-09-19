// Terminal clock in format HH:MM:SS
const pad = n => String(n).padStart(2, '0');

function tick() {
  const d = new Date();
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  process.stdout.write(`\r${hh}:${mm}:${ss}`);
}

tick(); // show immediately
setInterval(tick, 1000);
