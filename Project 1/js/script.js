// ─── Toast helper ───────────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── Enhance h1 with orange-highlighted words ────────────────────
(function highlightHeadline() {
  const h1 = document.querySelector('main h1');
  if (!h1) return;
  const highlights = ['food', 'groceries', 'restaurants', 'Swiggy'];
  let text = h1.textContent;
  highlights.forEach(word => {
    const re = new RegExp(`(${word})`, 'gi');
    text = text.replace(re, '<em>$1</em>');
  });
  h1.innerHTML = text;
})();

// ─── Inject search-row structure around the select ───────────────
(function buildSearchRow() {
  const select = document.getElementById('location');
  const label  = document.querySelector('label[for="location"]');
  if (!select) return;

  const row = document.createElement('div');
  row.className = 'search-row';

  // Pin icon
  const pin = document.createElement('span');
  pin.className = 'pin-icon';
  pin.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>`;

  // Chevron icon
  const chev = document.createElement('span');
  chev.className = 'chevron-icon';
  chev.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>`;

  // Search button
  const btn = document.createElement('button');
  btn.className = 'search-btn';
  btn.type = 'button';
  btn.textContent = 'Find Food';

  // Assemble
  if (label) label.remove();
  select.replaceWith(row);
  row.appendChild(pin);
  row.appendChild(select);
  row.appendChild(chev);
  row.appendChild(btn);

  // Button action
  btn.addEventListener('click', handleSearch);
  select.addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });
})();

// ─── Inject quick-pick tags ──────────────────────────────────────
(function buildTags() {
  const main = document.querySelector('main');
  const row  = document.querySelector('.search-row');
  if (!main || !row) return;

  const labels = ['🍕 Pizza', '🍔 Burgers', '🍜 Chinese', '🥗 Healthy', '🍣 Sushi', '☕ Cafe'];
  const tagsDiv = document.createElement('div');
  tagsDiv.className = 'tags';

  labels.forEach(label => {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = label;
    tag.addEventListener('click', () => {
      showToast(`Searching for ${label.split(' ').slice(1).join(' ')} near you…`);
    });
    tagsDiv.appendChild(tag);
  });

  row.insertAdjacentElement('afterend', tagsDiv);
})();

// ─── Populate footer ─────────────────────────────────────────────
(function buildFooter() {
  const footer = document.querySelector('footer');
  if (!footer) return;
  footer.innerHTML = `© ${new Date().getFullYear()} Swiggy &nbsp;·&nbsp;
    <a href="#">Privacy Policy</a> &nbsp;·&nbsp;
    <a href="#">Terms of Service</a> &nbsp;·&nbsp;
    Made with ❤️ in India`;
})();

// ─── Main search handler ─────────────────────────────────────────
function handleSearch() {
  const select = document.getElementById('location');
  const val    = select ? select.value : '';

  if (!val) {
    showToast('Please choose a location first.');
    return;
  }

  const locationText = select.options[select.selectedIndex].text;

  if (val === 'current location') {
    if (!navigator.geolocation) {
      showToast('Geolocation not supported by your browser.');
      return;
    }
    showToast('📍 Detecting your location…');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        showToast(`📍 Got it! (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
      },
      () => showToast('Could not access location. Please allow permission.')
    );
  } else {
    showToast(`🍽️ Finding food near ${locationText}…`);
  }
}