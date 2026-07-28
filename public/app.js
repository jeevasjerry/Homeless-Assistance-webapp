const resourceList = document.getElementById('resource-list');
const searchInput = document.getElementById('search-input');
const catChips = document.querySelectorAll('.cat-chip');
const helpForm = document.getElementById('help-form');
const formStatus = document.getElementById('form-status');

let activeCategory = 'all';
let debounceTimer = null;

function renderResources(resources) {
  if (!resources.length) {
    resourceList.innerHTML = '<p class="empty-note">No matching resources yet. Try a different search or category.</p>';
    return;
  }

  resourceList.innerHTML = resources.map(r => `
    <article class="resource-card">
      <span class="resource-tag" data-category="${r.category}">${r.category}</span>
      <h3>${escapeHTML(r.name)}</h3>
      <p class="desc">${escapeHTML(r.description)}</p>
      <p class="resource-meta"><strong>Hours:</strong> ${escapeHTML(r.hours)}</p>
      <p class="resource-meta"><strong>Phone:</strong> ${escapeHTML(r.phone)}</p>
      <p class="resource-meta"><strong>Address:</strong> ${escapeHTML(r.address)}</p>
    </article>
  `).join('');
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function loadResources() {
  resourceList.innerHTML = '<p class="loading-note">Loading resources…</p>';
  const params = new URLSearchParams();
  if (activeCategory !== 'all') params.set('category', activeCategory);
  if (searchInput.value.trim()) params.set('search', searchInput.value.trim());

  try {
    const res = await fetch(`/api/resources?${params.toString()}`);
    const data = await res.json();
    renderResources(data);
  } catch (err) {
    resourceList.innerHTML = '<p class="empty-note">Could not load resources right now. Please try again shortly.</p>';
  }
}

catChips.forEach(chip => {
  chip.addEventListener('click', () => {
    catChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeCategory = chip.dataset.category;
    loadResources();
  });
});
document.querySelector('.cat-chip[data-category="all"]').classList.add('active');

searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(loadResources, 250);
});

helpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  formStatus.textContent = 'Sending…';
  formStatus.removeAttribute('data-state');

  const formData = new FormData(helpForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('/api/help-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) {
      formStatus.textContent = data.error || 'Something went wrong. Please try again.';
      formStatus.dataset.state = 'error';
      return;
    }

    formStatus.textContent = 'Received — a volunteer will follow up as soon as possible.';
    formStatus.dataset.state = 'success';
    helpForm.reset();
  } catch (err) {
    formStatus.textContent = 'Could not send your request. Please check your connection and try again.';
    formStatus.dataset.state = 'error';
  }
});

loadResources();
