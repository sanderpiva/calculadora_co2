const CONFIG = {
    EMISSION_FACTORS: {
        bicycle: 0,
        car: 0.12,
        bus: 0.089,
        truck: 0.96
    },

    TRANSPORT_MODES: {
        bicycle: { label: "Bicicleta", icon: "🚴", color: "#10b981" },
        car: { label: "Carro", icon: "🚘", color: "#3b82f6" },
        bus: { label: "Ônibus", icon: "🚍", color: "#f59e0b" },
        truck: { label: "Caminhão", icon: "🚛", color: "#ef4444" }
    },

    CARBON_CREDIT: {
        KG_PER_CREDIT: 1000,
        PRICE_MIN_BRL: 50,
        PRICE_MAX_BRL: 150
    },

    fetchRemoteDistance: async function(origin, destination) {
        try {
            const getCoords = async (city) => {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
                const data = await response.json();
                return data.length > 0 ? { lat: data[0].lat, lon: data[0].lon } : null;
            };

            const c1 = await getCoords(origin);
            const c2 = await getCoords(destination);

            if (!c1 || !c2) return null;

            const routeUrl = `https://router.project-osrm.org/route/v1/driving/${c1.lon},${c1.lat};${c2.lon},${c2.lat}?overview=false`;
            const routeResponse = await fetch(routeUrl);
            const routeData = await routeResponse.json();

            return (routeData.code === 'Ok' && routeData.routes[0]) 
                ? routeData.routes[0].distance / 1000 
                : null;
        } catch (error) {
            return null;
        }
    },

    populateDatalist: function() {
        if (typeof RoutesDB === 'undefined') return;
        const cities = RoutesDB.getAllCities();
        const datalist = document.getElementById('cities-list');
        if (datalist) {
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                datalist.appendChild(option);
            });
        }
    },

    setupDistanceAutofill: function() {
        const originInput = document.getElementById('origin');
        const destinationInput = document.getElementById('destination');
        const distanceInput = document.getElementById('distance');
        const manualCheckbox = document.getElementById('manual-distance');
        const helperText = distanceInput.nextElementSibling;
        
        const clean_old_datas = () => {
        
            if (!manualCheckbox.checked) {
            
                distanceInput.value = ''; 
                distanceInput.placeholder = "Clique e chame API OSRM";
                helperText.textContent = '⏳ Aguardando rota...';
                helperText.style.color = '#3b82f6';
                
            }

            const sections = ['results', 'comparison', 'carbon-credits'];
            sections.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                el.classList.add('hidden'); 
                }
            });
        };

        originInput.addEventListener('input', clean_old_datas);
        destinationInput.addEventListener('input', clean_old_datas);
        
        
        const tryFindDistance = async () => {
            
            const origin = originInput.value.trim();
            const destination = destinationInput.value.trim();
            
            if (manualCheckbox.checked) return;

            if (origin && destination) {
                helperText.textContent = '⏳ Buscando distância...';
                helperText.style.color = '#3b82f6';

                let distance = await this.fetchRemoteDistance(origin, destination);
                let successMsg = '✓ Distância calculada (API)';

                if (distance === null && typeof RoutesDB !== 'undefined') {
                    distance = RoutesDB.findDistance(origin, destination);
                    successMsg = '✓ Distância encontrada automaticamente';
                }
                
                if (distance !== null) {
        
                    distanceInput.value = (typeof distance === 'number') ? distance.toFixed(2) : distance;
                    distanceInput.readOnly = true;
                    
                    helperText.textContent = successMsg;
                    helperText.style.color = '#10b981';

                    distanceInput.dispatchEvent(new Event('input'));
                } else {
                    
                    distanceInput.value = '';
                    helperText.textContent = 'Rota não encontrada. Por favor, marque a opção para inserir manualmente.';
                    helperText.style.color = '#ef4444';
                }
            }
        };
        
        originInput.addEventListener('change', tryFindDistance);
        destinationInput.addEventListener('change', tryFindDistance);
        
        manualCheckbox.addEventListener('change', function() {
            if (this.checked) {
                distanceInput.readOnly = false;
                distanceInput.placeholder = "Digite a distância em km (ex: 150)";
                distanceInput.value = ''; 
                distanceInput.focus();
                helperText.textContent = 'Insira a distância manualmente';
                helperText.style.color = '#6b7280';
            } else {
                distanceInput.readOnly = true;
                distanceInput.placeholder = "Calculando automaticamente pela API OSRM...";
                helperText.textContent = 'A distância será preenchida automaticamente';
                tryFindDistance();
            }
        });
    }
};
