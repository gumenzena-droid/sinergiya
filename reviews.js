const reviewDialog = document.querySelector('.review-dialog');
if (typeof reviewDialog?.showModal === 'function') {
  const closeReview = reviewDialog.querySelector('button');
  const displayedReview = reviewDialog.querySelector('img');
  for (const link of document.querySelectorAll('.review-card')) {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      displayedReview.alt = link.querySelector('img').alt;
      displayedReview.src = link.href;
      reviewDialog.showModal();
      reviewDialog.scrollTop = 0;
    });
  }
  closeReview.addEventListener('click', () => reviewDialog.close());
  reviewDialog.addEventListener('click', event => {
    if (event.target !== reviewDialog) return;
    const bounds = reviewDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) reviewDialog.close();
  });
}
