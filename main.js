const menuToggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');
const yearNode = document.querySelector('[data-year]');
const revealTargets = document.querySelectorAll('.hero-card, .info-card, .card, .content-card, .footer-grid');
const checklistRoot = document.querySelector('[data-checklist]');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

revealTargets.forEach((node, index) => {
  node.setAttribute('data-reveal', '');
  node.style.transitionDelay = `${Math.min(index * 80, 320)}ms`;
});

const closeMenu = () => {
  if (!menu || !menuToggle) {
    return;
  }

  menu.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
};

if (menu && menuToggle) {
  menu.id = 'site-menu';

  menuToggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
      closeMenu();
    }
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealTargets.forEach((node) => observer.observe(node));
} else {
  revealTargets.forEach((node) => node.classList.add('is-visible'));
}

if (checklistRoot) {
  const checkboxNodes = Array.from(checklistRoot.querySelectorAll('input[type="checkbox"]'));
  const progressText = checklistRoot.querySelector('[data-progress-text]');
  const progressFill = checklistRoot.querySelector('[data-progress-fill]');
  const copyButton = checklistRoot.querySelector('[data-copy]');
  const resetButton = checklistRoot.querySelector('[data-reset]');

  const updateProgress = () => {
    const total = checkboxNodes.length;
    const checked = checkboxNodes.filter((node) => node.checked).length;
    const percentage = total === 0 ? 0 : (checked / total) * 100;

    if (progressText) {
      progressText.textContent = `${checked} / ${total} 완료`;
    }

    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
  };

  checkboxNodes.forEach((node) => {
    node.addEventListener('change', updateProgress);
  });

  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const lines = checkboxNodes.map((node) => {
        const title = node.dataset.title || node.closest('label')?.innerText.trim() || '항목';
        const marker = node.checked ? '[완료]' : '[ ]';
        return `${marker} ${title}`;
      });

      const text = lines.join('\n');

      try {
        await navigator.clipboard.writeText(text);
        copyButton.textContent = '복사 완료';
        window.setTimeout(() => {
          copyButton.textContent = '체크리스트 복사';
        }, 1400);
      } catch (error) {
        copyButton.textContent = '복사 실패';
        window.setTimeout(() => {
          copyButton.textContent = '체크리스트 복사';
        }, 1400);
      }
    });
  }

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      checkboxNodes.forEach((node) => {
        node.checked = false;
      });
      updateProgress();
    });
  }

  updateProgress();
}
