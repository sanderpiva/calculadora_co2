/**
 * Calculator Object
 * Contains methods for calculating CO2 emissions, comparisons,
 * savings, and carbon credit estimates
 */

const Calculator = {
    /**
     * Calculate CO2 emission for a specific distance and transport mode
     * @param {number} distanceKm - Distance in kilometers
     * @param {string} transportMode - Transport mode key (bicycle, car, bus, truck)
     * @returns {number} CO2 emission in kg, rounded to 2 decimal places
     */
    calculateEmission: function(distanceKm, transportMode) {
        // Get the emission factor for the specified transport mode
        const emissionFactor = CONFIG.EMISSION_FACTORS[transportMode];
        
        // Calculate total emission: distance * emission factor
        const emission = distanceKm * emissionFactor;
        
        // Return result rounded to 2 decimal places
        return Math.round(emission * 100) / 100;
    },

    /**
     * Calculate emissions for all transport modes and compare to car
     * @param {number} distanceKm - Distance in kilometers
     * @returns {Array} Array of objects with mode, emission, and percentage vs car, sorted by emission
     */
    calculateAllModes: function(distanceKm) {
        // Array to store calculation results
        const results = [];
        
        // Calculate car emission as baseline for percentage comparison
        const carEmission = this.calculateEmission(distanceKm, 'car');
        
        // Calculate emissions for each transport mode
        for (const mode in CONFIG.EMISSION_FACTORS) {
            // Calculate emission for this mode
            const emission = this.calculateEmission(distanceKm, mode);
            
            // Calculate percentage compared to car
            // Avoid division by zero - if car emission is 0, percentage is 0
            const percentageVsCar = carEmission > 0 
                ? Math.round((emission / carEmission) * 100 * 100) / 100
                : 0;
            
            // Add result object to array
            results.push({
                mode: mode,
                emission: emission,
                percentageVsCar: percentageVsCar
            });
        }
        
        // Sort array by emission (lowest first)
        results.sort((a, b) => a.emission - b.emission);
        
        return results;
    },

    /**
     * Calculate CO2 savings compared to a baseline emission
     * @param {number} emission - Current emission in kg
     * @param {number} baselineEmission - Baseline emission in kg (e.g., car)
     * @returns {object} Object with savedKg and percentage
     */
    calculateSavings: function(emission, baselineEmission) {
        // Calculate saved CO2 in kg
        const savedKg = baselineEmission - emission;
        
        // Calculate percentage saved
        // Avoid division by zero - if baseline is 0, percentage is 0
        const percentage = baselineEmission > 0
            ? (savedKg / baselineEmission) * 100
            : 0;
        
        // Return object with values rounded to 2 decimal places
        return {
            savedKg: Math.round(savedKg * 100) / 100,
            percentage: Math.round(percentage * 100) / 100
        };
    },

    /**
     * Calculate carbon credits needed to offset the emission
     * @param {number} emissionKg - CO2 emission in kg
     * @returns {number} Number of carbon credits, rounded to 4 decimal places
     */
    calculateCarbonCredits: function(emissionKg) {
        // Calculate credits: emission / kg per credit
        const credits = emissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;
        
        // Return rounded to 4 decimal places
        return Math.round(credits * 10000) / 10000;
    },

    /**
     * Convert a distance from kilometers to meters
     * @param {number} distanceKm - Distance in kilometers
     * @returns {number} Distance in meters
     */
    convertKmToMeters: function(distanceKm) {
        return distanceKm * 1000;
    },

    /**
     * Estimate price range for carbon credits in BRL
     * @param {number} credits - Number of carbon credits
     * @returns {object} Object with min, max, and average prices in BRL
     */
    estimateCreditPrice: function(credits) {
        // Calculate minimum price
        const min = credits * CONFIG.CARBON_CREDIT.PRICE_MIN_BRL;
        
        // Calculate maximum price
        const max = credits * CONFIG.CARBON_CREDIT.PRICE_MAX_BRL;
        
        // Calculate average price
        const average = (min + max) / 2;
        
        // Return object with prices rounded to 2 decimal places
        return {
            min: Math.round(min * 100) / 100,
            max: Math.round(max * 100) / 100,
            average: Math.round(average * 100) / 100
        };
    }
};
