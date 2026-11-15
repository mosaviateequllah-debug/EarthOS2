/* Progressive enhancements: mobile navigation, live date, keyboard and offline shell. */
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const sidebar = $('.sidebar');
  if (!sidebar) return;
  const topbar = $('.topbar');
  const menu = document.createElement('button');
  menu.className = 'mobile-menu'; menu.type = 'button'; menu.setAttribute('aria-label','Open navigation'); menu.setAttribute('aria-expanded','false'); menu.innerHTML = '☰';
  topbar?.prepend(menu);
  const backdrop = document.createElement('div'); backdrop.className = 'sidebar-backdrop'; backdrop.setAttribute('aria-hidden','true'); document.body.append(backdrop);
  const close = () => { sidebar.classList.remove('is-open'); backdrop.classList.remove('is-visible'); menu.setAttribute('aria-expanded','false'); menu.innerHTML='☰'; };
  const open = () => { sidebar.classList.add('is-open'); backdrop.classList.add('is-visible'); menu.setAttribute('aria-expanded','true'); menu.innerHTML='×'; };
  menu.addEventListener('click',()=>sidebar.classList.contains('is-open')?close():open());
  backdrop.addEventListener('click',close);
  sidebar.addEventListener('click',e=>{if(e.target.closest('[data-page]'))close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  const updateDate=()=>{const node=$('.crumb div');if(!node)return;const locale=document.documentElement.lang==='en'?'en-US':'fa-AF';try{node.textContent=new Intl.DateTimeFormat(locale,{weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(new Date())}catch{node.textContent=new Date().toLocaleDateString()}};
  updateDate(); document.getElementById('langBtn')?.addEventListener('click',()=>setTimeout(updateDate,0));
  document.querySelectorAll('button').forEach(b=>{if(!b.getAttribute('aria-label') && !b.textContent.trim()) b.setAttribute('aria-label','Action')});
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();
