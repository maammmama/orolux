// Initialize Quill editor
const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ]
  }
});

// Helper: Get or set terms from localStorage
function getTermsSections() {
  return JSON.parse(localStorage.getItem('termsSections') || '[]');
}
function setTermsSections(sections) {
  localStorage.setItem('termsSections', JSON.stringify(sections));
}

// Load saved content from localStorage if exists
document.addEventListener("DOMContentLoaded", function () {
  const savedContent = localStorage.getItem('termsAndConditions');
  if (savedContent) {
    quill.clipboard.dangerouslyPasteHTML(savedContent);
  }
});

// Render the editable sections
function renderTermsSections() {
  const container = document.getElementById('termsSections');
  const sections = getTermsSections();
  container.innerHTML = '';
  sections.forEach((section, idx) => {
    const div = document.createElement('div');
    div.className = 'terms-section-editor';
    div.style = 'margin-bottom: 1.5rem; border: 1px solid #eee; padding: 1rem; border-radius: 8px;';
    div.innerHTML = `
      <input type="text" class="section-title" placeholder="Section Title" value="${section.title || ''}" style="width:100%;font-weight:bold;font-size:1.1rem;margin-bottom:0.5rem;">
      <textarea class="section-content" placeholder="Section Content" style="width:100%;min-height:80px;">${section.content || ''}</textarea>
      <button class="remove-section-btn" data-idx="${idx}" style="color:#e74c3c;margin-top:0.5rem;">Remove</button>
    `;
    container.appendChild(div);
  });

  // Remove section event
  container.querySelectorAll('.remove-section-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      const sections = getTermsSections();
      sections.splice(idx, 1);
      setTermsSections(sections);
      renderTermsSections();
    };
  });
}

// Add new section
document.getElementById('addSectionBtn').onclick = function() {
  const sections = getTermsSections();
  sections.push({ title: '', content: '' });
  setTermsSections(sections);
  renderTermsSections();
};

// Save terms to localStorage
function saveTerms() {
  const container = document.getElementById('termsSections');
  const titles = container.querySelectorAll('.section-title');
  const contents = container.querySelectorAll('.section-content');
  const sections = [];
  for (let i = 0; i < titles.length; i++) {
    if (titles[i].value.trim() || contents[i].value.trim()) {
      sections.push({
        title: titles[i].value.trim(),
        content: contents[i].value.trim()
      });
    }
  }
  setTermsSections(sections);
  showNotification('Terms saved successfully!', 'success');
}

// Preview modal functions
function previewContent() {
  const sections = getTermsSections();
  const previewArea = document.getElementById('previewArea');
  previewArea.innerHTML = sections.map(s => `
    <h3>${s.title}</h3>
    <p>${s.content.replace(/\n/g, '<br>')}</p>
  `).join('');
  document.getElementById('previewModal').style.display = 'block';
}
function closePreview() {
  document.getElementById('previewModal').style.display = 'none';
}

// Show notification
function showNotification(message, type) {
  let notification = document.getElementById('notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'notification';
    document.body.appendChild(notification);
  }
  notification.className = 'notification ' + type;
  notification.textContent = message;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// On load: If no terms, try to load from store page (if available), else start empty
document.addEventListener('DOMContentLoaded', function () {
  if (!localStorage.getItem('termsSections')) {
    // Optionally, fetch from store page via AJAX if you want to sync, or just start empty
    setTermsSections([
      { title: 'General Terms', content: 'Add your terms here.' }
    ]);
  }
  renderTermsSections();
});