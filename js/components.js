// ═══════ УСЛУГИ ═══════
function buildServices(){let g=document.getElementById('servicesGrid');if(!g)return;g.innerHTML=servicesData.map(s=>`<div class="service-card"><span class="service-icon">${s.icon}</span><h3>${s.title}</h3><p>${s.desc}</p><span class="service-price">${s.price}</span></div>`).join('')}

// ═══════ ФИЛЬТРЫ ═══════
function buildFilters(){let c=document.getElementById('filters');if(!c)return;let cats=['Все',...new Set(catalogData.map(i=>i.cat))];c.innerHTML=cats.map(cat=>`<button class="filter-btn ${cat==='Все'?'active':''}" data-f="${cat}">${cat}</button>`).join('');c.querySelectorAll('.filter-btn').forEach(b=>b.addEventListener('click',()=>{c.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');buildCatalog(b.dataset.f,document.getElementById('search')?.value||'')}))}

// ═══════ КАТАЛОГ ═══════
function buildCatalog(filter='Все',search=''){let g=document.getElementById('catalogGrid');if(!g)return;g.innerHTML='';let items=catalogData.filter(i=>(filter==='Все'||i.cat===filter)&&(i.title.toLowerCase().includes(search.toLowerCase())||i.desc.toLowerCase().includes(search.toLowerCase())||i.cat.toLowerCase().includes(search.toLowerCase())));if(items.length===0){g.innerHTML='<p style="text-align:center;color:var(--text3);grid-column:1/-1">Ничего не найдено</p>';return}g.innerHTML=items.map(item=>`<div class="product-card">${isAdmin?`<button class="admin-edit" onclick="editProduct(${item.id})">✎</button><button class="admin-delete" onclick="delProduct(${item.id})">✕</button>`:''}<div class="product-img">${item.img?`<img src="${item.img}" alt="${item.title}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="product-img-fallback" style="display:none">${item.icon}</div>`:`<div class="product-img-fallback">${item.icon}</div>`}${item.badge?`<span class="product-badge">${item.badge}</span>`:''}</div><div class="product-body"><p class="product-cat">${item.cat}</p><h3 class="product-title">${item.title}</h3><p class="product-desc">${item.desc}</p><div class="product-footer"><span class="product-price">${item.price} <small>₽</small></span><button class="btn-sm" data-id="${item.id}" onclick="addToCart(${item.id})">В корзину</button></div></div></div>`).join('')}

// ═══════ ПОИСК ═══════
function initSearch(){let s=document.getElementById('search');if(!s)return;s.addEventListener('input',()=>{let f=document.querySelector('.filter-btn.active')?.dataset.f||'Все';buildCatalog(f,s.value)})}

// ═══════ ГАЛЕРЕЯ ═══════
function buildGallery(){let g=document.getElementById('galleryGrid');if(!g)return;g.innerHTML=galleryData.map((item,i)=>`<div class="gallery-item">${isAdmin?`<button class="admin-delete" onclick="delGallery(${i})">✕</button>`:''}${item.src?`<img src="${item.src}" alt="${item.title}" loading="lazy" onerror="this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,var(--bg2),var(--surface2))'">`:`<div class="product-img-fallback" style="position:absolute;inset:0">${item.icon}</div>`}<div class="gallery-overlay"><h4>${item.title}</h4><p>${item.desc}</p></div></div>`).join('');g.querySelectorAll('.gallery-item').forEach((el,i)=>{if(!isAdmin)el.addEventListener('click',()=>openLb(i))})}

// ═══════ ЛАЙТБОКС ═══════
let lbIdx=0;
function openLb(i){if(isAdmin)return;lbIdx=i;let item=galleryData[i];document.getElementById('lbImg').src=item.src;document.getElementById('lbCap').textContent=`${item.title} — ${item.desc}`;document.getElementById('lightbox').classList.add('active')}
function closeLb(){document.getElementById('lightbox').classList.remove('active')}
function closeLbOutside(e){if(e.target.id==='lightbox')closeLb()}
function lbNav(d){lbIdx=(lbIdx+d+galleryData.length)%galleryData.length;openLb(lbIdx)}
document.addEventListener('keydown',e=>{let lb=document.getElementById('lightbox');if(!lb||!lb.classList.contains('active'))return;if(e.key==='Escape')closeLb();if(e.key==='ArrowRight')lbNav(1);if(e.key==='ArrowLeft')lbNav(-1)});

// ═══════ BEFORE / AFTER СЛАЙДЕР ═══════
let baCurrentIdx=0;
function buildBeforeAfter(){let c=document.getElementById('baContainer');if(!c)return;let item=beforeAfterData[baCurrentIdx];c.innerHTML=`<img class="ba-img ba-before" src="${item.before}" alt="До" onerror="this.style.background='var(--surface2)'"><img class="ba-img ba-after" id="baAfter" src="${item.after}" alt="После" onerror="this.style.background='var(--surface2)'"><div class="ba-label ba-label-before">До</div><div class="ba-label ba-label-after">После</div><div class="ba-handle" id="baHandle"></div>`;initBADrag()}
function buildBATabs(){let t=document.getElementById('baTabs');if(!t)return;t.innerHTML=beforeAfterData.map((item,i)=>`<button class="ba-tab ${i===baCurrentIdx?'active':''}" onclick="switchBA(${i})">${item.title}</button>`).join('')}
function switchBA(i){baCurrentIdx=i;buildBeforeAfter();buildBATabs()}
function initBADrag(){let c=document.getElementById('baContainer');let h=document.getElementById('baHandle');let a=document.getElementById('baAfter');if(!c||!h||!a)return;let dragging=false;
function setPos(x){let r=c.getBoundingClientRect();let pct=((x-r.left)/r.width)*100;pct=Math.max(0,Math.min(100,pct));h.style.left=pct+'%';a.style.clipPath=`inset(0 0 0 ${pct}%)`}
h.addEventListener('mousedown',e=>{dragging=true;e.preventDefault()});
c.addEventListener('mousedown',e=>{dragging=true;setPos(e.clientX)});
document.addEventListener('mousemove',e=>{if(dragging)setPos(e.clientX)});
document.addEventListener('mouseup',()=>dragging=false);
// Touch
h.addEventListener('touchstart',e=>{dragging=true;e.preventDefault()});
c.addEventListener('touchstart',e=>{dragging=true;setPos(e.touches[0].clientX)});
document.addEventListener('touchmove',e=>{if(dragging)setPos(e.touches[0].clientX)});
document.addEventListener('touchend',()=>dragging=false)}

// ═══════ ОТЗЫВЫ ═══════
function buildTestimonials(){let g=document.getElementById('testGrid');if(!g)return;g.innerHTML=testimonials.map(t=>`<div class="test-card"><div class="test-stars">${t.stars}</div><p class="test-text">"${t.text}"</p><p class="test-author">${t.author}</p><p class="test-loc">${t.loc}</p></div>`).join('')}

// ═══════ FAQ ═══════
function buildFAQ(){let g=document.getElementById('faqList');if(!g)return;g.innerHTML=faqData.map(f=>`<div class="faq-item" onclick="this.classList.toggle('open')"><div class="faq-q">${f.q}<span class="arrow">▼</span></div><div class="faq-a">${f.a}</div></div>`).join('')}

// ═══════ КАЛЬКУЛЯТОР ЦЕНЫ ═══════
function calcPrice(){let p=pricingMatrix;let roofM=parseInt(document.getElementById('calcRoof')?.value)||0;let windows=parseInt(document.getElementById('calcWindows')?.value)||0;let trees=parseInt(document.getElementById('calcTrees')?.value)||0;let treeSize=document.getElementById('calcTree')?.value||'none';let figures=parseInt(document.getElementById('calcFigures')?.value)||0;let interior=document.getElementById('calcInterior')?.checked||false;
let total=0;
total+=roofM*p.bakhroma;
total+=windows*4*p.garlandWindow; // ~4м на окно
total+=trees*p.garlandTree*10; // ~10м на дерево
if(treeSize==='small')total+=p.treeSmall;if(treeSize==='medium')total+=p.treeMedium;if(treeSize==='large')total+=p.treeLarge;
total+=figures*p.figure;
if(interior)total+=p.interior;
let min=Math.round(total*0.9);let max=Math.round(total*1.1);
let el=document.getElementById('calcResult');
if(el){el.innerHTML=`<div class="calc-result-label">Ориентировочная стоимость:</div><div class="calc-result-price">${min.toLocaleString('ru-RU')} – ${max.toLocaleString('ru-RU')} ₽</div><div class="calc-result-note">Точная цена — после бесплатного замера</div>`}}

// ═══════ ИНИЦИАЛИЗАЦИЯ ═══════
document.addEventListener('DOMContentLoaded',()=>{buildServices();buildFilters();buildCatalog();buildGallery();buildTestimonials();buildFAQ();initSearch();buildBeforeAfter();buildBATabs();calcPrice()});

