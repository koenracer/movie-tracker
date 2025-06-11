// app.js
const STORAGE_KEY = 'pwaTracker';
let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { watched: [], inprogress: [], todo: [] };
let editIndex = null;
let editList = null;

function render() {
  document.getElementById('watched-list').innerHTML = data.watched.map((item,i) =>
    `<li data-list="watched" data-index="${i}"><span>${item.title}</span></li>`
  ).join('');

  document.getElementById('inprogress-list').innerHTML = data.inprogress.map((item,i) =>
    `<li data-list="inprogress" data-index="${i}"><span>${item.title} (${item.type})` +
    `${item.type==='serie'?` - afl ${item.episode}`:''}${item.type==='film'?` - min ${item.time}`:''}</span></li>`
  ).join('');

  document.getElementById('todo-list').innerHTML = data.todo.map((item,i) =>
    `<li data-list="todo" data-index="${i}"><span>${item.title}</span></li>`
  ).join('');

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Show modal
function showModal(title, list=null, index=null) {
  editList = list;
  editIndex = index;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('item-title').value = list ? data[list][index].title : '';
  document.getElementById('item-type').value = list && data[list][index].type ? data[list][index].type : 'serie';
  document.getElementById('modal').classList.remove('hidden');
}

// Hide modal
function hideModal() {
  editList = null;
  editIndex = null;
  document.getElementById('modal').classList.add('hidden');
}

document.getElementById('add-btn').addEventListener('click', () => showModal('Item toevoegen'));

document.getElementById('cancel').addEventListener('click', hideModal);

document.getElementById('save-item').addEventListener('click', () => {
  const title = document.getElementById('item-title').value.trim();
  const type = document.getElementById('item-type').value;
  if (!title) return;
  const entry = { title, type };
  if (type === 'serie') { entry.episode = data.inprogress[editIndex]?.episode || 1; entry.time = 0; }
  else { entry.time = data.inprogress[editIndex]?.time || 0; entry.episode = 0; }

  if (editList && editIndex !== null) {
    data[editList][editIndex] = Object.assign(data[editList][editIndex], entry);
  } else {
    // add to todo by default as new
    data.todo.push(entry);
  }
  render();
  hideModal();
});

// Click on items for edit or move
['watched-list','inprogress-list','todo-list'].forEach(id => {
  document.getElementById(id).addEventListener('click', e => {
    const li = e.target.closest('li'); if (!li) return;
    const list = li.dataset.list;
    const idx = +li.dataset.index;
    if (list === 'inprogress') {
      showModal('Bewerk voortgang', 'inprogress', idx);
    }
    // could add move between lists
  });
});

render();
