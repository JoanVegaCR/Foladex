// ==========================================
// 1. INICIALIZACIÓN DE LIBRERÍAS
// ==========================================
gsap.registerPlugin(ScrollTrigger);
AOS.init({ duration: 800, once: true });

// ==========================================
// 2. FONDO DE ESTRELLAS ANIMADO
// ==========================================
const starContainer = document.getElementById('star-container');
if(starContainer) {
    for(let i=0; i<60; i++) { 
        const star = document.createElement('div'); 
        star.className = 'star'; 
        star.style.left = Math.random() * 100 + '%'; 
        star.style.top = Math.random() * 100 + '%'; 
        star.style.width = Math.random() * 2 + 'px'; 
        star.style.height = star.style.width; 
        star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's'); 
        starContainer.appendChild(star); 
    }
}

// ==========================================
// 3. LÓGICA DEL MODAL (FICHA TÉCNICA)
// ==========================================
function openPokeModal(name, species, file, desc, series, status = "LEYENDA") {
    const modal = document.getElementById('poke-modal');
    const img = document.getElementById('modal-img');
    
    // Llenar datos de texto
    document.getElementById('modal-name').innerText = name;
    document.getElementById('modal-species').innerText = species;
    document.getElementById('modal-series').innerText = series || "SERIE DESCONOCIDA";
    document.getElementById('modal-desc').innerText = `"${desc || 'Sin datos registrados.'}"`;
    
    // Configurar estado y colores
    const statusEl = document.getElementById('modal-status');
    statusEl.innerText = status;
    
    if(status === 'Fallecido') { 
        statusEl.className = 'text-xs font-bold px-2 py-1 rounded border border-red-500/50 bg-red-900/20 text-red-400 uppercase'; 
    } else if(status === 'Vivo') { 
        statusEl.className = 'text-xs font-bold px-2 py-1 rounded border border-green-500/50 bg-green-900/20 text-green-400 uppercase'; 
    } else { 
        statusEl.className = 'text-xs font-bold px-2 py-1 rounded border border-amber-500/50 bg-amber-900/20 text-amber-400 uppercase'; 
    }

    // Cargar imagen con fallback
    img.src = `./assets/${file}`;
    img.onerror = function() { this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/132.gif'; };
    
    // Mostrar modal
    modal.classList.add('active');
}

function closePokeModal(e, force = false) {
    if (force || (e && e.target.id === 'poke-modal')) { 
        document.getElementById('poke-modal').classList.remove('active'); 
    }
}

// ==========================================
// 4. RENDERIZADO DE SECCIONES
// ==========================================

// --- SECCIÓN 1: COMUNIDAD (VOX POPULI) ---
const communityGrid = document.getElementById('community-grid');
if(communityGrid && folaData && folaData.community) {
    (folaData.community.top10 || []).forEach((poke, index) => {
        const isRank1 = index === 0;
        const colSpan = isRank1 ? "lg:col-span-3 md:col-span-2" : "col-span-1";
        const bgClass = isRank1 ? "bg-gradient-to-br from-amber-600/20 to-black border-amber-500" : "gold-panel";
        const imgSize = isRank1 ? "w-40 h-40" : "w-24 h-24";
        const safeLore = (poke.fullHistory || poke.reason).replace(/'/g, "\\'");
        
        communityGrid.innerHTML += `
            <div onclick="openPokeModal('${poke.name}', '${poke.species}', '${poke.file}', '${safeLore}', '${poke.series}', 'COMUNIDAD')" 
                 class="${colSpan} holo-card ${bgClass} rounded-2xl p-6 flex flex-row items-center gap-6 group border border-white/5 relative" data-aos="fade-up">
                <div class="shrink-0 flex flex-col items-center justify-center w-16">
                    <span class="font-gaming ${isRank1?'text-5xl':'text-3xl'} font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-amber-700">#${poke.rank}</span>
                </div>
                <div class="shrink-0"><img src="./assets/${poke.file}" class="${imgSize} object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"></div>
                <div class="flex-1"><h4 class="font-gaming font-bold text-2xl text-white group-hover:text-amber-300 transition-colors">${poke.name}</h4><p class="text-xs text-gray-400 mt-2 line-clamp-2">${poke.reason}</p></div>
            </div>`;
    });
}

// --- SECCIÓN 2: OFICIAL (RANKING DATOS) ---
const legendsContainer = document.getElementById('legends-grid');
// Función helper para ancho de stats
const getW = (val) => Math.min((val / 150) * 100, 100) + "%";
const getTypesHTML = (types) => { if(!types) return ''; return types.map(t => `<span class="type-badge type-${t}">${t}</span>`).join(''); };

if(legendsContainer && folaData && folaData.olympus) {
    folaData.olympus.forEach((poke, index) => {
        const safeLore = (poke.fullHistory || poke.lore).replace(/'/g, "\\'");
        const isAlive = poke.status === 'Vivo';
        const statusColor = isAlive ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10';
        
        // Evitar errores si no hay combatInfo
        const hp = poke.combatInfo ? poke.combatInfo.stats.hp : 50;
        const atk = poke.combatInfo ? poke.combatInfo.stats.atk : 50;
        const spe = poke.combatInfo ? poke.combatInfo.stats.spe : 50;

        legendsContainer.innerHTML += `
            <div onclick="openPokeModal('${poke.name}', '${poke.species}', '${poke.file}', '${safeLore}', '${poke.series}', '${poke.status}')"
                 class="tech-panel rounded-xl p-5 relative group hover:-translate-y-1 transition-all duration-300" data-aos="fade-up">
                
                <span class="tech-bg-rank">#${poke.rank}</span>

                <div class="flex justify-between items-start mb-4 relative z-10">
                    <div class="flex gap-4">
                        <img src="./assets/${poke.file}" class="w-16 h-16 object-contain filter drop-shadow-[0_0_5px_rgba(0,243,255,0.5)] transition-transform group-hover:scale-110">
                        <div>
                            <h3 class="text-xl font-bold text-white font-gaming">${poke.name}</h3>
                            <div class="flex mt-1">${getTypesHTML(poke.types)}</div>
                        </div>
                    </div>
                    <span class="text-[9px] px-2 py-1 rounded border ${statusColor} uppercase font-bold tracking-wider">${poke.status}</span>
                </div>
                
                <div class="bg-black/30 rounded p-3 border border-white/5 mb-3 relative z-10">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">${poke.series}</span>
                        <span class="text-[10px] text-yellow-500">★ ${poke.kills} Kills</span>
                    </div>
                    <p class="text-[10px] text-gray-400 italic line-clamp-2">"${poke.lore}"</p>
                </div>

                <div class="space-y-1 opacity-80 group-hover:opacity-100 transition-opacity relative z-10">
                    <div class="stat-row"><span class="stat-label">HP</span><div class="stat-track"><div class="stat-fill hp" style="width:${getW(hp)}"></div></div></div>
                    <div class="stat-row"><span class="stat-label">ATK</span><div class="stat-track"><div class="stat-fill atk" style="width:${getW(atk)}"></div></div></div>
                    <div class="stat-row"><span class="stat-label">SPE</span><div class="stat-track"><div class="stat-fill spe" style="width:${getW(spe)}"></div></div></div>
                </div>
            </div>`;
    });
}

// --- SECCIÓN 3: KILLERS (TOP 5) ---
const killersContainer = document.getElementById('killers-podium');
if(killersContainer && folaData && folaData.olympus) {
    // Ordenar por Kills
    const top5 = [...folaData.olympus].sort((a, b) => b.kills - a.kills).slice(0, 5);
    
    // Orden visual para el podio (2, 1, 3, 4, 5)
    const visualOrder = [top5[1], top5[0], top5[2], top5[3], top5[4]];

    visualOrder.forEach((poke, i) => {
        if(!poke) return;
        const safeLore = (poke.fullHistory || poke.lore).replace(/'/g, "\\'");
        const rank = top5.indexOf(poke) + 1;
        
        // Estilo especial para Top 1, pero misma estructura
        let sizeClass = (rank === 1) ? "w-40 h-56 z-20 -translate-y-6 border-red-500 shadow-[0_0_30px_#ef4444]" : "w-32 h-48 z-10 border-red-800 opacity-90 hover:opacity-100";
        
        killersContainer.innerHTML += `
            <div onclick="openPokeModal('${poke.name}', '${poke.species}', '${poke.file}', '${safeLore}', '${poke.series}', '${poke.status}')"
                 class="killer-card ${sizeClass}" data-aos="zoom-in" data-aos-delay="${i*100}">
                
                <span class="killer-rank-badge">#${rank}</span>
                
                <div class="flex-1 flex items-center justify-center">
                    <img src="./assets/${poke.file}" class="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,0,0,0.4)] transition-transform group-hover:scale-110">
                </div>
                
                <div class="text-center w-full mt-2 border-t border-red-900/50 pt-2">
                    <span class="block text-sm font-bold text-white font-gaming truncate">${poke.name}</span>
                    <span class="block text-xs text-red-400 font-mono tracking-widest">${poke.kills} KILLS</span>
                </div>
            </div>`;
    });
}

// --- SECCIÓN 4: MENCIONES HONORÍFICAS ---
const mentionsContainer = document.getElementById('mentions-list');
if(mentionsContainer && folaData && folaData.community && folaData.community.mentions) {
    folaData.community.mentions.forEach(poke => {
        const safeLore = (poke.fullHistory || "Sin datos.").replace(/'/g, "\\'");
        
        mentionsContainer.innerHTML += `
            <div onclick="openPokeModal('${poke.name}', '${poke.species}', '${poke.file}', '${safeLore}', '${poke.series || 'Desconocido'}', 'HONOR')"
                 class="bg-gradient-to-r from-gray-900 to-black border border-amber-500/20 rounded-xl p-4 flex items-center gap-4 group hover:border-amber-500/60 transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer">
                <div class="shrink-0 relative">
                    <div class="absolute inset-0 bg-amber-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img src="./assets/${poke.file}" class="w-20 h-20 object-contain relative z-10 filter drop-shadow-[0_0_5px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-gaming font-bold text-xl text-white group-hover:text-amber-400 transition-colors truncate">${poke.name}</h4>
                    <div class="text-xs text-amber-200/80 font-bold tracking-wide uppercase mb-1">${poke.species}</div>
                    <div class="text-[10px] text-gray-500 truncate">${poke.series || 'Nuzlocke'}</div>
                </div>
            </div>`;
    });
}

// ==========================================
// 5. LÓGICA DEL FORMULARIO DE FEEDBACK
// ==========================================
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
        _subject: "Nuevo Comentario FolaDex (Olympus)"
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