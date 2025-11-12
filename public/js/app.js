const API_BASE = '/api';
const socket = io();

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const section = item.dataset.section;
    
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    
    item.classList.add('active');
    document.getElementById(section).classList.add('active');
    
    loadData(section);
  });
});

// Load data for each section
async function loadData(section) {
  const endpoint = section.replace(/-/g, '-');
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`);
    const data = await response.json();
    renderItems(section, data);
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Render items
function renderItems(section, items) {
  const container = document.getElementById(`${section}-list`);
  
  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">📦</div>
        <p>No items yet. Create your first one!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = items.map(item => createItemCard(section, item)).join('');
}

// Create item card
function createItemCard(section, item) {
  const type = section.replace('collection-', '');
  let content = '';
  
  if (section === 'collections') {
    content = `
      ${item.image ? `<img src="${item.image}" class="item-image" alt="${item.name}">` : ''}
      <h3>${item.name || 'Untitled'}</h3>
      <p><strong>Type:</strong> ${item.collection_type || 'N/A'}</p>
      <p><strong>Link:</strong> ${item.link || 'N/A'}</p>
    `;
  } else if (section === 'collection-groups') {
    content = `
      ${item.background_image ? `<img src="${item.background_image}" class="item-image" alt="${item.name}">` : ''}
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
function createNew(type) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  
  let formFields = '';
  
  if (type === 'collection') {
    formFields = `
      <h2>Create New Collection</h2>
      <form id="item-form">
        <div class="form-group">
          <label>Name</label>
          <input type="text" name="name" required>
        </div>
        <div class="form-group">
          <label>Link</label>
          <input type="text" name="link">
        </div>
        <div class="form-group">
          <label>Collection Type</label>
          <input type="text" name="collection_type">
        </div>
        <div class="form-group">
          <label>Shopify ID</label>
          <input type="text" name="shopifyId">
        </div>
        <div class="form-group">
          <label>Image URL</label>
          <input type="text" name="image">
        </div>
        <div class="form-group">
          <label>Style</label>
          <input type="text" name="style">
        </div>
        <div class="form-group">
          <label>Column</label>
          <input type="number" name="column" value="1">
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Create</button>
        </div>
      </form>
    `;
  } else if (type === 'collection-group') {
    formFields = `
      <h2>Create New Collection Group</h2>
      <form id="item-form">
        <div class="form-group">
          <label>Name</label>
          <input type="text" name="name" required>
        </div>
        <div class="form-group">
          <label>Reference</label>
          <input type="text" name="reference">
        </div>
        <div class="form-group">
          <label>Style</label>
          <input type="text" name="style">
        </div>
        <div class="form-group">
          <label>Background Image URL</label>
          <input type="text" name="background_image">
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Create</button>
        </div>
      </form>
    `;
  } else if (type === 'collection-list') {
    formFields = `
      <h2>Create New Collection List</h2>
      <form id="item-form">
        <div class="form-group">
          <label>Name</label>
          <input type="text" name="name" required>
        </div>
        <div class="form-group">
          <label>Reference</label>
          <input type="text" name="reference">
        </div>
        <div class="form-group">
          <label>Link</label>
          <input type="text" name="link">
        </div>
        <div class="form-group">
          <label>Shopify ID</label>
          <input type="text" name="shopifyId">
        </div>
        <div class="form-group">
          <label>Text 1</label>
          <input type="text" name="text_1">
        </div>
        <div class="form-group">
          <label>Text 2</label>
          <input type="text" name="text_2">
        </div>
        <div class="form-group">
          <label>Text 3</label>
          <input type="text" name="text_3">
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Create</button>
        </div>
      </form>
    `;
  } else if (type === 'collection-type') {
    formFields = `
      <h2>Create New Collection Type</h2>
      <form id="item-form">
        <div class="form-group">
          <label>Name</label>
          <input type="text" name="name" required>
        </div>
        <div class="form-group">
          <label>Identifier</label>
          <input type="text" name="identifier" required>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Create</button>
        </div>
      </form>
    `;
  }
  
  modalBody.innerHTML = formFields;
  modal.classList.add('active');
  
  document.getElementById('item-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      await fetch(`${API_BASE}/${type}/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      closeModal();
      loadData(type + 's');
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Error creating item');
    }
  });
}

// Edit item
async function editItem(section, id) {
  const endpoint = section.replace(/-/g, '-');
  try {
    const response = await fetch(`${API_BASE}/${endpoint}/${id}`);
    const item = await response.json();
    
    // Similar to createNew but with pre-filled data
    alert('Edit functionality - populate form with: ' + JSON.stringify(item));
  } catch (error) {
    console.error('Error loading item:', error);
  }
}

// Delete item
async function deleteItem(section, id) {
  if (!confirm('Are you sure you want to delete this item?')) return;
  
  const endpoint = section.replace(/-/g, '-');
  try {
    await fetch(`${API_BASE}/${endpoint}/${id}`, { method: 'DELETE' });
    loadData(section);
  } catch (error) {
    console.error('Error deleting item:', error);
    alert('Error deleting item');
  }
}

// Close modal
function closeModal() {
  document.getElementById('modal').classList.remove('active');
}

// Socket.io real-time updates
socket.on('collection:created', () => loadData('collections'));
socket.on('collection:updated', () => loadData('collections'));
socket.on('collection:deleted', () => loadData('collections'));
socket.on('collectionGroup:created', () => loadData('collection-groups'));
socket.on('collectionGroup:updated', () => loadData('collection-groups'));
socket.on('collectionGroup:deleted', () => loadData('collection-groups'));
socket.on('collectionList:created', () => loadData('collection-lists'));
socket.on('collectionList:updated', () => loadData('collection-lists'));
socket.on('collectionList:deleted', () => loadData('collection-lists'));
socket.on('collectionType:created', () => loadData('collection-types'));
socket.on('collectionType:updated', () => loadData('collection-types'));
socket.on('collectionType:deleted', () => loadData('collection-types'));

// Initial load
loadData('collections');
