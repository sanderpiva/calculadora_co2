/**
 * Main Application File
 * Handles initialization and form submission for the CO2 calculator
 */

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // INITIALIZATION
    // ========================================
    
    // Populate city autocomplete datalist with available cities
    CONFIG.populateDatalist();
    
    // Set up automatic distance calculation based on selected cities
    CONFIG.setupDistanceAutofill();

    // Get the calculator form element
    const calculatorForm = document.getElementById('calculator-form');
    
    // Add submit event listener to the form
    calculatorForm.addEventListener('submit', handleFormSubmit);
    
    console.log('✅ Calculadora inicializada!');
    
    
    // ========================================
    // FORM SUBMIT HANDLER
    // ========================================
    
    /**
     * Handle form submission and calculate emissions
     * @param {Event} event - Form submit event
     */
    function handleFormSubmit(event) {
        // Prevent default form submission behavior
        event.preventDefault();
        
        // ========================================
        // GET FORM VALUES
        // ========================================
        
        // Get origin city value (trimmed)
        const origin = document.getElementById('origin').value.trim();
        
        // Get destination city value (trimmed)
        const destination = document.getElementById('destination').value.trim();
        
        // Get distance value and parse as float
        const distance = parseFloat(document.getElementById('distance').value);
        
        // Get selected transport mode from radio buttons
        const transportMode = document.querySelector('input[name="transport"]:checked').value;
        
        
        // ========================================
        // VALIDATE INPUTS
        // ========================================
        
        // Check if all required fields are filled
        if (!origin || !destination) {
            alert('⚠️ Por favor, preencha a origem e o destino.');
            return;
        }
        
        if (!distance || isNaN(distance)) {
            alert('⚠️ Por favor, preencha a distância da viagem.');
            return;
        }
        
        if (distance <= 0) {
            alert('⚠️ A distância deve ser maior que zero.');
            return;
        }
        
        
        // ========================================
        // SHOW LOADING STATE
        // ========================================
        
        // Get submit button element
        const submitButton = calculatorForm.querySelector('button[type="submit"]');
        
        // Show loading spinner on button
        UI.showLoading(submitButton);
        
        // Hide any previous results
        UI.hideElement('results');
        UI.hideElement('comparison');
        UI.hideElement('carbon-credits');
        
        
        // ========================================
        // SIMULATE PROCESSING WITH DELAY
        // ========================================
        
        // Use setTimeout to simulate processing time (1.5 seconds)
        setTimeout(function() {
            
            try {
                // ========================================
                // CALCULATE EMISSIONS
                // ========================================
                
                // Calculate emission for selected transport mode
                const emission = Calculator.calculateEmission(distance, transportMode);
                
                // Calculate car emission as baseline for comparison
                const carEmission = Calculator.calculateEmission(distance, 'car');
                
                // Calculate savings compared to car (if not using car)
                let savings = null;
                if (transportMode !== 'car') {
                    savings = Calculator.calculateSavings(emission, carEmission);
                }
                
                // Calculate emissions for all transport modes
                const allModesComparison = Calculator.calculateAllModes(distance);
                
                // Calculate carbon credits needed to offset emission
                const credits = Calculator.calculateCarbonCredits(emission);
                
                // Estimate price for carbon credits
                const creditPrice = Calculator.estimateCreditPrice(credits);
                
                
                // ========================================
                // BUILD DATA OBJECTS FOR RENDERING
                // ========================================
                
                // Main results data
                const resultsData = {
                    origin: origin,
                    destination: destination,
                    distance: distance,
                    emission: emission,
                    mode: transportMode,
                    savings: savings
                };
                
                // Carbon credits data
                const creditsData = {
                    credits: credits,
                    price: creditPrice
                };
                
                
                // ========================================
                // RENDER RESULTS
                // ========================================
                
                // Render main results section
                const resultsHTML = UI.renderResults(resultsData);
                document.getElementById('results-content').innerHTML = resultsHTML;
                UI.showElement('results');
                
                // Render comparison section
                const comparisonHTML = UI.renderComparison(allModesComparison, transportMode);
                document.getElementById('comparison-content').innerHTML = comparisonHTML;
                UI.showElement('comparison');
                
                // Render carbon credits section
                const creditsHTML = UI.renderCarbonCredits(creditsData);
                document.getElementById('carbon-credits-content').innerHTML = creditsHTML;
                UI.showElement('carbon-credits');
                
                
                // ========================================
                // FINALIZE
                // ========================================
                
                // Hide loading state from button
                UI.hideLoading(submitButton);
                
                // Scroll to results section smoothly
                UI.scrollToElement('results');
                
            } catch (error) {
                // ========================================
                // ERROR HANDLING
                // ========================================
                
                // Log error to console for debugging
                console.error('❌ Erro ao calcular emissões:', error);
                
                // Show user-friendly error message
                alert('❌ Ocorreu um erro ao calcular as emissões. Por favor, tente novamente.');
                
                // Hide loading state from button
                UI.hideLoading(submitButton);
            }
            
        }, 1500); // 1.5 second delay
        
    }
});
