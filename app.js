const STORAGE_KEY = 'pwaTracker';
let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { series: [], watched: [], todo: [] };

function render() {
  // Render lists
  document.getElementById('series-list').innerHTML = data.series.map((s,i)=>
    `<li>${s.title} - ${s.progress} afl. <button onclick="remove('series',${i})">x</button></li>`
  ).join('');
  document.getElementById('watched-list').innerHTML = data.watched.map((w,i)=>
    `<li>${w.title} <button onclick="remove('watched',${i})">x</button></li>`
  ).join('');
  document.getElementById('todo-list').innerHTML = data.todo.map((t,i)=>
    `<li>${t.title} <button onclick="remove('todo',${i})">x</button></li>`
  ).join('');
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

document.getElementById('add-series').onclick = ()=>{
  const title = document.getElementById('new-series-title').value;
  const prog = document.getElementById('new-series-progress').value;
  data.series.push({ title, progress: prog }); render();
};
document.getElementById('add-watched').onclick = ()=>{
  const title = document.getElementById('new-watched-title').value;
  data.watched.push({ title }); render();
};
document.getElementById('add-todo').onclick = ()=>{
  const title = document.getElementById('new-todo-title').value;
  data.todo.push({ title }); render();
};

window.remove = (list, idx) => { data[list].splice(idx,1); render(); };
render();
