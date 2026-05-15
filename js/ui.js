/**
 * UI Object
 * Contains utility methods and rendering functions for displaying
 * calculation results, comparisons, and carbon credit information
 */

const UI = {
    /**
     * Format a number with specified decimal places and thousand separators
     * @param {number} number - Number to format
     * @param {number} decimals - Number of decimal places
     * @returns {string} Formatted number string
     */
    formatNumber: function(number, decimals = 2) {
        return number.toLocaleString('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    /**
     * Format a value as Brazilian currency (R$)
     * @param {number} value - Value to format
     * @returns {string} Formatted currency string
     */
    formatCurrency: function(value) {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    },

    /**
     * Show a hidden element by removing the 'hidden' class
     * @param {string} elementId - ID of the element to show
     */
    showElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('hidden');
        }
    },

    /**
     * Hide an element by adding the 'hidden' class
     * @param {string} elementId - ID of the element to hide
     */
    hideElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('hidden');
        }
    },

    /**
     * Scroll to an element with smooth animation
     * @param {string} elementId - ID of the element to scroll to
     */
    scrollToElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    /**
     * Render the main results section with emission calculation
     * @param {object} data - Object containing origin, destination, distance, emission, mode, savings
     * @returns {string} HTML string for results display
     */
    renderResults: function(data) {
        // Get transport mode metadata
        const modeInfo = CONFIG.TRANSPORT_MODES[data.mode];
        
        // Build HTML string with result cards
        let html = `
            <h2 class="section-title">📈 Resultado da Análise</h2>
            
            <div class="results__grid">
                <!-- Route Card -->
                <div class="results__card">
                    <div class="results__card-icon">🗺️🧭➡️</div>
                    <div class="results__card-label">Rota</div>
                    <div class="results__card-value">${data.origin} → ${data.destination}</div>
                </div>
                
                <!-- Distance Card -->
                <div class="results__card">
                    <div class="results__card-icon">📏↔️</div>
                    <div class="results__card-label">Distância</div>
                    <div class="results__card-value">${this.formatNumber(data.distance, 0)} km</div>
                    <div class="results__card-subtitle">${this.formatNumber(Calculator.convertKmToMeters(data.distance), 0)} metros</div>
                </div>
                
                <!-- Emission Card -->
                <div class="results__card results__card--highlight">
                    <div class="results__card-icon">🌿</div>
                    <div class="results__card-label">Emissão de CO₂</div>
                    <div class="results__card-value">${this.formatNumber(data.emission)} kg</div>
                </div>
                
                <!-- Transport Mode Card -->
                <div class="results__card">
                    <div class="results__card-icon">${modeInfo.icon}</div>
                    <div class="results__card-label">Meio de Transporte</div>
                    <div class="results__card-value">${modeInfo.label}</div>
                </div>
        `;
        
        // Add savings card if mode is not car and savings data exists
        if (data.mode !== 'car' && data.savings) {
            html += `
                <!-- Savings Card -->
                <div class="results__card results__card--success">
                    <div class="results__card-icon">💚</div>
                    <div class="results__card-label">Economia vs Carro</div>
                    <div class="results__card-value">${this.formatNumber(data.savings.savedKg)} kg</div>
                    <div class="results__card-subtitle">${this.formatNumber(data.savings.percentage, 1)}% menos emissão</div>
                </div>
            `;
        }
        
        html += `</div>`;
        
        return html;
    },

    /**
     * Render comparison of all transport modes
     * @param {Array} modesArray - Array of mode objects from Calculator.calculateAllModes()
     * @param {string} selectedMode - Currently selected transport mode
     * @returns {string} HTML string for comparison display
     */
    renderComparison: function(modesArray, selectedMode) {
        // Find the maximum emission for progress bar scaling
        const maxEmission = Math.max(...modesArray.map(m => m.emission));
        
        let html = `
            <h2 class="section-title">⚖️ Comparação entre Transportes</h2>
            <div class="comparison__container">
        `;
        
        // Create comparison item for each transport mode
        modesArray.forEach(modeData => {
            const modeInfo = CONFIG.TRANSPORT_MODES[modeData.mode];
            const isSelected = modeData.mode === selectedMode;
            
            // Calculate progress bar width as percentage of max emission
            const barWidth = maxEmission > 0 ? (modeData.emission / maxEmission) * 100 : 0;
            
            // Determine color based on percentage vs car
            let barColor;
            if (modeData.percentageVsCar <= 25) {
                barColor = '#10b981'; // Green
            } else if (modeData.percentageVsCar <= 75) {
                barColor = '#f59e0b'; // Yellow
            } else if (modeData.percentageVsCar <= 100) {
                barColor = '#fb923c'; // Orange
            } else {
                barColor = '#ef4444'; // Red
            }
            
            html += `
                <div class="comparison__item ${isSelected ? 'comparison__item--selected' : ''}">
                    <div class="comparison__header">
                        <div class="comparison__mode">
                            <span class="comparison__icon">${modeInfo.icon}</span>
                            <span class="comparison__label">${modeInfo.label}</span>
                        </div>
                        ${isSelected ? '<span class="comparison__badge">Selecionado</span>' : ''}
                    </div>
                    
                    <div class="comparison__stats">
                        <div class="comparison__stat">
                            <span class="comparison__stat-label">Emissão</span>
                            <span class="comparison__stat-value">${this.formatNumber(modeData.emission)} kg CO₂</span>
                        </div>
                        <div class="comparison__stat">
                            <span class="comparison__stat-label">vs Carro</span>
                            <span class="comparison__stat-value">${this.formatNumber(modeData.percentageVsCar, 0)}%</span>
                        </div>
                    </div>
                    
                    <div class="comparison__bar-container">
                        <div class="comparison__bar" style="width: ${barWidth}%; background-color: ${barColor};"></div>
                    </div>
                </div>
            `;
        });
        
        html += `
            </div>
            
            <div class="comparison__tip">
                <strong>💡 Dica:</strong> Optar por transportes com menor emissão de CO₂ ajuda a reduzir 
                seu impacto ambiental e contribui para um planeta mais sustentável!
            </div>
        `;
        
        return html;
    },

    /**
     * Render carbon credits information and offsetting options
     * @param {object} creditsData - Object with credits and price information
     * @returns {string} HTML string for carbon credits display
     */
    renderCarbonCredits: function(creditsData) {
        const html = `
            <h2 class="section-title">🌲 Compensação de Carbono</h2>
            
            <div class="carbon-credits__grid">
                <!-- Credits Needed Card -->
                <div class="carbon-credits__card">
                    <div class="carbon-credits__card-header">
                        <span class="carbon-credits__icon">📝📟</span>
                        <h3 class="carbon-credits__card-title">Créditos Necessários</h3>
                    </div>
                    <div class="carbon-credits__card-body">
                        <div class="carbon-credits__value">${this.formatNumber(creditsData.credits, 4)}</div>
                        <div class="carbon-credits__helper">1 crédito = 1.000 kg CO₂</div>
                    </div>
                </div>
                
                <!-- Price Estimate Card -->
                <div class="carbon-credits__card">
                    <div class="carbon-credits__card-header">
                        <span class="carbon-credits__icon">💰💳</span>
                        <h3 class="carbon-credits__card-title">Valor Estimado</h3>
                    </div>
                    <div class="carbon-credits__card-body">
                        <div class="carbon-credits__value">${this.formatCurrency(creditsData.price.average)}</div>
                        <div class="carbon-credits__helper">
                            Faixa: ${this.formatCurrency(creditsData.price.min)} - ${this.formatCurrency(creditsData.price.max)}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Information Box -->
            <div class="carbon-credits__info">
                <h4 class="carbon-credits__info-title">ℹ️ O que são Créditos de Carbono?</h4>
                <p class="carbon-credits__info-text">
                    Créditos de carbono são certificados que representam a redução de uma tonelada (1.000 kg) 
                    de CO₂ da atmosfera. Ao comprar créditos, você apoia projetos ambientais que compensam 
                    suas emissões, como reflorestamento e energia renovável.
                </p>
            </div>
            
            <!-- Action Button -->
            <div class="carbon-credits__action">
                <button class="carbon-credits__button" type="button">
                    🛒 Compensar Emissões
                </button>
                <p class="carbon-credits__disclaimer">
                    * Este é um projeto demonstrativo. O botão não realiza transações reais.
                </p>
            </div>
        `;
        
        return html;
    },

    /**
     * Show loading state on a button
     * @param {HTMLElement} buttonElement - Button element to show loading on
     */
    showLoading: function(buttonElement) {
        // Save original button text
        buttonElement.dataset.originalText = buttonElement.innerHTML;
        
        // Disable button and show spinner
        buttonElement.disabled = true;
        buttonElement.innerHTML = '<span class="spinner"></span> Calculando...';
    },

    /**
     * Hide loading state and restore button
     * @param {HTMLElement} buttonElement - Button element to restore
     */
    hideLoading: function(buttonElement) {
        // Enable button and restore original text
        buttonElement.disabled = false;
        buttonElement.innerHTML = buttonElement.dataset.originalText || 'Calcular Emissão';
        
    }
    
};
