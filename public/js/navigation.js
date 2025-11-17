const API_BASE = '/api';
let socket;
let currentSection = 'collections';

// Initialize socket.io
if (typeof io !== 'undefined') {
  try {
    socket = io();
  } catch (e) {
    console.log('Socket.io not available:', e);
  }
}

// Section configuration
const sections = {
  'collections': {
    title: 'Collections',
    createLabel: 'Create Collection',
    apiEndpoint: 'collections',
    fields: ['name', 'link', 'collection_type', 'shopifyId', 'image', 'style', 'column']
  },
  'collection-groups': {
    title: 'Collection Groups',
    createLabel: 'Create Collection Group',
    apiEndpoint: 'collection-groups',
    fields: ['name', 'reference', 'style', 'background_image']
  },
  'collection-lists': {
    title: 'Collection Lists',
    createLabel: 'Create Collection List',
    apiEndpoint: 'collection-lists',
    fields: ['name', 'reference', 'link', 'shopifyId', 'text_1', 'text_2', 'text_3']
  },
  'collection-types': {
    title: 'Collection Types',
    createLabel: 'Create Collection Type',
    apiEndpoint: 'collection-types',
    fields: ['name', 'identifier']
  }
};

// Navigation handling
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const section = e.target.dataset.section;
    switchSection(section);
  });
});

function switchSection(section) {
  currentSection = section;
  
  // Update active nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.section === section) {
      item.classList.add('active');
    }
  });
  
  // Update page title and button
  const config = sections[section];
  document.getElementById('page-title').textContent = config.title;
  document.getElementById('create-btn').textContent = config.createLabel;
  
  // Load data
  loadData(section);
}

// Create button handler
document.getElementById('create-btn').addEventListener('click', () => {
  createNew(currentSection);
});

// Load data
async function loadData(section) {
  const config = sections[section];
  const contentArea = document.getElementById('content-area');
  
  try {
    contentArea.innerHTML = '<div style="text-align:center;padding:40px;">Loading...</div>';
    
    const response = await fetch(`${API_BASE}/${config.apiEndpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Loaded ${section}:`, data);
    renderItems(section, data);
  } catch (error) {
    console.error('Error loading data:', error);
    contentArea.innerHTML = `<div class="error">Error loading data: ${error.message}</div>`;
  }
}

// Render items
function renderItems(section, items) {
  const contentArea = document.getElementById('content-area');
  
  if (items.length === 0) {
    contentArea.innerHTML = `
      <div class="empty-state">
        <div class="icon">📦</div>
        <p>No items yet. Create your first one!</p>
      </div>
    `;
    return;
  }
  
  contentArea.innerHTML = items.map(item => createItemCard(section, item)).join('');
}

// Create item card
function createItemCard(section, item) {
  let content = '';
  
  if (section === 'collections') {
    content = `
      ${item.image ? `<img src="${item.image}" style="width:100%;height:150px;object-fit:cover;border-radius:4px;margin-bottom:12px;" alt="${item.name}">` : ''}
      <h3>${item.name || 'Untitled'}</h3>
      <p><strong>Type:</strong> ${item.collection_type || 'N/A'}</p>
      <p><strong>Link:</strong> ${item.link || 'N/A'}</p>
    `;
  } else if (section === 'collection-groups') {
    content = `
      ${item.background_image ? `<img src="${item.background_image}" style="width:100%;height:150px;object-fit:cover;border-radius:4px;margin-bottom:12px;" alt="${item.name}">` : ''}
      <h3>${item.name || 'Untitled'}</h3>
      <p><strong>Reference:</strong> ${item.reference || 'N/A'}</p>
      <p><strong>Collections:</strong> ${item.collections?.length || 0}</p>
    `;
  } else if (section === 'collection-lists') {
    content = `
      <h3>${item.name || 'Untitled'}</h3>
      <p><strong>Reference:</strong> ${item.reference || 'N/A'}</p>
      <p><strong>Link:</strong> ${item.link || 'N/A'}</p>
    `;
  } else if (section === 'collection-types') {
    content = `
      <h3>${item.name || 'Untitled'}</h3>
      <p><strong>Identifier:</strong> ${item.identifier || 'N/A'}</p>
    `;
  }
  
  return `
    <div class="item-card">
      ${content}
      <div class="item-actions">
        <button class="btn btn-secondary" onclick="editItem('${section}', ${item.id})">Edit</button>
        <button class="btn btn-danger" onclick="deleteItem('${section}', ${item.id})">Delete</button>
      </div>
    </div>
  `;
}

// Create new item
function createNew(section) {
  const config = sections[section];
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  
  let formFields = `<h2>${config.createLabel}</h2><form id="item-form">`;
  
  config.fields.forEach(field => {
    const label = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const type = field === 'column' ? 'number' : 'text';
    const required = (field === 'name' || field === 'identifier') ? 'required' : '';
    
    formFields += `
      <div class="form-group">
        <label>${label}</label>
        <input type="${type}" name="${field}" ${required}>
      </div>
    `;
  });
  
  formFields += `
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button type="submit" class="btn btn-primary">Create</button>
    </div>
  </form>`;
  
  modalBody.innerHTML = formFields;
  modal.classList.add('active');
  
  document.getElementById('item-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch(`${API_BASE}/${config.apiEndpoint}/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed to create item');
      
      closeModal();
      loadData(section);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
}

// Edit item
async function editItem(section, id) {
  const config = sections[section];
  
  try {
    const response = await fetch(`${API_BASE}/${config.apiEndpoint}/${id}`);
    if (!response.ok) throw new Error('Failed to load item');
    
    const item = await response.json();
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    let formFields = `<h2>Edit ${config.title}</h2><form id="edit-form">`;
    
    config.fields.forEach(field => {
      const label = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const type = field === 'column' ? 'number' : 'text';
      const value = item[field] || '';
      const required = (field === 'name' || field === 'identifier') ? 'required' : '';
      
      formFields += `
        <div class="form-group">
          <label>${label}</label>
          <input type="${type}" name="${field}" value="${value}" ${required}>
        </div>
      `;
    });
    
    formFields += `
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Update</button>
      </div>
    </form>`;
    
    modalBody.innerHTML = formFields;
    modal.classList.add('active');
    
    document.getElementById('edit-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      
      try {
        const response = await fetch(`${API_BASE}/${config.apiEndpoint}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Failed to update item');
        
        closeModal();
        loadData(section);
      } catch (error) {
        alert('Error: ' + error.message);
      }
    });
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Delete item
async function deleteItem(section, id) {
  if (!confirm('Are you sure you want to delete this item?')) return;
  
  const config = sections[section];
  
  try {
    const response = await fetch(`${API_BASE}/${config.apiEndpoint}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete item');
    loadData(section);
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Close modal
function closeModal() {
  document.getElementById('modal').classList.remove('active');
}

// Socket.io real-time updates
if (socket) {
  socket.on('collection:created', () => { if (currentSection === 'collections') loadData('collections'); });
  socket.on('collection:updated', () => { if (currentSection === 'collections') loadData('collections'); });
  socket.on('collection:deleted', () => { if (currentSection === 'collections') loadData('collections'); });
  socket.on('collectionGroup:created', () => { if (currentSection === 'collection-groups') loadData('collection-groups'); });
  socket.on('collectionGroup:updated', () => { if (currentSection === 'collection-groups') loadData('collection-groups'); });
  socket.on('collectionGroup:deleted', () => { if (currentSection === 'collection-groups') loadData('collection-groups'); });
  socket.on('collectionList:created', () => { if (currentSection === 'collection-lists') loadData('collection-lists'); });
  socket.on('collectionList:updated', () => { if (currentSection === 'collection-lists') loadData('collection-lists'); });
  socket.on('collectionList:deleted', () => { if (currentSection === 'collection-lists') loadData('collection-lists'); });
  socket.on('collectionType:created', () => { if (currentSection === 'collection-types') loadData('collection-types'); });
  socket.on('collectionType:updated', () => { if (currentSection === 'collection-types') loadData('collection-types'); });
  socket.on('collectionType:deleted', () => { if (currentSection === 'collection-types') loadData('collection-types'); });
}

// Initial load
loadData('collections');
