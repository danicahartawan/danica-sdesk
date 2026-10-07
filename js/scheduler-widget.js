(function () {
  if (document.querySelector('.meet-widget')) return;

  var slots = [
    { label: 'Wed, Oct 7 · 3:30–4:00 PM', value: 'Wednesday, October 7 from 3:30 to 4:00 PM PT' },
    { label: 'Thu, Oct 8 · 2:00–2:30 PM', value: 'Thursday, October 8 from 2:00 to 2:30 PM PT' },
    { label: 'Fri, Oct 9 · 3:30–4:00 PM', value: 'Friday, October 9 from 3:30 to 4:00 PM PT' }
  ];

  var widget = document.createElement('aside');
  widget.className = 'meet-widget';
  widget.setAttribute('aria-label', 'Schedule time with Danica');
  widget.innerHTML = [
    '<button class="meet-widget-launcher" type="button" aria-expanded="false">',
      '<span><span class="meet-widget-status"></span>Find time with Danica</span>',
      '<span class="meet-widget-launcher-arrow" aria-hidden="true">↗</span>',
    '</button>',
    '<section class="meet-widget-panel" aria-hidden="true">',
      '<header class="meet-widget-header">',
        '<div><span class="meet-widget-status"></span><strong>Meet Danica</strong><small>BERKELEY, CA · 30 MIN</small></div>',
        '<button class="meet-widget-close" type="button" aria-label="Collapse scheduling widget">−</button>',
      '</header>',
      '<div class="meet-widget-thread" aria-live="polite">',
        '<div class="meet-widget-bubble">Hey! What should I call you?</div>',
        '<form class="meet-widget-name-form">',
          '<label for="meet-widget-name">Your name</label>',
          '<div class="meet-widget-input-row">',
            '<input id="meet-widget-name" name="name" type="text" autocomplete="name" placeholder="Type your name…" required>',
            '<button type="submit" aria-label="See available times">↑</button>',
          '</div>',
        '</form>',
        '<div class="meet-widget-suggestions" hidden></div>',
      '</div>',
    '</section>'
  ].join('');
  document.body.appendChild(widget);

  var launcher = widget.querySelector('.meet-widget-launcher');
  var panel = widget.querySelector('.meet-widget-panel');
  var close = widget.querySelector('.meet-widget-close');
  var form = widget.querySelector('.meet-widget-name-form');
  var input = widget.querySelector('#meet-widget-name');
  var suggestions = widget.querySelector('.meet-widget-suggestions');

  function setOpen(open) {
    widget.classList.toggle('is-open', open);
    launcher.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    if (open) window.setTimeout(function () { input.focus(); }, 320);
  }

  launcher.addEventListener('click', function () { setOpen(true); });
  close.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && widget.classList.contains('is-open')) setOpen(false);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var name = input.value.trim();
    if (!name) return;

    form.hidden = true;
    suggestions.hidden = false;
    suggestions.innerHTML = [
      '<div class="meet-widget-bubble is-user">Hi, I’m ', escapeHtml(name), '.</div>',
      '<div class="meet-widget-bubble">Nice to meet you, ', escapeHtml(name), '! These three times avoid Danica’s calendar and prioritize 2–5 PM:</div>',
      '<div class="meet-widget-slot-list">',
        slots.map(function (slot, index) {
          return '<button class="meet-widget-slot" type="button" data-slot="' + index + '">' + slot.label + '<span>PT</span></button>';
        }).join(''),
      '</div>',
      '<div class="meet-widget-send" hidden></div>'
    ].join('');

    suggestions.querySelectorAll('.meet-widget-slot').forEach(function (button) {
      button.addEventListener('click', function () {
        var slot = slots[Number(button.getAttribute('data-slot'))];
        suggestions.querySelectorAll('.meet-widget-slot').forEach(function (option) {
          option.classList.toggle('is-selected', option === button);
        });
        var send = suggestions.querySelector('.meet-widget-send');
        var subject = 'Meeting request from ' + name;
        var body = 'Hi Danica,\n\n' + name + ' would like to meet on ' + slot.value + '.\n\nSent from danicahartawan.work';
        send.hidden = false;
        send.innerHTML = '<a href="mailto:danicahartawan@berkeley.edu?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body) + '">Email Danica this time <span>→</span></a><small>This opens your email app with the request ready to send.</small>';
      });
    });
  });

  function escapeHtml(value) {
    var node = document.createElement('span');
    node.textContent = value;
    return node.innerHTML;
  }
})();
