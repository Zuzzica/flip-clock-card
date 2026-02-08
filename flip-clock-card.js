class FlipClockCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._interval = null;
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');

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
    if (!this._interval) this.startClock();
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
    if (this._interval) clearInterval(this._interval);
    this._interval = setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const now = new Date();
    const hours = this.config.hour_format === '12'
      ? now.getHours() % 12 || 12
      : now.getHours();

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

    if (this.config.show_date) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const dateStr = now.toLocaleDateString(this._hass?.language || 'ro-RO', options);
      const dateElement = this.shadowRoot.querySelector('.date-display');
      if (dateElement) dateElement.textContent = dateStr;
    }
  }

  /* =========================
     🔧 FIX FLIP LOGIC
     ========================= */
  updateFlipDigit(id, newValue) {
    const element = this.shadowRoot.getElementById(id);
    if (!element) return;

    const currentValue = parseInt(element.dataset.value);
    if (currentValue === newValue) return;

    const topHalf = element.querySelector('.flip-card-top .digit');
    const bottomHalf = element.querySelector('.flip-card-bottom .digit');
    const flipTop = element.querySelector('.flip-card-flip-top .digit');
    const flipBottom = element.querySelector('.flip-card-flip-bottom .digit');

    // 🔹 STAREA INIȚIALĂ
    topHalf.textContent = newValue;          // sus = cifra nouă
    bottomHalf.textContent = currentValue;  // jos = cifra veche

    flipTop.textContent = currentValue;     // cade cifra veche
    flipBottom.textContent = newValue;      // urcă cifra nouă

    element.classList.remove('flip');
    void element.offsetWidth;
    element.classList.add('flip');

    // 🔹 DUPĂ animație
    setTimeout(() => {
      bottomHalf.textContent = newValue;
      element.dataset.value = newValue;

      flipTop.textContent = '';
      flipBottom.textContent = '';
      element.classList.remove('flip');
    }, this.config.animation_speed * 1000);
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
          background: ${isDark
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'};
          border-radius: 16px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          box-shadow: ${isDark
            ? '0 10px 40px rgba(0,0,0,0.4)'
            : '0 10px 40px rgba(0,0,0,0.1)'};
        }

        .clock-wrapper {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .time-group {
          display: flex;
          gap: 6px;
        }

        .separator {
          font-size: ${this.config.separator_size}px;
          font-weight: 700;
          color: ${isDark ? '#e94560' : '#0f3460'};
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%,49% { opacity: 1 }
          50%,100% { opacity: 0.3 }
        }

        .flip-card {
          position: relative;
          width: ${this.config.card_width}px;
          height: ${this.config.card_height}px;
          font-size: ${this.config.font_size}px;
          font-weight: 700;
          perspective: 1000px;
        }

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
          background: ${isDark ? '#2a2a3e' : '#fff'};
          color: ${isDark ? '#fff' : '#2a2a3e'};
          overflow: hidden;
          backface-visibility: hidden;
          border-radius: 6px;
        }

        .flip-card-top,
        .flip-card-flip-top {
          top: 0;
          height: 50%;
          transform-origin: bottom;
        }

        .flip-card-bottom,
        .flip-card-flip-bottom {
          bottom: 0;
          height: 50%;
          transform-origin: top;
        }

        .flip-card.flip .flip-card-flip-top {
          animation: flipTop ${this.config.animation_speed / 2}s ease-in forwards;
        }

        .flip-card.flip .flip-card-flip-bottom {
          animation: flipBottom ${this.config.animation_speed / 2}s ease-out
            ${this.config.animation_speed / 2}s forwards;
        }

        @keyframes flipTop {
          from { transform: rotateX(0deg); }
          to   { transform: rotateX(-90deg); }
        }

        @keyframes flipBottom {
          from { transform: rotateX(90deg); }
          to   { transform: rotateX(0deg); }
        }

        .date-display {
          font-size: 18px;
          color: ${isDark ? '#a8b2d1' : '#4a5568'};
          text-transform: capitalize;
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
            </div>` : ''}
        </div>
      </div>
    `;
  }

  createFlipCard(id, value) {
    return `
      <div id="${id}" class="flip-card" data-value="${value}">
        <div class="flip-card-top"><span class="digit">${value}</span></div>
        <div class="flip-card-bottom"><span class="digit">${value}</span></div>
        <div class="flip-card-flip-top"><span class="digit">${value}</span></div>
        <div class="flip-card-flip-bottom"><span class="digit">${value}</span></div>
      </div>`;
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
      animation_speed: 0.8
    };
  }
}

customElements.define('flip-clock-card', FlipClockCard);
