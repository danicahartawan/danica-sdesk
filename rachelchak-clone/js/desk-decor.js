(function () {
  var hero = document.querySelector('.hero-intro-wrapper');
  if (!hero || hero.querySelector('.desk-decor')) return;

  var decor = document.createElement('div');
  decor.className = 'desk-decor';
  decor.setAttribute('aria-hidden', 'true');
  decor.innerHTML = [
    '<img class="desk-object desk-painting" src="assets/desk/painting.png" alt="">',
    '<img class="desk-object desk-notebook" src="assets/desk/notebook.png" alt="">',
    '<img class="desk-object desk-watch" src="assets/desk/watch.png" alt="">',
    '<img class="desk-object desk-pen" src="assets/desk/pen.png" alt="">',
    '<img class="desk-object desk-clip" src="assets/desk/clip.png" alt="">',
    '<img class="desk-object desk-ceramic" src="assets/desk/ceramic.png" alt="">',
    '<img class="desk-object desk-smiski" src="assets/desk/smiski.png" alt="">',
    '<img class="desk-object desk-cursor" src="assets/desk/cursor.png" alt="">',
    '<img class="desk-object desk-record" src="assets/desk/record.png" alt="">',
    '<img class="desk-object desk-nudge" src="assets/desk/nudge.png" alt="">',
    '<div class="desk-widget desk-folder"><img src="assets/desk/folder.png" alt=""><span>danica\'s desk</span></div>',
    '<div class="desk-widget desk-airdrop"><img src="assets/desk/airdrop-photo.png" alt=""><div class="desk-airdrop-copy"><div class="desk-airdrop-title">AirDrop</div><div class="desk-airdrop-text">Danica would like to share a glimpse from her desk.</div><div class="desk-airdrop-actions"><span>Decline</span><span>Accept</span></div></div></div>'
  ].join('');
  hero.insertBefore(decor, hero.firstChild);

  function revealOnScroll() {
    if (window.scrollY > 24) {
      decor.classList.add('is-visible');
      window.removeEventListener('scroll', revealOnScroll);
    }
  }

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll();
})();
