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

  handleListeners(action) {
    if (!this.calc) return;

    const eventMap = {
      rent: ["financeDataChange"],
      fuel: ["fuelDataChange", "engineTypeChange"],
      tax: ["taxDataChange", "engineTypeChange"],
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
    let html = "";
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
      const total = `<p>€ ${annualCost}</p>`;

      let details = "";
      if (this.calc === "tax") {
        details = `
        <div class="details">
          <div class="detail" ><p>Bollo*</p><p>€ ${app.store.bollo}</p></div>
          <div class="detail" ><p>Superbollo</p><p>€ ${app.store.superbollo}</p></div>
          <br/>
          <div class="detail"><p>*per il calcolo del bollo consultare le fonti di ciascuna regione. Il calcolo del bollo è indicativo e senza valore legale.</p></div>
        </div>
        `;
      }

      html = `
         <div class="result">
            <div class="left">
                <p>Costo annuo</p>
            </div>
            <div class="right">
                ${total}
            </div>
        </div>
        ${details}
      `;
    } else {
      return;
    }
    this.innerHTML = html;
  }
}

customElements.define("fields-footer", FieldsFooter);
