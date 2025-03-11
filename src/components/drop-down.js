class DropDown extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <select></select>
    `;
    this.selectElement = this.querySelector("select");
  }

  static get observedAttributes() {
    return ["storepath"];
  }

  get storepath() {
    return this.getAttribute("storepath");
  }
  set storepath(val) {
    return this.setAttribute("storepath", val);
  }

  async connectedCallback() {
    const initOption = document.createElement("option");
    initOption.textContent = "- Seleziona -";
    initOption.value = "";
    this.selectElement.appendChild(initOption);

    const result = await app.api.fetchRegions();
    result.list.forEach((item) => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      this.selectElement.appendChild(option);
    });

    this.selectElement.addEventListener("change", (e) => {
      window.app.store[this.storepath] = e.target.value;
    });
  }
}

customElements.define("drop-down", DropDown);
