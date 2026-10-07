(function () {
  if (document.querySelector('.meet-widget')) return;

  var slots = [
    { label: 'wed, oct 7 · 3:30–3:45 pm', value: 'wednesday, october 7 from 3:30 to 3:45 pm pt' },
    { label: 'thu, oct 8 · 2:00–2:15 pm', value: 'thursday, october 8 from 2:00 to 2:15 pm pt' },
    { label: 'fri, oct 9 · 3:30–3:45 pm', value: 'friday, october 9 from 3:30 to 3:45 pm pt' }
  ];
  var intro = 'hey, i’ll help u find time to meet w danica for 15 mins. what’s ur name and how wld u describe urself?';
  var visitorIntro = '';
  var introPlayed = false;

  var widget = document.createElement('aside');
  widget.className = 'meet-widget';
  widget.setAttribute('aria-label', 'find time with danica');
  widget.innerHTML = [
    '<button class="meet-widget-launcher" type="button" aria-expanded="false">',
      '<span><span class="meet-widget-status"></span><span class="meet-widget-launcher-copy" aria-label="talk to me"></span><span class="meet-widget-mini-caret"></span></span>',
      '<span class="meet-widget-launcher-arrow" aria-hidden="true">↗</span>',
    '</button>',
    '<section class="meet-widget-panel" aria-hidden="true">',
      '<header class="meet-widget-header">',
        '<div><span class="meet-widget-status"></span><strong>talk to me</strong><small>berkeley, ca · 15 mins</small></div>',
        '<button class="meet-widget-close" type="button" aria-label="collapse scheduling widget">−</button>',
      '</header>',
      '<div class="meet-widget-thread" aria-live="polite">',
        '<div class="meet-widget-bubble meet-widget-intro"></div>',
        '<form class="meet-widget-name-form">',
          '<label for="meet-widget-name">say something</label>',
          '<div class="meet-widget-input-row">',
            '<input id="meet-widget-name" name="intro" type="text" autocomplete="off" placeholder="i’m…" required>',
            '<button type="submit" aria-label="see available times">↑</button>',
          '</div>',
        '</form>',
        '<div class="meet-widget-suggestions" hidden></div>',
      '</div>',
    '</section>'
  ].join('');
  document.body.appendChild(widget);

  var launcher = widget.querySelector('.meet-widget-launcher');
  var launcherCopy = widget.querySelector('.meet-widget-launcher-copy');
  var panel = widget.querySelector('.meet-widget-panel');
  var close = widget.querySelector('.meet-widget-close');
  var form = widget.querySelector('.meet-widget-name-form');
  var input = widget.querySelector('#meet-widget-name');
  var suggestions = widget.querySelector('.meet-widget-suggestions');
  var introBubble = widget.querySelector('.meet-widget-intro');

  playLauncherTypewriter();

  function setOpen(open) {
    widget.classList.toggle('is-open', open);
    launcher.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    if (open) {
      if (!introPlayed) {
        introPlayed = true;
        window.setTimeout(function () { typeText(introBubble, intro, 24); }, 450);
      }
      window.setTimeout(function () { input.focus(); }, 780);
    }
  }

  launcher.addEventListener('click', function () { setOpen(true); });
  close.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && widget.classList.contains('is-open')) setOpen(false);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    visitorIntro = input.value.trim();
    if (!visitorIntro) return;
    addBubble(visitorIntro.toLowerCase(), true);
    form.hidden = true;
    showSlots();
  });

  function showSlots() {
    suggestions.hidden = false;
    suggestions.innerHTML = [
      '<div class="meet-widget-bubble">love that. these three don’t overlap with danica’s calendar, and i kept 2–5 pm in mind:</div>',
      '<div class="meet-widget-slot-list">',
        slots.map(function (slot, index) {
          return '<button class="meet-widget-slot" type="button" data-slot="' + index + '">' + slot.label + '<span>pt</span></button>';
        }).join(''),
      '</div>',
      '<form class="meet-widget-email-form" hidden>',
        '<label for="meet-widget-email">where should danica reply?</label>',
        '<div class="meet-widget-input-row">',
          '<input id="meet-widget-email" name="email" type="email" autocomplete="email" placeholder="you@email.com" required>',
          '<button type="submit" aria-label="send meeting request">↑</button>',
        '</div>',
        '<small>this sends the request straight to danica’s inbox.</small>',
      '</form>',
      '<div class="meet-widget-confirmation" hidden></div>'
    ].join('');

    var selectedSlot = null;
    var emailForm = suggestions.querySelector('.meet-widget-email-form');
    suggestions.querySelectorAll('.meet-widget-slot').forEach(function (button) {
      button.addEventListener('click', function () {
        selectedSlot = slots[Number(button.getAttribute('data-slot'))];
        suggestions.querySelectorAll('.meet-widget-slot').forEach(function (option) {
          option.classList.toggle('is-selected', option === button);
        });
        emailForm.hidden = false;
        emailForm.querySelector('input').focus();
      });
    });

    emailForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!selectedSlot) return;
      var email = emailForm.querySelector('input').value.trim();
      if (!email) return;

      var button = emailForm.querySelector('button');
      button.disabled = true;
      button.textContent = '…';
      var payload = new FormData();
      payload.append('name_and_intro', visitorIntro);
      payload.append('reply_email', email);
      payload.append('_replyto', email);
      payload.append('requested_time', selectedSlot.value);
      payload.append('_subject', 'new 15 min meeting request from danicahartawan.work');
      payload.append('_template', 'table');
      payload.append('_captcha', 'false');

      fetch('https://formsubmit.co/ajax/danicahartawan@berkeley.edu', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: payload
      }).then(function (response) {
        if (!response.ok) throw new Error('request failed');
        return response.json();
      }).then(function () {
        emailForm.hidden = true;
        suggestions.querySelector('.meet-widget-slot-list').hidden = true;
        var confirmation = suggestions.querySelector('.meet-widget-confirmation');
        confirmation.hidden = false;
        confirmation.innerHTML = '<div class="meet-widget-bubble">sent :) danica has your intro, email, and the time you picked.</div>';
      }).catch(function () {
        button.disabled = false;
        button.textContent = '↑';
        var subject = '15 min meeting request';
        var body = 'hi danica,\n\n' + visitorIntro + '\n\nreply email: ' + email + '\nrequested time: ' + selectedSlot.value;
        var confirmation = suggestions.querySelector('.meet-widget-confirmation');
        confirmation.hidden = false;
        confirmation.innerHTML = '<div class="meet-widget-bubble">hmm, the direct send got shy. <a href="mailto:danicahartawan@berkeley.edu?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body) + '">open the ready-to-send email instead?</a></div>';
      });
    });
  }

  function addBubble(content, isUser) {
    var bubble = document.createElement('div');
    bubble.className = 'meet-widget-bubble' + (isUser ? ' is-user' : '');
    bubble.textContent = content;
    suggestions.parentNode.insertBefore(bubble, form);
  }

  function playLauncherTypewriter() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      launcherCopy.textContent = 'talk to me';
      return;
    }
    typeText(launcherCopy, 'stalk me', 90, function () {
      window.setTimeout(function () {
        eraseText(launcherCopy, 55, function () {
          typeText(launcherCopy, 'talk to me', 90);
        });
      }, 850);
    });
  }

  function typeText(node, text, speed, done) {
    var index = 0;
    node.textContent = '';
    function step() {
      index += 1;
      node.textContent = text.slice(0, index);
      if (index < text.length) window.setTimeout(step, speed);
      else if (done) done();
    }
    step();
  }

  function eraseText(node, speed, done) {
    function step() {
      node.textContent = node.textContent.slice(0, -1);
      if (node.textContent.length) window.setTimeout(step, speed);
      else if (done) done();
    }
    step();
  }
})();
