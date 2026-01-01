// --- GENERACIÓN DE ESTRELLAS DE FONDO ---
const starContainer = document.getElementById('star-container');
if (starContainer) {
    for(let i=0; i<50; i++) { 
        const star = document.createElement('div'); 
        star.className = 'star'; 
        star.style.left = Math.random() * 100 + '%'; 
        star.style.top = Math.random() * 100 + '%'; 
        star.style.width = Math.random() * 3 + 'px'; 
        star.style.height = star.style.width; 
        star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's'); 
        star.style.animationDelay = Math.random() * 5 + 's'; 
        starContainer.appendChild(star); 
    }
}

// --- RENDERIZADO DE LA LÍNEA DE TIEMPO ---
const container = document.getElementById('timeline-container');
const startYear = 2014;
const endYear = 2025;

if (container && typeof folaData !== 'undefined') {
    for (let year = startYear; year <= endYear; year++) {
        const data = folaData.timeline[year];
        const seriesList = data ? data.series.slice(0, 2) : [];
        const isTop = year % 2 === 0;
        const itemHTML = document.createElement('div');
        itemHTML.className = `timeline-item flex-1 h-full relative group ${isTop ? 'item-top' : 'item-bottom'}`;
        
        let previewHTML = seriesList.map(s => `<div class="text-[10px] md:text-xs text-cyan-100 truncate w-full px-1 py-0.5">› ${s.name}</div>`).join('');

        if (isTop) { 
            itemHTML.innerHTML = `<div class="absolute bottom-[50%] w-full flex flex-col items-center mb-6 transition-transform duration-300 group-hover:-translate-y-2"><a href="year.html?year=${year}" class="w-full text-center relative"><h2 class="year-text font-year">${year}</h2><div class="connector translate-y-full"></div></a><div class="series-preview text-center mt-2 bg-black/80 backdrop-blur rounded py-2 border border-white/5 mx-auto max-w-[120px]">${previewHTML}</div></div><div class="timeline-node"></div>`; 
        } else { 
            itemHTML.innerHTML = `<div class="timeline-node"></div><div class="absolute top-[50%] w-full flex flex-col items-center mt-6 transition-transform duration-300 group-hover:translate-y-2"><a href="year.html?year=${year}" class="w-full text-center relative"><div class="connector -translate-y-full"></div><h2 class="year-text font-year">${year}</h2></a><div class="series-preview text-center mt-2 bg-black/80 backdrop-blur rounded py-2 border border-white/5 mx-auto max-w-[120px]">${previewHTML}</div></div>`; 
        }
        container.appendChild(itemHTML);
    }
}

// --- ANIMACIONES DE ENTRADA (ESTO ARREGLA LA PANTALLA NEGRA) ---
window.onload = () => {
    // Estas animaciones hacen aparecer los elementos ocultos
    gsap.to(".header-anim", { opacity: 1, duration: 1.5, delay: 0.5 });
    gsap.to("#main-line", { width: "90%", duration: 2, ease: "power2.out", delay: 0.2 });
    gsap.to(".timeline-node", { scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)", delay: 1 });
    gsap.to(".year-text", { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 1.2 });
};

// --- BUSCADOR ---
function toggleSearch() { 
    const overlay = document.getElementById('search-overlay'); 
    overlay.classList.toggle('active'); 
    if(overlay.classList.contains('active')) document.getElementById('search-input').focus(); 
}

document.getElementById('search-input')?.addEventListener('keyup', (e) => {
    const val = e.target.value.toLowerCase();
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = '';
    if(val.length < 2) return;
    
    if (typeof folaData !== 'undefined') {
        Object.keys(folaData.timeline).forEach(year => {
            folaData.timeline[year].series.forEach(serie => {
                if(serie.name.toLowerCase().includes(val)) { 
                    resultsDiv.innerHTML += `<a href="year.html?year=${year}" class="block bg-white/5 p-3 rounded hover:bg-cyan-500/20 transition-colors border border-white/10 mb-2"><div class="flex justify-between"><span class="font-bold text-white">${serie.name}</span><span class="text-xs text-cyan-400">${year}</span></div></a>`; 
                }
            });
        });
        
        folaData.olympus.forEach(poke => {
            if(poke.name.toLowerCase().includes(val) || poke.species.toLowerCase().includes(val)) { 
                resultsDiv.innerHTML += `<a href="olympus.html" class="block bg-yellow-500/10 p-3 rounded hover:bg-yellow-500/20 transition-colors border border-yellow-500/30 mb-2"><div class="flex items-center gap-3"><span class="text-xl">👑</span><div><span class="font-bold text-yellow-200">${poke.name}</span> <span class="text-xs text-gray-400">(${poke.species})</span></div></div></a>`; 
            }
        });
    }
});

// --- LÓGICA DE FEEDBACK ---
function toggleModal() {
    const modal = document.getElementById('contact-modal');
    modal.classList.toggle('active');
    if(!modal.classList.contains('active')) {
        document.getElementById('formStatus').classList.add('hidden');
        const btn = document.getElementById('submitBtn');
        if(btn) {
            btn.disabled = false;
            btn.innerHTML = '<span>ENVIAR COMENTARIO</span> 🚀';
        }
    }
}

async function sendFeedback(e) {
    e.preventDefault();
    const FORMSUBMIT_URL = "https://formsubmit.co/ajax/vjoanvega10@gmail.com"; 

    const btn = document.getElementById('submitBtn');
    const status = document.getElementById('formStatus');
    const formData = {
        name: document.getElementById('senderName').value,
        message: document.getElementById('senderMessage').value,
        _subject: "Nuevo Comentario FolaDex"
    };

    btn.disabled = true; btn.innerHTML = 'ENVIANDO... ⏳'; btn.classList.add('opacity-50');

    try {
        const response = await fetch(FORMSUBMIT_URL, {
            method: "POST", headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(formData)
        });
        if (response.ok) {
            btn.innerHTML = '¡ENVIADO! ✅'; btn.classList.remove('from-cyan-600'); btn.classList.add('from-green-600');
            status.innerText = "Gracias por tu aporte. Tu mensaje ha sido recibido.";
            status.className = "text-center text-green-400 mt-4 font-bold animate-pulse"; status.classList.remove('hidden');
            setTimeout(() => { document.getElementById('feedbackForm').reset(); toggleModal(); }, 2500);
        } else { throw new Error("Error"); }
    } catch (error) {
        btn.innerHTML = 'ERROR AL ENVIAR ❌'; btn.disabled = false;
        status.innerText = "Hubo un problema. Por favor intenta de nuevo."; status.className = "text-center text-red-400 mt-4 font-bold"; status.classList.remove('hidden');
    }
}