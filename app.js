// app.js
window.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'pwaTracker';
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { watched: [], inprogress: [], todo: [] };
  let editIndex = null;
  let editList = null;

  const modal = document.getElementById('modal');
  const titleInput = document.getElementById('item-title');
  const typeSelect = document.getElementById('item-type');
  const episodeLabel = document.getElementById('label-episode');
  const timeLabel = document.getElementById('label-time');
  const episodeInput = document.getElementById('item-episode');
  const timeInput = document.getElementById('item-time');
  const saveBtn = document.getElementById('save-item');
  const cancelBtn = document.getElementById('cancel');
  const addBtn = document.getElementById('add-btn');
  const inProgList = document.getElementById('inprogress-list');

  function updateFieldVisibility() {
    if (typeSelect.value === 'serie') {
      episodeLabel.classList.remove('hidden');
      timeLabel.classList.add('hidden');
    } else {
      episodeLabel.classList.add('hidden');
      timeLabel.classList.remove('hidden');
    }
  }

  typeSelect.addEventListener('change', updateFieldVisibility);

  function render() {
    document.getElementById('watched-list').innerHTML = data.watched.map((item, i) =>
      `<li data-list="watched" data-index="${i}">${item.title}</li>`
    ).join('');

    inProgList.innerHTML = data.inprogress.map((item, i) =>
      `<li data-list="inprogress" data-index="${i}">${item.title} (${item.type}${item.type === 'serie' ? ` - afl ${item.episode}` : ` - min ${item.time}`})</li>`
    ).join('');

    document.getElementById('todo-list').innerHTML = data.todo.map((item, i) =>
      `<li data-list="todo" data-index="${i}">${item.title}</li>`
    ).join('');

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function showModal(title, list = null, index = null) {
    editList = list;
    editIndex = index;
    document.getElementById('modal-title').textContent = title;
    if (list !== null && index !== null) {
      const item = data[list][index];
      titleInput.value = item.title;
      typeSelect.value = item.type;
      updateFieldVisibility();
      episodeInput.value = item.episode || 1;
      timeInput.value = item.time || 0;
    } else {
      titleInput.value = '';
      typeSelect.value = 'serie';
      updateFieldVisibility();
      episodeInput.value = 1;
      timeInput.value = 0;
    }
    modal.classList.remove('hidden');
  }

  function hideModal() {
    modal.classList.add('hidden');
    editList = null;
    editIndex = null;
  }

  addBtn.addEventListener('click', () => showModal('Item toevoegen'));
  cancelBtn.addEventListener('click', hideModal);

  saveBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    if (!title) return;
    const type = typeSelect.value;
    const entry = { title, type };
    if (type === 'serie') {
      entry.episode = parseInt(episodeInput.value) || 1;
      entry.time = 0;
    } else {
      entry.time = parseInt(timeInput.value) || 0;
      entry.episode = 0;
    }

    if (editList !== null && editIndex !== null) {
      data[editList][editIndex] = entry;
    } else {
      data.inprogress.push(entry);
    }
    render();
    hideModal();
  });

  inProgList.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li) return;
    const list = li.dataset.list;
    const idx = Number(li.dataset.index);
    showModal('Bewerk voortgang', list, idx);
  });

  render();
});
