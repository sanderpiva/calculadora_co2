/**
 * Routes Database
 * Contains route data for Brazilian cities and utility methods
 * to retrieve cities and calculate distances
 */

const RoutesDB = {
    /**
     * Array of route objects containing origin, destination, and distance in kilometers
     * Each route connects two Brazilian cities
     */
    routes: [
        // Southeast Region - Major Capital Routes
        { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", distanceKm: 430 },
        { origin: "São Paulo, SP", destination: "Belo Horizonte, MG", distanceKm: 586 },
        { origin: "Rio de Janeiro, RJ", destination: "Belo Horizonte, MG", distanceKm: 434 },
        { origin: "São Paulo, SP", destination: "Vitória, ES", distanceKm: 882 },
        { origin: "Rio de Janeiro, RJ", destination: "Vitória, ES", distanceKm: 521 },
        
        // Southeast Regional Routes
        { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKm: 95 },
        { origin: "São Paulo, SP", destination: "Santos, SP", distanceKm: 72 },
        { origin: "São Paulo, SP", destination: "Ribeirão Preto, SP", distanceKm: 313 },
        { origin: "São Paulo, SP", destination: "Sorocaba, SP", distanceKm: 87 },
        { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKm: 13 },
        { origin: "Rio de Janeiro, RJ", destination: "Petrópolis, RJ", distanceKm: 68 },
        { origin: "Belo Horizonte, MG", destination: "Ouro Preto, MG", distanceKm: 100 },
        { origin: "Belo Horizonte, MG", destination: "Uberlândia, MG", distanceKm: 543 },
        
        // Capital to Brasília Routes
        { origin: "São Paulo, SP", destination: "Brasília, DF", distanceKm: 1015 },
        { origin: "Rio de Janeiro, RJ", destination: "Brasília, DF", distanceKm: 1148 },
        { origin: "Belo Horizonte, MG", destination: "Brasília, DF", distanceKm: 716 },
        { origin: "Goiânia, GO", destination: "Brasília, DF", distanceKm: 209 },
        
        // South Region Routes
        { origin: "Curitiba, PR", destination: "Florianópolis, SC", distanceKm: 300 },
        { origin: "Curitiba, PR", destination: "Porto Alegre, RS", distanceKm: 711 },
        { origin: "Florianópolis, SC", destination: "Porto Alegre, RS", distanceKm: 476 },
        { origin: "São Paulo, SP", destination: "Curitiba, PR", distanceKm: 408 },
        { origin: "Curitiba, PR", destination: "Foz do Iguaçu, PR", distanceKm: 637 },
        { origin: "Porto Alegre, RS", destination: "Caxias do Sul, RS", distanceKm: 129 },
        
        // Northeast Region Routes
        { origin: "Salvador, BA", destination: "Recife, PE", distanceKm: 839 },
        { origin: "Salvador, BA", destination: "Fortaleza, CE", distanceKm: 1389 },
        { origin: "Recife, PE", destination: "Fortaleza, CE", distanceKm: 800 },
        { origin: "Recife, PE", destination: "Natal, RN", distanceKm: 286 },
        { origin: "Fortaleza, CE", destination: "Natal, RN", distanceKm: 537 },
        { origin: "Salvador, BA", destination: "Aracaju, SE", distanceKm: 356 },
        { origin: "Recife, PE", destination: "Maceió, AL", distanceKm: 285 },
        { origin: "Salvador, BA", destination: "São Luís, MA", distanceKm: 1597 },
        
        // Northeast to Southeast Routes
        { origin: "Salvador, BA", destination: "Belo Horizonte, MG", distanceKm: 1372 },
        { origin: "Salvador, BA", destination: "Rio de Janeiro, RJ", distanceKm: 1649 },
        { origin: "Salvador, BA", destination: "São Paulo, SP", distanceKm: 1962 },
        
        // North Region Routes
        { origin: "Brasília, DF", destination: "Palmas, TO", distanceKm: 973 },
        { origin: "Brasília, DF", destination: "Belém, PA", distanceKm: 2120 },
        { origin: "Belém, PA", destination: "Manaus, AM", distanceKm: 1294 },
        { origin: "Belém, PA", destination: "São Luís, MA", distanceKm: 806 },
        
        // Central-West Routes
        { origin: "Brasília, DF", destination: "Cuiabá, MT", distanceKm: 1133 },
        { origin: "Goiânia, GO", destination: "Cuiabá, MT", distanceKm: 934 },
        { origin: "Campo Grande, MS", destination: "Cuiabá, MT", distanceKm: 694 }
    ],

    /**
     * Get all unique cities from the routes database
     * @returns {Array<string>} Sorted array of unique city names
     */
    getAllCities: function() {
        // Create a Set to store unique city names
        const citiesSet = new Set();
        
        // Extract cities from both origin and destination
        this.routes.forEach(route => {
            citiesSet.add(route.origin);
            citiesSet.add(route.destination);
        });
        
        // Convert Set to Array and sort alphabetically
        return Array.from(citiesSet).sort();
    },

    /**
     * Find the distance between two cities
     * @param {string} origin - Origin city name
     * @param {string} destination - Destination city name
     * @returns {number|null} Distance in kilometers, or null if route not found
     */
    findDistance: function(origin, destination) {
        // Normalize input: trim whitespace and convert to lowercase
        const normalizedOrigin = origin.trim().toLowerCase();
        const normalizedDestination = destination.trim().toLowerCase();
        
        // Search for route in both directions
        const route = this.routes.find(r => {
            const routeOrigin = r.origin.toLowerCase();
            const routeDestination = r.destination.toLowerCase();
            
            // Check if route matches in either direction
            return (
                (routeOrigin === normalizedOrigin && routeDestination === normalizedDestination) ||
                (routeOrigin === normalizedDestination && routeDestination === normalizedOrigin)
            );
        });
        
        // Return distance if found, null otherwise
        return route ? route.distanceKm : null;
    }
};
