// ═══════ НАВИГАЦИЯ ═══════
function toggleMenu(){document.getElementById('burger').classList.toggle('active');document.getElementById('navLinks').classList.toggle('active')}
function closeMenu(){document.getElementById('burger')?.classList.remove('active');document.getElementById('navLinks')?.classList.remove('active')}

// Подсветка активного пункта
function setActiveNav(){const page=location.pathname.split('/').pop().replace('.html','')||'index';const map={index:'home',services:'services',catalog:'catalog',gallery:'gallery',about:'about',contact:'contact'};document.querySelectorAll('.nav-links a[data-page]').forEach(a=>a.classList.toggle('active',a.dataset.page===map[page]))}

// ═══════ СКРОЛЛ ЭФФЕКТ ═══════
window.addEventListener('scroll',()=>{const n=document.getElementById('navbar');if(n)n.classList.toggle('scrolled',scrollY>30)});

// ═══════ АДМИН ═══════
let isAdmin=false,logoClicks=0;
function toggleAdmin(){isAdmin=!isAdmin;updateAdminUI();if(!isAdmin)closeAllModals()}
function updateAdminUI(){document.body.classList.toggle('admin-open',isAdmin);document.getElementById('adminBar')?.classList.toggle('active',isAdmin);if(typeof buildCatalog==='function')buildCatalog();if(typeof buildGallery==='function')buildGallery()}
function logoClick(){logoClicks++;if(logoClicks>=5){logoClicks=0;toggleAdmin()}else{setTimeout(()=>logoClicks=0,3000)}}
document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.shiftKey&&e.key==='A'){e.preventDefault();toggleAdmin()}});

// ═══════ КОРЗИНА ═══════
let cart=JSON.parse(localStorage.getItem('wg_cart'))||[];
function saveCart(){localStorage.setItem('wg_cart',JSON.stringify(cart));updateCart()}
function addToCart(id){let item=catalogData.find(p=>p.id===id);if(!item)return;let ex=cart.find(p=>p.id===id);if(ex)ex.qty++;else cart.push({...item,qty:1});saveCart();let b=document.querySelector(`button[data-id="${id}"]`);if(b){b.textContent='✓';b.classList.add('added');setTimeout(()=>{b.textContent='В корзину';b.classList.remove('added')},1200)}}
function removeFromCart(id){cart=cart.filter(p=>p.id!==id);saveCart()}
function clearCart(){cart=[];saveCart()}
function updateCart(){let c=document.getElementById('cartCount'),i=document.getElementById('cartItems'),t=document.getElementById('cartTotal'),f=document.getElementById('cartField');
if(c){let n=cart.reduce((s,i)=>s+i.qty,0);c.textContent=n;c.classList.toggle('visible',n>0)}
if(i){i.innerHTML=cart.length===0?'<div class="cart-empty">Корзина пуста</div>':cart.map(item=>`<div class="cart-item">${item.img?`<img src="${item.img}" alt="">`:`<div class="cart-item-fallback">${item.icon}</div>`}<div class="cart-item-info"><div class="cart-item-title">${item.title}</div><div class="cart-item-price">${item.price} ₽ × ${item.qty}</div></div><button class="btn-danger" onclick="removeFromCart(${item.id})">✕</button></div>`).join('')}
if(t){let total=cart.reduce((s,i)=>s+parseInt(i.price.replace(/\s/g,''))*i.qty,0);t.textContent=total.toLocaleString('ru-RU')+' ₽'}
if(f){f.value=cart.map(i=>`${i.title} — ${i.price}₽ ×${i.qty}`).join('; ')}}
function openCart(){document.getElementById('cartModal')?.classList.add('active')}
function closeCart(){document.getElementById('cartModal')?.classList.remove('active')}
function closeCartOutside(e){if(e.target.id==='cartModal')closeCart()}

// ═══════ МОДАЛКИ АДМИНА ═══════
function openProductModal(){document.getElementById('productModalTitle').textContent='Новый товар';document.getElementById('editId').value='';['f_cat','f_title','f_desc','f_price','f_img','f_icon','f_badge'].forEach(id=>document.getElementById(id).value='');document.getElementById('productModal').classList.add('active')}
function editProduct(id){let item=catalogData.find(p=>p.id===id);if(!item)return;document.getElementById('productModalTitle').textContent='Редактировать';document.getElementById('editId').value=id;document.getElementById('f_cat').value=item.cat;document.getElementById('f_title').value=item.title;document.getElementById('f_desc').value=item.desc;document.getElementById('f_price').value=item.price;document.getElementById('f_img').value=item.img||'';document.getElementById('f_icon').value=item.icon;document.getElementById('f_badge').value=item.badge||'';document.getElementById('productModal').classList.add('active')}
function saveProduct(){let id=document.getElementById('editId').value;let d={cat:document.getElementById('f_cat').value.trim(),title:document.getElementById('f_title').value.trim(),desc:document.getElementById('f_desc').value.trim(),price:document.getElementById('f_price').value.trim(),img:document.getElementById('f_img').value.trim(),icon:document.getElementById('f_icon').value.trim()||'🎁',badge:document.getElementById('f_badge').value.trim()||null};if(!d.title||!d.price){alert('Заполните название и цену');return}if(id){let item=catalogData.find(p=>p.id===parseInt(id));if(item)Object.assign(item,d)}else{d.id=Math.max(...catalogData.map(p=>p.id),0)+1;catalogData.push(d)}closeModal('productModal');buildCatalog();buildFilters()}
function delProduct(id){if(!confirm('Удалить товар?'))return;catalogData=catalogData.filter(p=>p.id!==id);buildCatalog();buildFilters()}
function openGalleryModal(){['g_title','g_desc','g_src','g_icon'].forEach(id=>document.getElementById(id).value='');document.getElementById('galleryModal').classList.add('active')}
function saveGallery(){let d={title:document.getElementById('g_title').value.trim(),desc:document.getElementById('g_desc').value.trim(),src:document.getElementById('g_src').value.trim(),icon:document.getElementById('g_icon').value.trim()||'🖼️'};if(!d.title){alert('Введите название');return}galleryData.push(d);closeModal('galleryModal');buildGallery()}
function delGallery(i){if(!confirm('Удалить фото?'))return;galleryData.splice(i,1);buildGallery()}
function closeModal(id){document.getElementById(id)?.classList.remove('active')}
function closeModalOutside(e){if(e.target.classList.contains('modal-overlay'))e.target.classList.remove('active')}
function closeAllModals(){document.querySelectorAll('.modal-overlay').forEach(m=>m.classList.remove('active'))}

// ═══════ ЭКСПОРТ / ИМПОРТ ═══════
function exportData(){let d=document.createElement('a');d.href=URL.createObjectURL(new Blob([JSON.stringify({catalogData,galleryData,servicesData,testimonials,faqData},null,2)],{type:'application/json'}));d.download='winterglow-data.json';d.click()}
function importData(){let i=document.createElement('input');i.type='file';i.accept='.json';i.onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=ev=>{try{let d=JSON.parse(ev.target.result);if(d.catalogData)catalogData=d.catalogData;if(d.galleryData)galleryData=d.galleryData;if(d.servicesData)servicesData=d.servicesData;if(d.testimonials)testimonials=d.testimonials;if(d.faqData)faqData=d.faqData;buildServices();buildCatalog();buildFilters();buildGallery();buildTestimonials();buildFAQ();alert('✓ Данные загружены')}catch(err){alert('Ошибка файла')}};r.readAsText(f)};i.click()}

// ═══════ МАСКА ТЕЛЕФОНА ═══════
function initPhoneMask(){let p=document.getElementById('phone');if(!p)return;p.addEventListener('input',e=>{let v=e.target.value.replace(/\D/g,'');if(v.startsWith('7')||v.startsWith('8'))v=v.slice(1);let s='+7';if(v.length>0)s+=' ('+v.slice(0,3);if(v.length>=3)s+=') '+v.slice(3,6);if(v.length>=6)s+='-'+v.slice(6,8);if(v.length>=8)s+='-'+v.slice(8,10);e.target.value=s})}

// ═══════ ФОРМА ═══════
function initForm(){let f=document.getElementById('contactForm');if(!f)return;f.addEventListener('submit',e=>{e.preventDefault();document.getElementById('formOk')?.classList.add('active');setTimeout(()=>{document.getElementById('formOk')?.classList.remove('active');f.reset();clearCart()},3000)})}

// ═══════ СНЕГ ═══════
function makeSnow(){let c=document.getElementById('snow');if(!c)return;let icons=['❄','✦','·'];for(let i=0;i<30;i++){let f=document.createElement('div');f.className='flake';f.textContent=icons[Math.floor(Math.random()*icons.length)];f.style.left=Math.random()*100+'%';f.style.animationDuration=(Math.random()*8+5)+'s';f.style.animationDelay=Math.random()*8+'s';f.style.opacity=Math.random()*.5+.2;c.appendChild(f)}}

// ═══════ ЗАПУСК ═══════
document.addEventListener('DOMContentLoaded',()=>{setActiveNav();updateCart();initPhoneMask();initForm();makeSnow()});

