(function () {
  if (document.querySelector('.meet-widget')) return;

  var slotSets = [
    [
      { label: 'wed, oct 7 · 3:30–3:45 pm', value: 'wednesday, october 7 from 3:30 to 3:45 pm pt' },
      { label: 'thu, oct 8 · 2:00–2:15 pm', value: 'thursday, october 8 from 2:00 to 2:15 pm pt' },
      { label: 'fri, oct 9 · 3:30–3:45 pm', value: 'friday, october 9 from 3:30 to 3:45 pm pt' }
    ],
    [
      { label: 'wed, oct 7 · 4:15–4:30 pm', value: 'wednesday, october 7 from 4:15 to 4:30 pm pt' },
      { label: 'thu, oct 8 · 3:00–3:15 pm', value: 'thursday, october 8 from 3:00 to 3:15 pm pt' },
      { label: 'fri, oct 9 · 4:00–4:15 pm', value: 'friday, october 9 from 4:00 to 4:15 pm pt' }
    ]
  ];
  var visitorIntro = '';
  var selectedSlot = null;
  var activeSet = 0;
  var state = 'intro';

  var widget = document.createElement('aside');
  widget.className = 'meet-widget';
  widget.setAttribute('aria-label', 'find time with danica');
  widget.innerHTML = [
    '<button class="meet-widget-launcher" type="button" aria-expanded="false">',
      '<span class="meet-widget-launcher-copy">stalk me, then talk to me</span>',
    '</button>',
    '<section class="meet-widget-panel" aria-hidden="true">',
      '<button class="meet-widget-close" type="button" aria-label="collapse scheduling widget">−</button>',
      '<div class="meet-widget-thread" aria-live="polite">',
        '<div class="meet-widget-bubble meet-widget-intro">hey, i’ll help u find time to meet w danica for 15 mins. what’s ur name and how wld u describe urself?</div>',
        '<form class="meet-widget-chat-form">',
          '<div class="meet-widget-input-row">',
            '<input id="meet-widget-input" name="message" type="text" autocomplete="off" aria-label="type your reply" required>',
          '</div>',
          '<small class="meet-widget-hint"></small>',
        '</form>',
      '</div>',
    '</section>'
  ].join('');
  document.body.appendChild(widget);

  var launcher = widget.querySelector('.meet-widget-launcher');
  var panel = widget.querySelector('.meet-widget-panel');
  var close = widget.querySelector('.meet-widget-close');
  var form = widget.querySelector('.meet-widget-chat-form');
  var input = widget.querySelector('#meet-widget-input');
  var hint = widget.querySelector('.meet-widget-hint');
  var thread = widget.querySelector('.meet-widget-thread');

  function setOpen(open) {
    widget.classList.toggle('is-open', open);
    launcher.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    if (open) {
      window.setTimeout(function () { input.focus(); }, 650);
    }
  }

  launcher.addEventListener('click', function () { setOpen(true); });
  close.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && widget.classList.contains('is-open')) setOpen(false);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var reply = input.value.trim();
    if (!reply || state === 'sending' || state === 'done') return;
    input.value = '';
    addUserBubble(reply.toLowerCase());

    if (state === 'intro') {
      if (/^(hi|hey|hello|yo|hii+)[!?. ]*$/i.test(reply)) {
        addBotBubble('hey :) tell me your name and a little about yourself, then i’ll look at danica’s week.');
        return;
      }
      if (reply.length < 8) {
        addBotBubble('give me just a tiny bit more. your name and one thing about you is perfect.');
        return;
      }
      visitorIntro = reply;
      state = 'choose';
      input.placeholder = '';
      showTimes('okay wait, you sound fun. i checked danica’s week. would any of these work?');
      return;
    }

    if (state === 'choose') {
      if (/none|can.?t|cannot|nope|different|reshuffle|other/.test(reply.toLowerCase())) {
        activeSet = activeSet === 0 ? 1 : 0;
        showTimes('all good, reshuffling. how about:');
        return;
      }
      var choice = Number((reply.match(/[123]/) || [])[0]);
      if (!choice) {
        addBotBubble('just type 1, 2, or 3. or say none and i’ll reshuffle :)');
        return;
      }
      selectedSlot = slotSets[activeSet][choice - 1];
      state = 'email';
      input.type = 'email';
      input.placeholder = '';
      hint.textContent = 'this sends the request straight to danica’s inbox.';
      addBotBubble('cute, ' + selectedSlot.label + ' it is. what email should danica reply to?');
      return;
    }

    if (state === 'email') sendRequest(reply);
  });

  function showTimes(lead) {
    var slots = slotSets[activeSet];
    addBotBubble(lead + '\n\n1: ' + slots[0].label + '\n2: ' + slots[1].label + '\n3: ' + slots[2].label + '\n\nnone of these? just type “none.”');
  }

  function sendRequest(email) {
    state = 'sending';
    input.disabled = true;
    hint.textContent = 'sending…';
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
      state = 'done';
      form.hidden = true;
      addBotBubble('sent :) danica has your intro, email, and the time you picked.');
    }).catch(function () {
      state = 'email';
      input.disabled = false;
      hint.textContent = '';
      var subject = '15 min meeting request';
      var body = 'hi danica,\n\n' + visitorIntro + '\n\nreply email: ' + email + '\nrequested time: ' + selectedSlot.value;
      addBotLink('hmm, the direct send got shy. open the ready-to-send email instead?', 'mailto:danicahartawan@berkeley.edu?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body));
    });
  }

  function addUserBubble(text) {
    var bubble = document.createElement('div');
    bubble.className = 'meet-widget-bubble is-user';
    bubble.textContent = text;
    thread.insertBefore(bubble, form);
    scrollThread();
  }

  function addBotBubble(text) {
    var bubble = document.createElement('div');
    bubble.className = 'meet-widget-bubble';
    thread.insertBefore(bubble, form);
    typeReply(bubble, text);
  }

  function addBotLink(text, href) {
    var bubble = document.createElement('div');
    bubble.className = 'meet-widget-bubble';
    var link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    bubble.appendChild(link);
    thread.insertBefore(bubble, form);
    scrollThread();
  }

  function scrollThread() {
    thread.scrollTop = thread.scrollHeight;
  }

  function typeReply(node, text) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.textContent = text;
      scrollThread();
      return;
    }

    var index = 0;
    input.disabled = true;
    node.classList.add('is-typing');

    function step() {
      index += 1;
      node.textContent = text.slice(0, index);
      scrollThread();
      if (index < text.length) {
        window.setTimeout(step, 22);
        return;
      }
      node.classList.remove('is-typing');
      if (state !== 'sending' && state !== 'done') {
        input.disabled = false;
        input.focus();
      }
    }

    window.setTimeout(step, 180);
  }

})();
