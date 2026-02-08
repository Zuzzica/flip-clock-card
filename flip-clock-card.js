class FlipClockCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._interval = null;
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this.config = {
      show_seconds: config.show_seconds !== false,
      show_date: config.show_date !== false,
      hour_format: config.hour_format || '24',
      theme: config.theme || 'dark',
      animation_speed: config.animation_speed || 0.8,
      card_width: config.card_width || 40,
      card_height: config.card_height || 80,
      font_size: config.font_size || 72,
      separator_size: config.separator_size || 10,
      ...config
    };
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._interval) {
      this.startClock();
    }
  }

  connectedCallback() {
    this.startClock();
  }

  disconnectedCallback() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  startClock() {
    this.updateTime();
    if (this._interval) {
      clearInterval(this._interval);
    }
    this._interval = setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const now = new Date();
    const hours24 = now.getHours();
    const isPM = hours24 >= 12;
    const hours = this.config.hour_format === '12'
      ? hours24 % 12 || 12
      : hours24;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    this.updateFlipDigit('hours-tens', Math.floor(hours / 10));
    this.updateFlipDigit('hours-ones', hours % 10);
    this.updateFlipDigit('minutes-tens', Math.floor(minutes / 10));
    this.updateFlipDigit('minutes-ones', minutes % 10);

    if (this.config.show_seconds) {
      this.updateFlipDigit('seconds-tens', Math.floor(seconds / 10));
      this.updateFlipDigit('seconds-ones', seconds % 10);
    }

    // Actualizăm AM/PM
    if (this.config.hour_format === '12') {
      const amPmElement = this.shadowRoot.querySelector('.am-pm');
      if (amPmElement) {
        amPmElement.textContent = isPM ? 'PM' : 'AM';
      }
    }

    if (this.config.show_date) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const dateStr = now.toLocaleDateString(this._hass?.language || 'ro-RO', options);
      const dateElement = this.shadowRoot.querySelector('.date-display');
      if (dateElement) {
        dateElement.textContent = dateStr;
      }
    }
  }

  updateFlipDigit(id, newValue) {
    const element = this.shadowRoot.getElementById(id);
    if (!element) return;
    
    const currentValue = parseInt(element.dataset.value);
    if (currentValue === newValue) return;

    // Elementele principale
    const topHalf = element.querySelector('.flip-card-top .digit');
    const bottomHalf = element.querySelector('.flip-card-bottom .digit');
    
    // Elementele de animație
    const flipTop = element.querySelector('.flip-card-flip-top .digit');
    const flipBottom = element.querySelector('.flip-card-flip-bottom .digit');

    // ETAPELE CORECTE:
    
    // 1. Elementele principale RĂMÂN cu cifra VECHE în timpul animației
    // (topHalf și bottomHalf păstrează currentValue)
    
    // 2. Setăm elementele de ANIMAȚIE
    flipTop.textContent = currentValue;  // Cifra VECHE care cade
    flipBottom.textContent = newValue;   // Cifra NOUĂ care se ridică

    // 3. Eliminăm și adăugăm clasa pentru a reseta animația
    element.classList.remove('flip');
    void element.offsetWidth;
    element.classList.add('flip');
    
    // 4. După PRIMA jumătate a animației, actualizăm partea de SUS
    setTimeout(() => {
      topHalf.textContent = newValue;
    }, (this.config.animation_speed / 2) * 1000);
    
    // 5. După animație COMPLETĂ, actualizăm partea de JOS și resetăm
    setTimeout(() => {
      element.dataset.value = newValue;
      bottomHalf.textContent = newValue;
      flipTop.textContent = '';
      flipBottom.textContent = '';
      element.classList.remove('flip');
    }, this.config.animation_speed * 1000 + 50);
  }

  render() {
    const isDark = this.config.theme === 'dark';
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 24px;
          box-sizing: border-box;
        }

        .flip-clock-container {
          background: ${isDark ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'};
          border-radius: 16px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          box-shadow: ${isDark ? '0 10px 40px rgba(0,0,0,0.4)' : '0 10px 40px rgba(0,0,0,0.1)'};
        }

        .clock-wrapper {
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
        }

        .time-group {
          display: flex;
          gap: 6px;
        }

        .separator {
          font-size: ${this.config.separator_size}px;
          font-weight: 700;
          color: ${isDark ? '#e94560' : '#0f3460'};
          display: flex;
          align-items: center;
          animation: blink 1s infinite;
          font-family: 'Arial', sans-serif;
          margin: 0 4px;
        }

        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.3; }
        }

        .flip-card {
          position: relative;
          width: ${this.config.card_width}px;
          height: ${this.config.card_height}px;
          font-size: ${this.config.font_size}px;
          font-weight: 700;
          font-family: 'Arial', sans-serif;
          perspective: 1000px;
          flex-shrink: 0;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }

        /* Jumătățile cardului - stilul mecanic autentic */
        .flip-card-top,
        .flip-card-bottom,
        .flip-card-flip-top,
        .flip-card-flip-bottom {
          position: absolute;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${isDark ? '#2a2a3e' : '#ffffff'};
          color: ${isDark ? '#ffffff' : '#2a2a3e'};
          overflow: hidden;
          backface-visibility: hidden;
          border-radius: 6px;
        }

        /* Cifra în sine - va fi poziționată pentru a arăta partea corectă */
        .digit {
          position: absolute;
          width: 100%;
          height: ${this.config.card_height}px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${this.config.font_size}px;
          font-weight: 700;
          font-family: 'Arial', sans-serif;
        }

        /* Jumătatea de SUS - arată partea de SUS a cifrei */
        .flip-card-top {
          top: 0;
          height: 50%;
          border-bottom: 2px solid ${isDark ? '#1a1a2e' : '#cccccc'};
          box-shadow: ${isDark ? 
            'inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)' : 
            'inset 0 -2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)'};
        }

        .flip-card-top .digit {
          top: 0;
        }

        /* Jumătatea de JOS - arată partea de JOS a cifrei */
        .flip-card-bottom {
          bottom: 0;
          height: 50%;
          border-top: 2px solid ${isDark ? '#1a1a2e' : '#cccccc'};
          box-shadow: ${isDark ? 
            'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)' : 
            'inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)'};
        }

        .flip-card-bottom .digit {
          top: -${this.config.card_height / 2}px;
        }

        /* Animația flip - jumătatea de sus */
        .flip-card-flip-top {
          top: 0;
          height: 50%;
          border-bottom: 2px solid ${isDark ? '#1a1a2e' : '#cccccc'};
          box-shadow: ${isDark ? 
            'inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)' : 
            'inset 0 -2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)'};
          transform-origin: bottom;
          z-index: 2;
          opacity: 0;
        }

        .flip-card-flip-top .digit {
          top: 0;
        }

        /* Animația flip - jumătatea de jos */
        .flip-card-flip-bottom {
          bottom: 0;
          height: 50%;
          border-top: 2px solid ${isDark ? '#1a1a2e' : '#cccccc'};
          box-shadow: ${isDark ? 
            'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)' : 
            'inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)'};
          transform-origin: top;
          z-index: 1;
          opacity: 0;
        }

        .flip-card-flip-bottom .digit {
          top: -${this.config.card_height / 2}px;
        }

        .flip-card.flip .flip-card-flip-top {
          animation: flipTop ${this.config.animation_speed / 2}s ease-in forwards;
        }

        .flip-card.flip .flip-card-flip-bottom {
          animation: flipBottom ${this.config.animation_speed / 2}s ease-out ${this.config.animation_speed / 2}s forwards;
        }

        @keyframes flipTop {
          0% {
            opacity: 1;
            transform: rotateX(0deg);
          }
          100% {
            opacity: 1;
            transform: rotateX(-90deg);
          }
        }

        @keyframes flipBottom {
          0% {
            opacity: 1;
            transform: rotateX(90deg);
          }
          100% {
            opacity: 1;
            transform: rotateX(0deg);
          }
        }

        .date-display {
          font-size: 18px;
          font-weight: 500;
          color: ${isDark ? '#a8b2d1' : '#4a5568'};
          text-align: center;
          letter-spacing: 0.5px;
          text-transform: capitalize;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .am-pm {
          font-size: 24px;
          font-weight: 600;
          color: ${isDark ? '#e94560' : '#0f3460'};
          margin-left: 8px;
          font-family: 'Arial', sans-serif;
        }
      </style>

      <div class="flip-clock-container">
        ${this.config.show_date ? '<div class="date-display"></div>' : ''}
        
        <div class="clock-wrapper">
          <div class="time-group">
            ${this.createFlipCard('hours-tens', 0)}
            ${this.createFlipCard('hours-ones', 0)}
          </div>
          
          <div class="separator">:</div>
          
          <div class="time-group">
            ${this.createFlipCard('minutes-tens', 0)}
            ${this.createFlipCard('minutes-ones', 0)}
          </div>
          
          ${this.config.show_seconds ? `
            <div class="separator">:</div>
            <div class="time-group">
              ${this.createFlipCard('seconds-tens', 0)}
              ${this.createFlipCard('seconds-ones', 0)}
            </div>
          ` : ''}
          
          ${this.config.hour_format === '12' ? '<div class="am-pm">AM</div>' : ''}
        </div>
      </div>
    `;
  }

  createFlipCard(id, initialValue) {
    return `<div id="${id}" class="flip-card" data-value="${initialValue}">
      <div class="flip-card-inner">
        <div class="flip-card-top">
          <span class="digit">${initialValue}</span>
        </div>
        <div class="flip-card-bottom">
          <span class="digit">${initialValue}</span>
        </div>
        <div class="flip-card-flip-top">
          <span class="digit">${initialValue}</span>
        </div>
        <div class="flip-card-flip-bottom">
          <span class="digit">${initialValue}</span>
        </div>
      </div>
    </div>`;
  }

  getCardSize() {
    return 3;
  }

  static getConfigElement() {
    return document.createElement('flip-clock-card-editor');
  }

  static getStubConfig() {
    return {
      show_seconds: true,
      show_date: true,
      hour_format: '24',
      theme: 'dark',
      animation_speed: 0.8,
      card_width: 40,
      card_height: 80,
      font_size: 72,
      separator_size: 10
    };
  }
}

customElements.define('flip-clock-card', FlipClockCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'flip-clock-card',
  name: 'Flip Clock Card',
  description: 'A beautiful animated flip clock card for Home Assistant',
  preview: true,
  documentationURL: 'https://github.com/your-username/flip-clock-card'
});

console.info(
  '%c FLIP-CLOCK-CARD %c v2.0.1 ',
  'color: white; background: #e94560; font-weight: 700;',
  'color: #e94560; background: white; font-weight: 700;'
);
