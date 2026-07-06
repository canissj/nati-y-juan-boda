(function () {
  function wrapLetters(el) {
    const text = el.textContent;
    el.textContent = '';
    const frag = document.createDocumentFragment();
    Array.from(text).forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.textContent = ch === ' ' ? ' ' : ch;
      frag.appendChild(span);
    });
    el.appendChild(frag);
    return Array.from(el.querySelectorAll('.letter'));
  }

  function linesOf(el) {
    const children = Array.from(el.children).filter((c) =>
      ['P', 'H2', 'H3'].includes(c.tagName)
    );
    return children.length > 0 ? children : [el];
  }

  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));

  revealEls.forEach((el) => {
    const mode = el.dataset.reveal;

    if (mode === 'letters') {
      const lines = linesOf(el);
      lines.forEach((line, lineIndex) => {
        const letters = wrapLetters(line);
        letters.forEach((letter, i) => {
          letter.style.transitionDelay = (lineIndex * 0.5 + i * 0.035) + 's';
        });
      });
      el._revealTargets = lines.flatMap((line) => Array.from(line.querySelectorAll('.letter')));
    } else if (mode === 'lines') {
      const lines = linesOf(el);
      lines.forEach((line, i) => {
        line.classList.add('reveal-item');
        line.style.transitionDelay = (i * 0.18) + 's';
      });
      el._revealTargets = lines;
    } else {
      el.classList.add('reveal-item');
      el._revealTargets = [el];
    }
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targets = entry.target._revealTargets || [entry.target];
          targets.forEach((t) => t.classList.add('revealed'));
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  revealEls.forEach((el) => io.observe(el));

  // Modal
  const backdrop = document.getElementById('modal-backdrop');
  const openBtn = document.getElementById('ver-datos-btn');
  const closeBtn = document.getElementById('modal-close');

  function openModal() {
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
})();
