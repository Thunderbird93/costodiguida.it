import { calcTaxes } from "../js/mocks/calcTaxes.js";
import { calcFuel } from "../js/mocks/calcFuel.js";
import { calcRent } from "../js/mocks/calcRent.js";

class FieldsFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleListeners("add");
    if (this.calc === "fuel") {
      this.getFuelsPrices();
    }
  }

  disconnectedCallback() {
    this.handleListeners("remove");
  }

  static get observeAttributes() {
    return ["calc"];
  }

  get calc() {
    return this.getAttribute("calc");
  }
  set calc(val) {
    return this.setAttribute("calc", val);
  }

  get message() {
    return this.getAttribute("message");
  }
  set message(val) {
    return this.setAttribute("message", val);
  }

  num(val) {
    return +Number.parseFloat(val).toFixed(2);
  }

  async getFuelsPrices() {
    if (window.app?.api && window.app?.store) {
      const prices = await window.app.api.fetchFuelPrices();
      window.app.store.petrolPrice = prices.petrol.price;
      window.app.store.dieselPrice = prices.diesel.price;
      window.app.store.electricityPrice = prices.electricity.price;
    }
  }

  handleListeners(action) {
    if (!this.calc) return;

    const eventMap = {
      rent: ["financeDataChange"],
      fuel: ["fuelDataChange", "carTypeChange"],
      tax: ["taxDataChange"],
    };

    const events = eventMap[this.calc] || [];

    for (let i = 0; i < events.length; i++) {
      window[`${action}EventListener`](events[i], this.handleDataChange);
    }
  }

  handleDataChange() {
    this.render();
  }

  async render() {
    let html;
    if (
      this.calc &&
      (this.calc === "rent" || this.calc === "fuel" || this.calc === "tax")
    ) {
      let annualCost = 0;
      if (this.calc === "rent") {
        annualCost = calcRent();
      } else if (this.calc === "fuel") {
        annualCost = calcFuel();
      } else if (this.calc === "tax") {
        annualCost = await calcTaxes();
      }
      html = `
         <div class="result">
            <div class="left">
                <p>Costo annuo</p>
            </div>
            <div class="right">
                <p>€ ${annualCost}</p>
            </div>
        </div>
      `;
    } else if (this.message) {
      html = `
        <div class="result">
            <div class="left"></div>
            <div class="right">
                <p>${this.message}</p>
            </div>
        </div>
      `;
    } else {
      html = `
        <div class="result">
            <div class="left"></div>
            <div class="right"></div>
        </div>
          `;
    }
    this.innerHTML = html;
  }
}

customElements.define("fields-footer", FieldsFooter);
