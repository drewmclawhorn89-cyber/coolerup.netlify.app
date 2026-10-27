const KEY = 'coolerup.videos';
const ME = 'me';
const seed = [
  {id: 's1', title: 'Big Buck Bunny', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', owner: 'alex', likes: 42},
  {id: 's2', title: 'Elephants Dream', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', owner: 'sam', likes: 17}
];

let videos = JSON.parse(localStorage.getItem(KEY) || 'null') || seed;
let tab = 'top';

const save = () => localStorage.setItem(KEY, JSON.stringify(videos));

function setTab(t) {
  tab = t;
  document.querySelectorAll('#tabs button')
    .forEach(b => b.classList.toggle('active', b.dataset.tab === t));
  render();
}

function render() {
  const feed = document.getElementById('feed');
  feed.textContent = '';
  let list = tab === 'mine' ? videos.filter(v => v.owner === ME) : videos.slice();
  list.sort((a, b) => tab === 'mine' ? b.created - a.created || 0 : b.likes - a.likes);
  if (!list.length) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = tab === 'mine' ? "You haven't posted anything yet." : 'No videos yet.';
    feed.append(p);
    return;
  }
  for (const v of list) {
    const card = document.createElement('div');
    card.className = 'card';
    const vid = document.createElement('video');
    vid.src = v.url; vid.controls = true; vid.preload = 'metadata';
    const meta = document.createElement('div');
    meta.className = 'meta';
    const label = document.createElement('span');
    label.textContent = `${v.title} · @${v.owner}`;
    const like = document.createElement('button');
    like.className = 'like';
    like.textContent = `♥ ${v.likes}`;
    like.onclick = () => { v.likes++; save(); render(); };
    meta.append(label, like);
    card.append(vid, meta);
    feed.append(card);
  }
}

document.getElementById('tabs').addEventListener('click', e => {
  if (e.target.dataset.tab) setTab(e.target.dataset.tab);
});

document.getElementById('post-form').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const url = document.getElementById('url').value.trim();
  videos.push({id: 'v' + Date.now(), title, url, owner: ME, likes: 0, created: Date.now()});
  save();
  e.target.reset();
  setTab('mine'); // jump to Mine after posting
});

render();
