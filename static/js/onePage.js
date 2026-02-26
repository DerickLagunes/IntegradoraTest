document.addEventListener('DOMContentLoaded', () => {
    
    const container = document.getElementById('card-container');
    let cardCount = 0;
    const maxCards = 100;
    const batchSize = 9;
    let isLoading = false;

    // 10 Títulos
    const titulos = [
        "Desarrollo Web", "Inteligencia Artificial", "Base de Datos", 
        "Redes Cisco", "Seguridad Informática", "Diseño UX/UI", 
        "Cloud Computing", "Internet de las Cosas", "Big Data", "DevOps"
    ];

    const descripciones = [
        "Aprende las últimas tecnologías del mercado.",
        "El futuro de la tecnología está aquí.",
        "Gestiona grandes volúmenes de información.",
        "Conecta el mundo a través de redes seguras.",
        "Protege la integridad de la información.",
        "Mejora la experiencia del usuario final.",
        "Servicios escalables en la nube.",
        "Conectando dispositivos cotidianos a internet.",
        "Análisis de datos para toma de decisiones.",
        "Integración continua y entrega continua."
    ];

    function createCard() {
        const randomTitle = titulos[Math.floor(Math.random() * titulos.length)];
        const randomDesc = descripciones[Math.floor(Math.random() * descripciones.length)];
        const randomImg = imagenes[Math.floor(Math.random() * imagenes.length)];

        // Crear col-md-4 para que quepan 3 por fila
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-4 mb-4 fade-in';

        // HTML de la Card de Bootstrap
        colDiv.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${randomImg}" class="card-img-top" alt="${randomTitle}" style="height: 200px; object-fit: cover; width: 100%;">
                <div class="card-body">
                    <h5 class="card-title">${randomTitle}</h5>
                    <p class="card-text">${randomDesc}</p>
                    <a href="#" class="btn btn-primary btn-sm">Ver más</a>
                </div>
            </div>
        `;

        return colDiv;
    }

    function loadCards() {
	//Controlar la generación infinita
        if (cardCount >= maxCards || isLoading) return;
        isLoading = true;
        
        // Un pequeño retraso para ver el efecto: 500 ms
        setTimeout(() => {
            const limit = Math.min(batchSize, maxCards - cardCount);
            
            for (let i = 0; i < limit; i++) {
                const card = createCard();
                container.appendChild(card);
                cardCount++;
            }

            console.log(`Cards actuales: ${cardCount}`);
            isLoading = false;
        }, 500); 
    }

    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
            loadCards();
        }
    });

    // Cargar el primer lote al abrir la página
    loadCards();
});