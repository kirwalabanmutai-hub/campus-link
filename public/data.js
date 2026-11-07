/* CampusLink shared data layer — persists to localStorage */
;(function () {
  const KEY = 'campuslink_v1';

  const DEFAULT = {
    settings: {
      siteName: 'CampusLink',
      tagline: 'Campus services, work and payments in one place',
      email: 'campuslink@gmail.com',
      phone: '+254 700 000 000',
      location: 'Nairobi, Kenya',
    },
    categories: [
      { name: 'Printing', emoji: '🖨️', color: '#10b981' },
      { name: 'Laundry',  emoji: '👕', color: '#3b82f6' },
      { name: 'Academic', emoji: '📚', color: '#f59e0b' },
      { name: 'Food',     emoji: '🍱', color: '#ec4899' },
      { name: 'Housing',  emoji: '🏠', color: '#8b5cf6' },
      { name: 'Repairs',  emoji: '🔧', color: '#06b6d4' },
      { name: 'Writing',  emoji: '✍️', color: '#f97316' },
      { name: 'Movers',   emoji: '🚚', color: '#f97316' },
    ],
    services: [
      { id:1,  emoji:'🖨️', name:'Printing (B&W)',         provider:'Galileo Print Shop',  price:'Ksh 30/page',      rating:'4.8', reviews:120, cat:'Printing', location:'Block A, Room 2',   hours:'8am–8pm',  badge:'Popular'   },
      { id:2,  emoji:'👕', name:'Laundry Service',         provider:'CleanPro Laundry',   price:'From Ksh 100/kg',  rating:'4.7', reviews:85,  cat:'Laundry',  location:'Hostel C',           hours:'7am–9pm',  badge:null        },
      { id:3,  emoji:'📚', name:'Lecture Notes',           provider:'StudyHub Notes',      price:'Ksh 80',           rating:'4.9', reviews:60,  cat:'Academic', location:'Online',             hours:'24/7',     badge:'Top Rated' },
      { id:4,  emoji:'✍️', name:'Essay Writing',           provider:'Write Partners',      price:'Ksh 1,900',        rating:'4.6', reviews:44,  cat:'Writing',  location:'Online',             hours:'24/7',     badge:null        },
      { id:5,  emoji:'💻', name:'Data Entry Jobs',         provider:'Online @ Uni',        price:'Ksh 800',          rating:'4.5', reviews:30,  cat:'Academic', location:'Online',             hours:'24/7',     badge:null        },
      { id:6,  emoji:'🎨', name:'Printing (Color)',        provider:'Galileo Print Shop',  price:'Ksh 80/page',      rating:'4.8', reviews:97,  cat:'Printing', location:'Block A, Room 2',   hours:'8am–8pm',  badge:null        },
      { id:7,  emoji:'🧹', name:'Room Cleaning',           provider:'CleanSpace',          price:'Ksh 500/session',  rating:'4.6', reviews:52,  cat:'Housing',  location:'All Hostels',        hours:'8am–6pm',  badge:'New'       },
      { id:8,  emoji:'🍱', name:'Food Delivery',           provider:'Campus Bites',        price:'From Ksh 200',     rating:'4.4', reviews:210, cat:'Food',     location:'All Campus',         hours:'7am–10pm', badge:'Hot'       },
      { id:9,  emoji:'📦', name:'Room-to-Room Moving',     provider:'SwiftMovers KE',      price:'From Ksh 800',     rating:'4.7', reviews:63,  cat:'Movers',   location:'All Hostels',        hours:'7am–7pm',  badge:'Popular'   },
      { id:10, emoji:'🚚', name:'Off-Campus Relocation',   provider:'CampusHaul',          price:'From Ksh 2,500',   rating:'4.6', reviews:41,  cat:'Movers',   location:'Nairobi & Environs', hours:'8am–6pm',  badge:null        },
      { id:11, emoji:'🪑', name:'Furniture Assembly',      provider:'HandyFix Campus',     price:'Ksh 500/item',     rating:'4.8', reviews:38,  cat:'Movers',   location:'All Hostels',        hours:'8am–8pm',  badge:'New'       },
      { id:12, emoji:'🧳', name:'Luggage Storage',         provider:'SafeStore Campus',    price:'Ksh 100/day',      rating:'4.5', reviews:29,  cat:'Movers',   location:'Main Gate, Block B', hours:'6am–10pm', badge:null        },
      { id:13, emoji:'🛵', name:'Pickup & Delivery',       provider:'QuickRun Express',    price:'From Ksh 300',     rating:'4.6', reviews:88,  cat:'Movers',   location:'All Campus',         hours:'7am–9pm',  badge:'Fast'      },
      { id:14, emoji:'🗃️', name:'End-of-Semester Packing', provider:'SwiftMovers KE',      price:'From Ksh 1,200',   rating:'4.9', reviews:17,  cat:'Movers',   location:'All Hostels',        hours:'8am–5pm',  badge:'Top Rated' },
    ],
    gigs: [
      { id:1, title:'Math Tutor Needed',    budget:'Ksh 2,000', posted:'2h ago',  cat:'Academic', applicants:3,  desc:'Need a patient tutor for calculus and linear algebra. 2 sessions/week.',       skills:['Mathematics','Teaching','Calculus'], poster:'AM' },
      { id:2, title:'Web Designer',         budget:'Ksh 3,800', posted:'5h ago',  cat:'Tech',     applicants:7,  desc:'Design a landing page for a student startup. Figma mockup required.',           skills:['Figma','HTML/CSS','UI Design'],      poster:'JK' },
      { id:3, title:'Data Entry Assistant', budget:'Ksh 800',   posted:'1d ago',  cat:'Admin',    applicants:2,  desc:'Enter research survey results into Excel. About 200 rows. One-time task.',       skills:['Excel','Data Entry','Accuracy'],     poster:'SK' },
      { id:4, title:'Poster Design',        budget:'Ksh 800',   posted:'2d ago',  cat:'Creative', applicants:5,  desc:'Design an A3 poster for a student society event next Friday. Brief and logo provided.',    skills:['Canva','Illustrator','Design'],      poster:'MN' },
      { id:5, title:'Python Tutor',         budget:'Ksh 1,500', posted:'3h ago',  cat:'Academic', applicants:4,  desc:'Help me understand OOP and data structures in Python. 3 sessions.',               skills:['Python','OOP','Algorithms'],         poster:'BM' },
      { id:6, title:'Content Writer',       budget:'Ksh 2,500', posted:'6h ago',  cat:'Creative', applicants:9,  desc:'Write 5 blog posts about campus life and entrepreneurship. SEO knowledge a plus.',skills:['Writing','SEO','Research'],         poster:'FK' },
      { id:7, title:'Furniture Mover',      budget:'Ksh 1,200', posted:'1d ago',  cat:'Physical', applicants:3,  desc:'Help move furniture from Block B to Block D. 2-hour job.',                       skills:['Physical Fitness','Teamwork'],       poster:'PM' },
      { id:8, title:'Social Media Manager', budget:'Ksh 4,000', posted:'4h ago',  cat:'Tech',     applicants:12, desc:'Manage Instagram and TikTok for a campus food brand. 1 month contract.',          skills:['Instagram','TikTok','Content'],      poster:'LL' },
    ],
  };

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || DEFAULT; }
    catch { return DEFAULT; }
  }
  function save(d) { localStorage.setItem(KEY, JSON.stringify(d)); }

  if (!localStorage.getItem(KEY)) save(DEFAULT);

  window.CampusData = {
    /* ── Services ── */
    getServices()       { return load().services; },
    addService(s)       { const d=load(); s.id=Date.now(); d.services.push(s); save(d); return s; },
    updateService(id,u) { const d=load(); const i=d.services.findIndex(s=>s.id===id); if(i>-1){d.services[i]={...d.services[i],...u}; save(d);} },
    deleteService(id)   { const d=load(); d.services=d.services.filter(s=>s.id!==id); save(d); },

    /* ── Gigs ── */
    getGigs()           { return load().gigs; },
    addGig(g)           { const d=load(); g.id=Date.now(); g.applicants=0; g.posted='just now'; d.gigs.push(g); save(d); return g; },
    updateGig(id,u)     { const d=load(); const i=d.gigs.findIndex(g=>g.id===id); if(i>-1){d.gigs[i]={...d.gigs[i],...u}; save(d);} },
    deleteGig(id)       { const d=load(); d.gigs=d.gigs.filter(g=>g.id!==id); save(d); },

    /* ── Categories ── */
    getCategories()     { return load().categories; },
    addCategory(c)      { const d=load(); if(!d.categories.find(x=>x.name===c.name)){d.categories.push(c); save(d);} return c; },
    deleteCategory(n)   { const d=load(); d.categories=d.categories.filter(c=>c.name!==n); save(d); },

    /* ── Settings ── */
    getSettings()       { return load().settings; },
    saveSettings(s)     { const d=load(); d.settings=s; save(d); },


    /* ── Icons (Phosphor names) — used instead of emoji on public pages ── */
    iconFor(cat) {
      const map = { Printing:'printer', Laundry:'t-shirt', Academic:'book-open-text', Food:'bowl-food', Housing:'house-line',
        Repairs:'wrench', Writing:'pen-nib', Movers:'truck', Tech:'code', Creative:'palette', Admin:'clipboard-text', Physical:'barbell' };
      return map[cat] || 'storefront';
    },

    /* ── Photos for service cards: by service name, then category, then a default ── */
    imageFor(s) {
      if (s.img) return s.img;
      const byName = {
        'Printing (B&W)':'printing-card.webp', 'Printing (Color)':'services/printing-color.webp',
        'Laundry Service':'services/laundry.webp', 'Lecture Notes':'services/lecture-notes.webp',
        'Essay Writing':'services/essay-writing.webp', 'Data Entry Jobs':'student-laptop.webp',
        'Room Cleaning':'services/room-cleaning.webp', 'Food Delivery':'services/food-delivery.webp',
        'Room-to-Room Moving':'services/moving-boxes.webp', 'Off-Campus Relocation':'services/relocation-truck.webp',
        'Furniture Assembly':'services/furniture-assembly.webp', 'Luggage Storage':'services/luggage.webp',
        'Pickup & Delivery':'services/pickup-delivery.webp', 'End-of-Semester Packing':'services/packing.webp',
      };
      const byCat = {
        Printing:'printing-card.webp', Laundry:'services/laundry.webp', Academic:'services/lecture-notes.webp',
        Writing:'services/essay-writing.webp', Housing:'services/room-cleaning.webp', Food:'services/food-delivery.webp',
        Movers:'services/moving-boxes.webp', Repairs:'services/furniture-assembly.webp', Tech:'student-laptop.webp',
      };
      return '/images/' + (byName[s.name] || byCat[s.cat] || 'coworking-card.webp');
    },

    /* ── Photos for gig cards: by title, then category, then a default ── */
    gigImageFor(g) {
      if (g.img) return g.img;
      const byTitle = {
        'Math Tutor Needed':'gigs/math-tutor.webp', 'Web Designer':'gigs/web-design.webp',
        'Data Entry Assistant':'student-laptop.webp', 'Poster Design':'gigs/poster-design.webp',
        'Python Tutor':'gigs/python-code.webp', 'Content Writer':'gigs/content-writing.webp',
        'Furniture Mover':'services/moving-boxes.webp', 'Social Media Manager':'gigs/social-media.webp',
      };
      const byCat = {
        Academic:'gigs/math-tutor.webp', Tech:'gigs/web-design.webp', Admin:'student-laptop.webp',
        Creative:'gigs/poster-design.webp', Physical:'services/moving-boxes.webp', Writing:'gigs/content-writing.webp',
      };
      return '/images/' + (byTitle[g.title] || byCat[g.cat] || 'coworking-card.webp');
    },

    /* ── Utils ── */
    reset()             { save(DEFAULT); },
    clearAll()          { save({ ...load(), services:[], gigs:[], categories:[] }); },
    counts()            { const d=load(); return { services:d.services.length, gigs:d.gigs.length, categories:d.categories.length }; },
  };
})();

/* ── CampusAPI: accounts, seller verification, seller products and posted gigs ──
   Talks to the CampusLink server (server/index.js). Every call returns a promise.
   Failed calls reject with an Error that has .status and .errors ({ field: message }). */
;(function () {
  async function call(method, url, body) {
    const opts = { method, credentials: 'same-origin', headers: {} };
    if (body instanceof FormData) opts.body = body;
    else if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
    let res;
    try { res = await fetch(url, opts); }
    catch (e) { const err = new Error("Can't reach the CampusLink server. Check your connection and try again."); err.status = 0; throw err; }
    let data = {};
    try { data = await res.json(); } catch (e) { /* empty or non-JSON reply */ }
    if (!res.ok) {
      const err = new Error(data.error || Object.values(data.errors || {})[0] || 'Something went wrong. Please try again.');
      err.status = res.status; err.errors = data.errors || {};
      throw err;
    }
    return data;
  }

  let metaPromise = null, mePromise = null;

  window.CampusAPI = {
    /* lists: campuses, business types, clothing types, genders, food sub-categories, gig categories */
    meta()              { return metaPromise || (metaPromise = call('GET', '/api/meta')); },

    /* account */
    me()                { return mePromise || (mePromise = call('GET', '/api/auth/me').then(d => d.user).catch(() => null)); },
    register(formData)  { mePromise = null; return call('POST', '/api/auth/register', formData).then(d => d.user); },
    login(email, password) { mePromise = null; return call('POST', '/api/auth/login', { email, password }).then(d => d.user); },
    logout()            { mePromise = null; return call('POST', '/api/auth/logout', {}); },

    /* public listings */
    shops(campus)       { return call('GET', '/api/shops?campus=' + encodeURIComponent(campus)).then(d => d.shops); },
    products(campus)    { return call('GET', '/api/products?campus=' + encodeURIComponent(campus)).then(d => d.products); },
    gigs()              { return call('GET', '/api/gigs').then(d => d.gigs); },

    /* approved sellers */
    myProducts()        { return call('GET', '/api/my/products').then(d => d.products); },
    addProduct(fd)      { return call('POST', '/api/my/products', fd).then(d => d.product); },
    updateProduct(id, fd) { return call('PUT', '/api/my/products/' + id, fd).then(d => d.product); },
    deleteProduct(id)   { return call('DELETE', '/api/my/products/' + id); },

    myDocuments()       { return call('GET', '/api/my/documents').then(d => d.docs); },
    resubmit(fd)        { mePromise = null; return call('POST', '/api/my/documents', fd).then(d => d.user); },

    /* recruiters */
    myGigs()            { return call('GET', '/api/my/gigs').then(d => d.gigs); },
    postGig(gig)        { return call('POST', '/api/my/gigs', gig).then(d => d.gig); },
    deleteGig(id)       { return call('DELETE', '/api/my/gigs/' + id); },

    /* admin */
    adminSellers()      { return call('GET', '/api/admin/sellers').then(d => d.sellers); },
    sellerDocUrl(id, kind) { return '/api/admin/sellers/' + id + '/docs/' + kind; },
    decide(id, status, note) { return call('POST', '/api/admin/sellers/' + id + '/decision', { status, note }).then(d => d.seller); },
    adminGigs()         { return call('GET', '/api/admin/gigs').then(d => d.gigs); },
    adminDeleteGig(id)  { return call('DELETE', '/api/admin/gigs/' + id); },

    /* same rules as the server, for instant feedback in forms */
    isEmail(e)        { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((e || '').trim()); },
    isStudentEmail(e) { return /^[^\s@]+@[^\s@]+\.(ac\.ke|edu)$/i.test((e || '').trim()); },
    isKraPin(p)       { return /^[AP]\d{9}[A-Z]$/i.test((p || '').trim()); },
    isKenyanPhone(p)  { return /^(\+?254|0)(7|1)\d{8}$/.test((p || '').replace(/[\s-]/g, '')); },
  };

  /* Server products and gigs get ids above this, so they never clash with the built-in sample ids. */
  window.CampusAPI.ID_OFFSET = 100000;
})();
