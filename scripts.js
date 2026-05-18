document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.classList.toggle('open');
    });

    // Close menu when a link is clicked
    const navLinks = menu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Nav scroll effect
  const nav = document.querySelector('.main-nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Active nav indicator with bubble
  const navMenu = document.querySelector('.nav-menu');
  const navItems = navMenu ? navMenu.querySelectorAll('li') : [];
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  if (navMenu && navItems.length > 0) {
    // Create bubble element
    const bubble = document.createElement('div');
    bubble.className = 'nav-bubble';
    navMenu.appendChild(bubble);
    navMenu.classList.add('active-set');

    const updateBubble = (activeLink) => {
      if (activeLink) {
        const rect = activeLink.getBoundingClientRect();
        const navRect = navMenu.getBoundingClientRect();
        const leftPos = rect.left - navRect.left;
        const width = rect.width;

        bubble.style.left = leftPos + 'px';
        bubble.style.width = width + 'px';
      }
    };

    // Set active on page load
    navItems.forEach(item => {
      const link = item.querySelector('a');
      const href = link ? link.getAttribute('href') : '';
      
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        item.classList.add('active');
        updateBubble(link);
      } else {
        item.classList.remove('active');
      }
    });

    // Update bubble ONLY on click, not on hover
    const allNavLinks = document.querySelectorAll('.nav-menu a');
    allNavLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Update active state and bubble
        navItems.forEach(item => item.classList.remove('active'));
        this.parentElement.classList.add('active');
        updateBubble(this);

        // Only add page transition if link is internal and different from current page
        if (href && href.endsWith('.html') && href !== currentPage) {
          e.preventDefault();

          // Find the main content area and fade only that
          const mainContent = document.querySelector('.page-main') || 
                             document.querySelector('.about-main') || 
                             document.querySelector('.contact-main');
          
          if (mainContent) {
            const overlay = document.createElement('div');
            overlay.className = 'content-transition fade-in';
            mainContent.style.position = 'relative';
            mainContent.appendChild(overlay);
          }

          setTimeout(() => {
            window.location.href = href;
          }, 400);
        }
      });
    });

    // Recalculate on window resize (bubble stays on active item)
    window.addEventListener('resize', () => {
      const activeLink = navMenu.querySelector('li.active a');
      updateBubble(activeLink);
    });
  }

  console.log('Scripts loaded: nav toggle, scroll effects, page transitions, and bubble indicator');
});