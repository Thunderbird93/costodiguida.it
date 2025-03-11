class FieldsRentResult extends HTMLElement {
  constructor() {
    super();
    this.handleDataChange = this.handleDataChange.bind(this);
    window.addEventListener("financeDataChange", this.handleDataChange);
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener("financeDataChange", this.handleDataChange);
  }

  handleDataChange() {
    this.render();
  }

  calcRent() {
    if (window.app && window.app.store) {
      const store = window.app.store;

      if (
        store.upfront !== null &&
        store.monthly !== null &&
        store.months !== null
      ) {
        const deferredUpfrontPayment = +Number.parseFloat(
          (store.upfront / store.months) * 12,
        ).toFixed(2);
        console.log("deferredUpfrontPayment", deferredUpfrontPayment);

        const yearlyRent = store.monthly * 12;
        const fullYearly = yearlyRent + deferredUpfrontPayment;
        store.rentCost = Number.parseFloat(fullYearly).toFixed(2);
        const monthly = store.rentCost / 12;
        store.rentMonthlyCost = Number.parseFloat(monthly).toFixed(2);

        return store.rentCost;
      }
    }
    return 0;
  }

  render() {
    const annualCost = this.calcRent();
    this.innerHTML = `
        <div class="result">
          <div class="left">
            Costo annuo (considerando l'anticipo)
          </div>
          <div class="right">
            €${annualCost}
          </div>
        </div>
      `;
  }
}

customElements.define("fields-rent-result", FieldsRentResult);
