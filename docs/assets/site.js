/* Home page demo player: muted looping playlist with a play/pause button and chapter chips. */
(function () {
  var v = document.getElementById('hero-video');
  if (!v) return;
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-demo]'));
  var toggle = document.getElementById('hero-toggle');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var idx = 0;

  function paint() {
    var playing = !v.paused && !v.ended;
    toggle.setAttribute('aria-label', playing ? 'Pause demo video' : 'Play demo video');
    toggle.setAttribute('data-state', playing ? 'playing' : 'paused');
  }
  function select(i, play) {
    idx = (i + chips.length) % chips.length;
    chips.forEach(function (c, n) { c.setAttribute('aria-pressed', n === idx ? 'true' : 'false'); });
    var c = chips[idx];
    v.poster = c.getAttribute('data-poster');
    v.src = c.getAttribute('data-src');
    v.load();
    if (play) { var p = v.play(); if (p && p.catch) p.catch(paint); }
    paint();
  }
  v.removeAttribute('loop');
  v.removeAttribute('controls');
  toggle.hidden = false;
  chips.forEach(function (c, n) { c.addEventListener('click', function () { select(n, true); }); });
  toggle.addEventListener('click', function () {
    if (v.paused || v.ended) { var p = v.play(); if (p && p.catch) p.catch(paint); } else { v.pause(); }
  });
  v.addEventListener('play', paint);
  v.addEventListener('pause', paint);
  v.addEventListener('ended', function () { select(idx + 1, true); });
  select(0, !reduce);
})();
