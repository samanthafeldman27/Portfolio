document.addEventListener('DOMContentLoaded', () => {
  // Single orchestrated load-in moment
  requestAnimationFrame(() => {
    document.body.classList.add('ready');
  });

  // Footer year
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ---- Gallery lightbox ----
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;

  const lb = document.getElementById('lightbox');
  const stageMedia = lb.querySelector('.lb-media');
  const caption = lb.querySelector('.lb-caption');
  const btnClose = lb.querySelector('.lb-close');
  const btnPrev = lb.querySelector('.lb-prev');
  const btnNext = lb.querySelector('.lb-next');
  let current = 0;

  function render(i) {
    current = (i + items.length) % items.length;
    const el = items[current];
    const type = el.dataset.type;
    const src = el.dataset.full;
    const cap = el.dataset.caption || '';
    stageMedia.innerHTML = '';
    if (type === 'video') {
      const v = document.createElement('video');
      v.src = src;
      v.controls = true;
      v.autoplay = true;
      stageMedia.appendChild(v);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = cap;
      stageMedia.appendChild(img);
    }
    caption.textContent = cap;
  }

  function open(i) {
    render(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.hidden = true;
    stageMedia.innerHTML = '';
    document.body.style.overflow = '';
  }

  items.forEach((el, i) => {
    el.addEventListener('click', () => open(i));
  });
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => render(current - 1));
  btnNext.addEventListener('click', () => render(current + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') render(current - 1);
    if (e.key === 'ArrowRight') render(current + 1);
  });

  // ---- Slide scrollers (picture-of-slides viewers) ----
  document.querySelectorAll('.slide-scroller').forEach(scroller => {
    const track = scroller.querySelector('.slide-track');
    const frames = Array.from(track.querySelectorAll('.slide-frame'));
    const dots = Array.from(scroller.querySelectorAll('.slide-dot'));
    const prev = scroller.querySelector('.slide-prev');
    const next = scroller.querySelector('.slide-next');
    const counter = scroller.querySelector('.n');

    function setActive(i){
      dots.forEach((d, di) => d.classList.toggle('active', di === i));
      if (counter) counter.textContent = (i + 1) + ' / ' + frames.length;
    }
    function scrollTo(i){
      i = Math.max(0, Math.min(frames.length - 1, i));
      frames[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setActive(i);
    }
    let currentSlide = 0;
    if (prev) prev.addEventListener('click', () => { currentSlide = Math.max(0, currentSlide - 1); scrollTo(currentSlide); });
    if (next) next.addEventListener('click', () => { currentSlide = Math.min(frames.length - 1, currentSlide + 1); scrollTo(currentSlide); });
    dots.forEach((d, i) => d.addEventListener('click', () => { currentSlide = i; scrollTo(i); }));

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          currentSlide = frames.indexOf(entry.target);
          setActive(currentSlide);
        }
      });
    }, { root: track, threshold: 0.6 });
    frames.forEach(f => io.observe(f));

    setActive(0);
  });
});

