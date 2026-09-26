'use strict';
const grid=document.querySelector('#photo-grid'),dialog=document.querySelector('#lightbox');
const hutKeys=new Set(['ma21','ma22','ma23','fu06','fu25']);
let visible=PHOTOS.slice(),current=0,returnFocus=null;
function group(p){return hutKeys.has(p.key)?'hut':p.key.startsWith('fu')?'irazuyama':'maruishi'}
function render(filter='all'){
 visible=PHOTOS.filter(p=>filter==='all'||group(p)===filter);grid.replaceChildren();
 visible.forEach(p=>{const f=document.createElement('figure'),b=document.createElement('button'),im=document.createElement('img'),cap=document.createElement('figcaption'),time=document.createElement('time');
 b.className='photo-open';b.dataset.photo=p.key;b.setAttribute('aria-label',p.caption+'を拡大');im.src=p.file;im.alt=p.caption;im.loading='lazy';b.append(im);cap.textContent=p.caption;time.textContent=p.date.replaceAll('-','.');cap.append(time);f.append(b,cap);grid.append(f)});
 document.querySelector('.gallery-count').textContent=visible.length+' PHOTOGRAPHS';
 document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
}
function show(){const p=visible[current];document.querySelector('#large-photo').src=p.file;document.querySelector('#large-photo').alt=p.caption;document.querySelector('#large-caption').textContent=`${current+1} / ${visible.length}　${p.caption}　${p.date.replaceAll('-','.')}`;document.querySelector('#photo-source').href=p.source}
document.addEventListener('click',e=>{const f=e.target.closest('[data-filter]');if(f){render(f.dataset.filter);return}const b=e.target.closest('[data-photo]');if(!b)return;returnFocus=b;const p=PHOTOS.find(p=>p.key===b.dataset.photo);if(!visible.includes(p))visible=PHOTOS.slice();current=visible.indexOf(p);show();dialog.showModal();document.body.style.overflow='hidden'});
document.querySelector('.close').addEventListener('click',()=>dialog.close());
document.querySelector('.next').addEventListener('click',()=>{current=(current+1)%visible.length;show()});
document.querySelector('.prev').addEventListener('click',()=>{current=(current+visible.length-1)%visible.length;show()});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){current=(current+1)%visible.length;show()}if(e.key==='ArrowLeft'){current=(current+visible.length-1)%visible.length;show()}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';returnFocus?.focus()});render();
