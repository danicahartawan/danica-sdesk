(function () {
  document.title = "danica's desk";
  document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').forEach(function (icon) {
    icon.remove();
  });
  var favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/png';
  favicon.href = 'assets/danica-logo.png';
  document.head.appendChild(favicon);

  var footerLinks = document.querySelector('.footer-links');
  if (footerLinks && !footerLinks.querySelector('a[href*="github.com"]')) {
    var githubLink = document.createElement('a');
    githubLink.href = 'https://github.com/danicahartawan';
    githubLink.className = 'footer-link text-subline';
    githubLink.textContent = 'GitHub';
    footerLinks.appendChild(githubLink);
  }

  var heroHeading = document.querySelector('.hero-intro-wrapper .heading-style-h5');
  if (heroHeading && !heroHeading.querySelector('.hero-closing-line')) {
    var closingText = Array.from(heroHeading.childNodes).reverse().find(function (node) {
      return node.nodeType === Node.TEXT_NODE && node.textContent.trim();
    });
    if (closingText) {
      var closingLine = document.createElement('span');
      closingLine.className = 'hero-closing-line';
      closingLine.textContent = closingText.textContent;
      closingText.replaceWith(closingLine);
    }
  }

  if (heroHeading && !heroHeading.querySelector('.hero-typewriter')) {
    var firstBreak = Array.from(heroHeading.childNodes).find(function (node) {
      return node.nodeName === 'BR';
    });

    if (firstBreak) {
      var firstLineStart = heroHeading.firstChild;
      var typewriter = document.createElement('span');
      typewriter.className = 'hero-typewriter';
      typewriter.setAttribute('aria-label', 'Hey, I’m Danica. Welcome to my desk!');
      heroHeading.insertBefore(typewriter, firstLineStart);

      while (typewriter.nextSibling && typewriter.nextSibling !== firstBreak) {
        typewriter.appendChild(typewriter.nextSibling);
      }

      var ghost = document.createElement('span');
      ghost.className = 'hero-typewriter-ghost';
      ghost.setAttribute('aria-hidden', 'true');
      while (typewriter.firstChild) ghost.appendChild(typewriter.firstChild);

      var typed = document.createElement('span');
      typed.className = 'hero-typewriter-copy';
      typed.setAttribute('aria-hidden', 'true');
      typed.innerHTML = '<span class="hero-typewriter-prefix"></span><span class="heading-style-logo homepage-header-text hero-typewriter-name"></span><span class="hero-typewriter-suffix"></span><span class="hero-typewriter-caret"></span>';
      typewriter.appendChild(ghost);
      typewriter.appendChild(typed);

      var prefix = 'Hey, I’m ';
      var name = 'Danica';
      var suffix = '. Welcome to my desk!';
      var message = prefix + name + suffix;
      var prefixNode = typed.querySelector('.hero-typewriter-prefix');
      var nameNode = typed.querySelector('.hero-typewriter-name');
      var suffixNode = typed.querySelector('.hero-typewriter-suffix');

      function renderTypewriter(count) {
        prefixNode.textContent = message.slice(0, Math.min(count, prefix.length));
        nameNode.textContent = count > prefix.length
          ? message.slice(prefix.length, Math.min(count, prefix.length + name.length))
          : '';
        suffixNode.textContent = count > prefix.length + name.length
          ? message.slice(prefix.length + name.length, count)
          : '';
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        renderTypewriter(message.length);
        typewriter.classList.add('is-complete');
      } else {
        var character = 0;
        window.setTimeout(function typeNextCharacter() {
          character += 1;
          renderTypewriter(character);
          if (character < message.length) {
            window.setTimeout(typeNextCharacter, 48);
          } else {
            window.setTimeout(function () {
              typewriter.classList.add('is-complete');
            }, 700);
          }
        }, 450);
      }
    }
  }

  var navItems = document.querySelectorAll('.nav-links-row .nav-link-wrapper');
  if (navItems.length >= 4) {
    var homeLink = navItems[0].querySelector('a');
    var aboutLink = navItems[1].querySelector('a');
    var agentsLink = navItems[2].querySelector('a');

    homeLink.textContent = 'HOME';
    homeLink.setAttribute('href', '/');
    aboutLink.textContent = 'ABOUT';
    aboutLink.setAttribute('href', document.querySelector('.currently-list-wrapper') ? '#about' : 'index.html#about');

    function setMainNavState(active) {
      var aboutIsActive = active === 'about';
      homeLink.classList.toggle('text-color-alternate', aboutIsActive);
      homeLink.classList.toggle('w--current', !aboutIsActive);
      aboutLink.classList.toggle('text-color-alternate', !aboutIsActive);
      aboutLink.classList.toggle('w--current', aboutIsActive);
      agentsLink.classList.add('text-color-alternate');
      homeLink.removeAttribute('aria-current');
      aboutLink.removeAttribute('aria-current');
      (aboutIsActive ? aboutLink : homeLink).setAttribute('aria-current', 'page');
    }

    // Add quick scroll to about section
    aboutLink.addEventListener('click', function(e) {
      var aboutSection = document.getElementById('about');
      if (aboutSection) {
        e.preventDefault();
        setMainNavState('about');
        window.history.replaceState(null, '', '#about');
        aboutSection.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    });

    agentsLink.textContent = 'AGENTS.TXT';
    agentsLink.setAttribute('href', 'AGENTS.txt');
    agentsLink.className = 'nav-link text-subline text-color-alternate is-agents';
    navItems[3].remove();

    setMainNavState(window.location.hash === '#about' ? 'about' : 'home');

    navItems.forEach(function (item) {
      var glyph = item.querySelector('.text-glyph');
      if (glyph) glyph.remove();
    });
  }

  function updateBerkeleyTime() {
    var clock = document.querySelector('.nav-clock-text');
    if (!clock) return;

    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).formatToParts(new Date());
    var hour = parts.find(function (part) { return part.type === 'hour'; }).value;
    var minute = parts.find(function (part) { return part.type === 'minute'; }).value;
    var period = parts.find(function (part) { return part.type === 'dayPeriod'; }).value.toLowerCase();

    clock.innerHTML = 'BERKELEY CA, ' + hour + '<span class="blink">:</span>' + minute + period;
  }

  updateBerkeleyTime();
  window.setInterval(updateBerkeleyTime, 10000);

  var filterNav = document.querySelector('.navigation-links-wrapper');
  if (filterNav) {
    var projectFilter = filterNav.querySelector('[data-filter="work"]');
    var experimentFilter = filterNav.querySelector('[data-filter="play"]');

    projectFilter.replaceWith(projectFilter.cloneNode(true));
    experimentFilter.replaceWith(experimentFilter.cloneNode(true));
    projectFilter = filterNav.querySelector('[data-filter="work"]');
    experimentFilter = filterNav.querySelector('[data-filter="play"]');

    Array.from(filterNav.children).forEach(function (link) {
      if (link !== projectFilter && link !== experimentFilter) link.remove();
    });

    if (projectFilter) projectFilter.textContent = 'PROJECTS';
    if (experimentFilter) experimentFilter.textContent = 'EXPERIMENTS';

    var tabIndicator = document.createElement('span');
    tabIndicator.className = 'filter-tab-indicator';
    tabIndicator.setAttribute('aria-hidden', 'true');
    tabIndicator.innerHTML = '<span class="filter-tab-dot"></span>';
    filterNav.appendChild(tabIndicator);
    var activeCategoryFilter = projectFilter;

    function moveTabIndicator(activeFilter, shouldBounce) {
      if (!activeFilter) return;
      var dotOffset = activeFilter.offsetLeft + (activeFilter.offsetWidth / 2) - 3;
      tabIndicator.style.transform = 'translate3d(' + dotOffset + 'px, 0, 0)';
      if (shouldBounce) {
        var dot = tabIndicator.firstElementChild;
        dot.classList.remove('is-bouncing');
        void dot.offsetWidth;
        dot.classList.add('is-bouncing');
      }
    }

    function showCategory(category, activeFilter) {
      document.querySelectorAll('.currently-list [data-category]').forEach(function (item) {
        var categories = (item.getAttribute('data-category') || '').split(' ');
        item.classList.toggle('is-hidden', categories.indexOf(category) === -1);
      });
      projectFilter.classList.toggle('text-color-alternate', activeFilter !== projectFilter);
      experimentFilter.classList.toggle('text-color-alternate', activeFilter !== experimentFilter);
      activeCategoryFilter = activeFilter;
      moveTabIndicator(activeFilter, true);
      window.dispatchEvent(new Event('resize'));
    }

    document.addEventListener('click', function (event) {
      var filter = event.target.closest('[data-filter]');
      if (filter !== projectFilter && filter !== experimentFilter) return;
      event.preventDefault();
      showCategory(filter === projectFilter ? 'work' : 'play', filter);
    }, true);

    window.addEventListener('resize', function () {
      moveTabIndicator(activeCategoryFilter, false);
    });
    window.requestAnimationFrame(function () {
      moveTabIndicator(projectFilter, false);
    });

    var viewIndex = document.querySelector('.subnav-view-link');
    if (viewIndex) viewIndex.remove();
  }

  var wrapper = document.querySelector('.currently-list-wrapper');
  var rail = document.querySelector('.currently-list');
  if (!wrapper || !rail) return;

  var projects = [
    {
      name: 'Cady',
      description: 'I&rsquo;m building Cady, a CAD tool that is actually useful for beginner designers and engineers.',
      media: 'assets/projects/cady.mp4',
      poster: 'assets/projects/cady-poster.jpg',
      scope: ['BEGINNER DESIGNERS + ENGINEERS'],
      className: 'is-cady'
    },
    {
      name: 'Lucid',
      description: 'At Lucid Motors, I deployed an internal long-running research tool in three weeks.',
      media: 'assets/projects/lucid.mp4',
      poster: 'assets/projects/lucid-poster.jpg',
      scope: ['NON-TECHNICAL RESEARCHERS']
    },
    {
      name: 'Luxo',
      description: 'I built a real-life Pixar lamp.',
      media: 'assets/projects/luxo.mp4',
      poster: 'assets/projects/luxo-poster.jpg',
      scope: ['PERSONAL + CONSUMER AI']
    },
    {
      name: 'Toko',
      description: 'I built Toko for 4+ startups to create visual technical documentation and triage customer support.',
      image: 'assets/projects/toko.png',
      scope: ['STARTUPS']
    },
    {
      name: 'Yarn',
      description: 'I built Yarn with 40+ Berkeley Journalism students, exploring the intersection of local AI and physical + digital research notes.',
      media: 'assets/projects/yarn.mp4',
      poster: 'assets/projects/yarn-poster.jpg',
      scope: ['JOURNALISTS']
    },
    {
      name: 'NVIDIA',
      description: 'At NVIDIA, I built a Jupyter notebook for the PR team.',
      media: 'assets/projects/nvidia.mp4',
      poster: 'assets/projects/nvidia-poster.jpg',
      scope: ['PUBLIC RELATIONS']
    }
  ];

  rail.querySelectorAll('.home-index-item[data-category="work"]').forEach(function (item) {
    item.remove();
  });

  var projectFragment = document.createDocumentFragment();
  projects.forEach(function (project) {
    var card = document.createElement('article');
    card.className = 'home-index-item portfolio-project' + (project.className ? ' ' + project.className : '');
    card.setAttribute('data-category', 'work');
    card.setAttribute('aria-label', project.name + ' project');

    var media = project.media
      ? '<video autoplay loop muted playsinline preload="metadata" poster="' + project.poster + '" aria-label="' + project.name + ' project demo"><source src="' + project.media + '" type="video/mp4"></video>'
      : '<img src="' + project.image + '" loading="lazy" alt="' + project.name + ' project preview">';

    card.innerHTML = [
      '<div class="home-index-media image-square"><div class="work-video is-square">', media, '</div></div>',
      '<div class="spacer-xsmall"></div>',
      '<div class="work-index-caption">',
        '<div class="heading-style-h7">', project.description, '</div>',
        '<div class="spacer-xxsmall"></div>',
        '<div class="index-caption-scope">',
          project.scope.map(function (label) { return '<div class="text-link text-subline text-color-alternate index-caption-scope">' + label + '</div>'; }).join(''),
        '</div>',
      '</div>'
    ].join('');
    projectFragment.appendChild(card);
  });

  rail.insertBefore(projectFragment, rail.firstChild);

  var experiments = [
    {
      caption: 'YouTube channel!',
      image: 'assets/experiments/youtube-poster.jpg'
    },
    {
      caption: 'Exploring building lots of software and hardware for normal people - freelance work',
      media: 'assets/experiments/freelance.mp4',
      poster: 'assets/experiments/freelance-poster.jpg'
    },
    { caption: 'Teaching my first class at Berkeley', image: 'assets/experiments/teaching.jpg' },
    { caption: 'My first mentor', image: 'assets/experiments/mentor.jpg' },
    { caption: 'Snowboarding', image: 'assets/experiments/snowboarding.jpg' },
    { caption: 'Pottery is my first love', image: 'assets/experiments/pottery.jpg' },
    { caption: 'Honors thesis otw', image: 'assets/experiments/thesis.jpg' }
  ];

  rail.querySelectorAll('.home-index-item[data-category="play"]').forEach(function (item) {
    item.remove();
  });

  var experimentFragment = document.createDocumentFragment();
  experiments.forEach(function (experiment) {
    var card = document.createElement('article');
    card.className = 'home-index-item portfolio-experiment is-hidden';
    card.setAttribute('data-category', 'play');
    card.setAttribute('aria-label', experiment.caption);

    var media = experiment.media
      ? '<video autoplay loop muted playsinline preload="metadata" poster="' + experiment.poster + '" aria-label="' + experiment.caption + '"><source src="' + experiment.media + '" type="video/mp4"></video>'
      : '<img src="' + experiment.image + '" loading="lazy" alt="' + experiment.caption + '">';

    card.innerHTML = [
      '<div class="currently-item-media image-square">', media, '</div>',
      '<div class="spacer-xsmall"></div>',
      '<div class="currently-item-caption"><div class="text-color-alternate text-subline">', experiment.caption, '</div></div>'
    ].join('');
    experimentFragment.appendChild(card);
  });
  rail.appendChild(experimentFragment);

  if (!document.getElementById('about')) {
    var aboutSection = document.createElement('section');
    aboutSection.id = 'about';
    aboutSection.className = 'section-about-hero danica-about-page home-about-section';
    aboutSection.innerHTML = [
      '<div class="padding-global">',
        '<div class="section-about-wrapper">',
          '<div class="about-photo image-tallest danica-about-visual" aria-hidden="true">',
            '<img src="assets/danica-about-photo.png" alt="Danica browsing objects in a design shop">',
          '</div>',
          '<div class="about-text-wrapper">',
            '<div class="max-width-large">',
              '<div class="text-size-regular danica-about-copy">',
                '<em class="heading-style-logo text-size-regular">Danica Hartawan</em>, Chinese-Indonesian researcher and engineer at UC Berkeley.',
                '<br><br>',
                'I always thought I&rsquo;d become a behavior technician - and in a way, I did (fun fact: I&rsquo;m a licensed behavior technician for autism). I&rsquo;ve long been fascinated by how people think, learn, and make decisions, and that curiosity now shapes the systems I build. Definitely a lifelong learner as well&mdash;always looking for something to humble me!',
                '<br><br>',
                '<div class="danica-recently">',
                  '<div class="danica-recently-label">Recently</div>',
                  '<ul>',
                    '<li>Previously, a Technical Product Intern at NVIDIA working on AI for knowledge workers and the open model ecosystem.</li>',
                    '<li>Building Cady, a tool I very much needed, aiming to bring back creative freedom to engineers and designers through CAD.</li>',
                    '<li>Teaching my first class on Alzheimer&rsquo;s.</li>',
                    '<li>Doing lots of research at my BAIR lab on children&rsquo;s pedagogy and vLLM model training.</li>',
                    '<li>Analog journaling and reading non-fiction books, making video journals obsessively, caring for my 14 tortoises, and making a mean coffee.</li>',
                  '</ul>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');

    var footer = document.querySelector('.section-footer');
    var insertionPoint = footer && footer.previousElementSibling && footer.previousElementSibling.classList.contains('spacer-xxhuge')
      ? footer.previousElementSibling
      : footer;
    if (insertionPoint) insertionPoint.parentNode.insertBefore(aboutSection, insertionPoint);
  }

  var intro = document.createElement('div');
  intro.className = 'project-rail-intro';
  intro.setAttribute('aria-label', 'Building with intention and empathy');
  intro.innerHTML = 'Building with <strong>intention</strong><br>and <strong>empathy</strong>';
  rail.insertBefore(intro, rail.firstChild);

  var desktop = window.matchMedia('(min-width: 561px)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var scrollFactor = 0.28;
  var distance = 0;
  var ticking = false;

  function measure() {
    if (!desktop.matches) {
      wrapper.style.setProperty('--project-rail-distance', '0px');
      return;
    }

    distance = Math.max(0, rail.scrollWidth - rail.clientWidth);
    wrapper.style.setProperty('--project-rail-distance', (distance * scrollFactor) + 'px');
    update();
  }

  function update() {
    ticking = false;
    if (!desktop.matches || reducedMotion.matches) return;

    var rect = wrapper.getBoundingClientRect();
    var travelled = Math.min(distance, Math.max(0, -rect.top / scrollFactor));
    rail.scrollLeft = travelled;
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', measure);
  desktop.addEventListener('change', measure);

  rail.addEventListener('wheel', function (event) {
    if (!desktop.matches || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    window.scrollBy({ top: event.deltaX, left: 0, behavior: 'auto' });
  }, { passive: false });

  new MutationObserver(function () {
    window.requestAnimationFrame(measure);
  }).observe(rail, { attributes: true, subtree: true, attributeFilter: ['class'] });

  window.addEventListener('load', function () {
    window.setTimeout(measure, 0);
  });
  measure();
})();
