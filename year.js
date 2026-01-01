// --- INICIALIZACIÓN ---
AOS.init({ duration: 1000, once: true });

// --- ESTRELLAS DE FONDO ---
const starContainer = document.getElementById('star-container');
if(starContainer) {
    for(let i=0; i<50; i++) { 
        const star = document.createElement('div'); 
        star.className = 'star'; 
        star.style.left = Math.random() * 100 + '%'; 
        star.style.top = Math.random() * 100 + '%'; 
        star.style.width = Math.random() * 3 + 'px'; 
        star.style.height = star.style.width; 
        star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's'); 
        starContainer.appendChild(star); 
    }
}

// --- LÓGICA PRINCIPAL DEL AÑO ---
const params = new URLSearchParams(window.location.search);
const year = params.get('year') || 2014;
const data = (typeof folaData !== 'undefined') ? folaData.timeline[year] : null;

if(!data) {
    document.body.innerHTML = "<div class='flex items-center justify-center h-screen'><h1 class='text-white text-3xl font-gaming'>Datos no encontrados</h1></div>";
} else {
    // 1. Configurar Título y Banner
    document.getElementById('year-title').innerText = year;
    const heroCover = data.series.length > 0 && data.series[0].cover ? data.series[0].cover : 'default.jpg';
    document.getElementById('hero-banner').style.backgroundImage = `url('./assets/covers/${heroCover}')`;

    // 2. Gráfico Circular (Winrate)
    const wins = data.series.filter(s => s.result === 'VICTORIA').length;
    const winrate = ((wins / data.series.length) * 100).toFixed(0);
    setTimeout(() => { document.getElementById('winrate-chart').style.setProperty('--p', winrate + '%'); }, 300);
    document.getElementById('winrate-text').innerText = winrate + '%';

    // 3. Estadísticas VS (Fola vs Folana)
    const fGames = data.series.filter(s => s.character === 'Fola');
    const faGames = data.series.filter(s => s.character === 'Folana');
    const fWins = fGames.filter(s => s.result === 'VICTORIA').length;
    const faWins = faGames.filter(s => s.result === 'VICTORIA').length;
    const fRate = fGames.length > 0 ? ((fWins/fGames.length)*100).toFixed(0) : 0;
    const faRate = faGames.length > 0 ? ((faWins/faGames.length)*100).toFixed(0) : 0;

    document.getElementById('stats-fola-rate').innerText = fRate + '%';
    document.getElementById('stats-fola-record').innerText = `${fWins}W - ${fGames.length - fWins}L`;
    document.getElementById('stats-folana-rate').innerText = faRate + '%';
    document.getElementById('stats-folana-record').innerText = `${faWins}W - ${faGames.length - faWins}L`;
    
    // Animación de barras HUD
    setTimeout(() => { 
        document.getElementById('fola-bar').style.width = fRate + '%'; 
        document.getElementById('folana-bar').style.width = faRate + '%'; 
    }, 500);

    // 4. Carrusel de Series
    const listContainer = document.getElementById('series-carousel');
    data.series.forEach((serie, i) => {
        const statusColor = serie.result === 'VICTORIA' ? 'from-green-500 to-green-700' : 'from-red-500 to-red-700';
        const bgImage = `url('./assets/covers/${serie.cover || 'default.jpg'}')`;
        listContainer.innerHTML += `
            <div class="glass-panel hover-glow rounded-2xl h-80 w-64 flex-shrink-0 snap-center overflow-hidden relative group cursor-pointer transition-all duration-500 hover:w-72" data-tilt data-tilt-glare data-tilt-max-glare="0.3" data-aos="fade-left" data-aos-delay="${i*100}">
                <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style="background-image: ${bgImage};"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${statusColor}"></div>
                <div class="absolute bottom-0 left-0 w-full p-6 z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h4 class="font-gaming font-bold text-2xl text-white mb-2 leading-tight drop-shadow-lg group-hover:text-cyan-300 transition-colors">${serie.name}</h4>
                    <div class="flex flex-col gap-1 text-sm font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                        <span class="${serie.character === 'Folana' ? 'text-pink-400' : 'text-blue-400'}">👤 ${serie.character}</span>
                        <span class="text-yellow-400">🏆 MVP: ${serie.mvp}</span>
                    </div>
                </div>
            </div>`;
    });

    // 5. Podio Hall of Fame (3D)
    const top3Podium = document.getElementById('top3-podium');
    const podiumOrder = [data.hallOfFame[1], data.hallOfFame[0], data.hallOfFame[2]].filter(Boolean);
    podiumOrder.forEach((poke, index) => {
        let isRank1 = index === 1; 
        let rankDisplay = isRank1 ? 1 : (index === 0 ? 2 : 3);
        let heightClass = isRank1 ? "h-[400px] w-full md:w-1/3 z-20 order-1 md:order-2" : "h-[320px] w-full md:w-1/4 z-10 opacity-90 hover:opacity-100 order-2 md:order-1";
        let translateY = isRank1 ? "-translate-y-10" : "";
        let borderClass = isRank1 ? "border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]" : (rankDisplay === 2 ? "border-gray-400" : "border-orange-700");
        let medalColor = isRank1 ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" : (rankDisplay === 2 ? "text-gray-300" : "text-orange-400");
        
        top3Podium.innerHTML += `
            <div class="glass-panel ${heightClass} rounded-3xl overflow-hidden relative group border-b-4 ${borderClass} transform transition-all duration-500 hover:-translate-y-2 ${translateY}" data-tilt data-tilt-glare data-tilt-max-glare="0.5" data-aos="fade-up" data-aos-delay="${index*150}">
                <div class="absolute top-6 left-6 z-10 font-gaming text-6xl font-black ${medalColor}">${rankDisplay}</div>
                <div class="w-full h-full flex items-center justify-center p-8">
                    <img src="./assets/${poke.file}" class="pokemon-gif w-full h-full object-contain" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/132.gif'">
                </div>
                <div class="absolute bottom-0 left-0 w-full p-6 text-center z-10 bg-gradient-to-t from-black/80 to-transparent">
                    <h4 class="text-3xl font-bold italic text-white group-hover:text-cyan-400 transition-colors drop-shadow-lg">${poke.name}</h4>
                    <p class="text-sm text-cyan-200 font-bold tracking-[0.2em] uppercase">${poke.species}</p>
                </div>
            </div>`;
    });
}

// --- LÓGICA DE FEEDBACK (Igual que en index) ---
function toggleModal() {
    const modal = document.getElementById('contact-modal');
    modal.classList.toggle('active');
    if(!modal.classList.contains('active')) {
        document.getElementById('formStatus').classList.add('hidden');
        document.getElementById('submitBtn').disabled = false;
        document.getElementById('submitBtn').innerHTML = '<span>ENVIAR COMENTARIO</span> 🚀';
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
        _subject: "Nuevo Comentario FolaDex (Year Page)"
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