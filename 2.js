let start = Date.now();


setTimeout(() => {
  let end = Date.now();
  let diff = end - start;
  console.log(`Scheduled: 1000ms, Actual delay: ${diff}ms`);
}, 1000);
