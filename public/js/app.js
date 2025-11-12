const API_BASE = '/api';
let socket;

// Initialize socket.io if available
if (typeof io !== 'undefined') {
  try {
    socket = io();
  } catch (e) {
    console.log('Socket.io not available:', e);
  }
}

// Load data for each section
async function loadData(section) {
  try {
    const response = await fetch(`${API_BASE}/${section}`);
    
    if (!response.ok) {
      throw new Error('Failed to load data');
    }
    
    const data = await response.json();
    console.log(`Loaded ${section}:`, data);
    renderItems(section, data);
  } catch (error) {
    console.error('Error loading data:', error);
    const container = document.getElementById(`${section}-list`);
    if (container) {
      container.innerHTML = `<div class="error">Error loading data: ${error.message}</div>`;
    }
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
      const response = await fetch(`${API_BASE}/${type}s/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create item');
      }
      
      const result = await response.json();
      console.log('Created:', result);
      closeModal();
      
      // Reload the correct section
      const section = type === 'collection' ? 'collections' : 
                     type === 'collection-group' ? 'collection-groups' :
                     type === 'collection-list' ? 'collection-lists' :
                     'collection-types';
      loadData(section);
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Error creating item: ' + error.message);
    }
  });
}

// Edit item
async function editItem(section, id) {
  try {
    const response = await fetch(`${API_BASE}/${section}/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to load item');
    }
    
    const item = await response.json();
    
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    const type = section.replace('collections', 'collection')
                       .replace('collection-groups', 'collection-group')
                       .replace('collection-lists', 'collection-list')
                       .replace('collection-types', 'collection-type');
    
    let formFields = '';
    
    if (section === 'collections') {
      formFields = `
        <h2>Edit Collection</h2>
        <form id="edit-form">
          <div class="form-group">
            <label>Name</label>
            <input type="text" name="name" value="${item.name || ''}" required>
          </div>
          <div class="form-group">
            <label>Link</label>
            <input type="text" name="link" value="${item.link || ''}">
          </div>
          <div class="form-group">
            <label>Collection Type</label>
            <input type="text" name="collection_type" value="${item.collection_type || ''}">
          </div>
          <div class="form-group">
            <label>Shopify ID</label>
            <input type="text" name="shopifyId" value="${item.shopifyId || ''}">
          </div>
          <div class="form-group">
            <label>Image URL</label>
            <input type="text" name="image" value="${item.image || ''}">
          </div>
          <div class="form-group">
            <label>Style</label>
            <input type="text" name="style" value="${item.style || ''}">
          </div>
          <div class="form-group">
            <label>Column</label>
            <input type="number" name="column" value="${item.column || 1}">
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Update</button>
          </div>
        </form>
      `;
    } else if (section === 'collection-groups') {
      formFields = `
        <h2>Edit Collection Group</h2>
        <form id="edit-form">
          <div class="form-group">
            <label>Name</label>
            <input type="text" name="name" value="${item.name || ''}" required>
          </div>
          <div class="form-group">
            <label>Reference</label>
            <input type="text" name="reference" value="${item.reference || ''}">
          </div>
          <div class="form-group">
            <label>Style</label>
            <input type="text" name="style" value="${item.style || ''}">
          </div>
          <div class="form-group">
            <label>Background Image URL</label>
            <input type="text" name="background_image" value="${item.background_image || ''}">
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Update</button>
          </div>
        </form>
      `;
    } else if (section === 'collection-lists') {
      formFields = `
        <h2>Edit Collection List</h2>
        <form id="edit-form">
          <div class="form-group">
            <label>Name</label>
            <input type="text" name="name" value="${item.name || ''}" required>
          </div>
          <div class="form-group">
            <label>Reference</label>
            <input type="text" name="reference" value="${item.reference || ''}">
          </div>
          <div class="form-group">
            <label>Link</label>
            <input type="text" name="link" value="${item.link || ''}">
          </div>
          <div class="form-group">
            <label>Shopify ID</label>
            <input type="text" name="shopifyId" value="${item.shopifyId || ''}">
          </div>
          <div class="form-group">
            <label>Text 1</label>
            <input type="text" name="text_1" value="${item.text_1 || ''}">
          </div>
          <div class="form-group">
            <label>Text 2</label>
            <input type="text" name="text_2" value="${item.text_2 || ''}">
          </div>
          <div class="form-group">
            <label>Text 3</label>
            <input type="text" name="text_3" value="${item.text_3 || ''}">
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Update</button>
          </div>
        </form>
      `;
    } else if (section === 'collection-types') {
      formFields = `
        <h2>Edit Collection Type</h2>
        <form id="edit-form">
          <div class="form-group">
            <label>Name</label>
            <input type="text" name="name" value="${item.name || ''}" required>
          </div>
          <div class="form-group">
            <label>Identifier</label>
            <input type="text" name="identifier" value="${item.identifier || ''}" required>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Update</button>
          </div>
        </form>
      `;
    }
    
    modalBody.innerHTML = formFields;
    modal.classList.add('active');
    
    document.getElementById('edit-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      
      try {
        const updateResponse = await fetch(`${API_BASE}/${section}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (!updateResponse.ok) {
          throw new Error('Failed to update item');
        }
        
        const result = await updateResponse.json();
        console.log('Updated:', result);
        closeModal();
        loadData(section);
      } catch (error) {
        console.error('Error updating item:', error);
        alert('Error updating item: ' + error.message);
      }
    });
  } catch (error) {
    console.error('Error loading item:', error);
    alert('Error loading item: ' + error.message);
  }
}

// Delete item
async function deleteItem(section, id) {
  if (!confirm('Are you sure you want to delete this item?')) return;
  
  try {
    const response = await fetch(`${API_BASE}/${section}/${id}`, { method: 'DELETE' });
    
    if (!response.ok) {
      throw new Error('Failed to delete item');
    }
    
    console.log('Deleted item:', id);
    loadData(section);
  } catch (error) {
    console.error('Error deleting item:', error);
    alert('Error deleting item: ' + error.message);
  }
}

// Close modal
function closeModal() {
  document.getElementById('modal').classList.remove('active');
}

// Socket.io real-time updates
if (socket) {
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
}

// Initial load
loadData('collections');
