(() => {
  function track(event, properties = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event, ...properties});
  }
  window.konturTrack = track;
  document.addEventListener('click', e => {
    const element = e.target.closest('a, button');
    if (!element) return;
    if (element.dataset.consultation) track('consultation_click', {placement:element.dataset.consultation});
    if (element.hasAttribute('data-contact-max')) track('messenger_click', {channel:'max',placement:element.dataset.consultation});
    if (!(element instanceof HTMLAnchorElement)) return;
    const channel = {'max.ru':'max','t.me':'telegram'}[element.hostname];
    if (channel) track('messenger_click', {channel, placement:element.closest('[id]')?.id || 'office'});
    if (element.protocol === 'tel:') track('phone_click');
  });
})();
