/* CampusLink shared data layer — persists to localStorage */
;(function () {
  const KEY = 'campuslink_v1';

  const DEFAULT = {
    settings: {
      siteName: 'CampusLink',
      tagline: 'AI-Powered Campus Services & Opportunities Platform',
      email: 'simplykae2@gmail.com',
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
      { id:4, title:'Poster Design',        budget:'Ksh 800',   posted:'2d ago',  cat:'Creative', applicants:5,  desc:'Design an event poster for a CampusLink launch party. Bright, modern style.',    skills:['Canva','Illustrator','Design'],      poster:'MN' },
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

    /* ── Utils ── */
    reset()             { save(DEFAULT); },
    clearAll()          { save({ ...load(), services:[], gigs:[], categories:[] }); },
    counts()            { const d=load(); return { services:d.services.length, gigs:d.gigs.length, categories:d.categories.length }; },
  };
})();
