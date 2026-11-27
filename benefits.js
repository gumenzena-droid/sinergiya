(() => {
  const office = document.querySelector('.city-frame');
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    window.konturTrack('digital_office_view');
    observer.disconnect();
  }, {threshold:.25});
  observer.observe(office);
  addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== office.contentWindow) return;
    if (event.data?.event === 'department_open' && ['brand','content','lead','sales','negotiation','eva'].includes(event.data.department)) {
      if (office.getBoundingClientRect().top < 76) office.scrollIntoView({block:'start',behavior:'instant'});
      window.konturTrack('department_open', {department:event.data.department});
    } else if (event.data?.event === 'consultation_click') {
      window.konturTrack('consultation_click', {placement:'department'});
    }
  });
})();
