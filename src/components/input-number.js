class InputNumber extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.inputElement = this.querySelector("input");
    this.inputElement.addEventListener("input", this.updateStore.bind(this));
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener("input", this.updateStore.bind(this));
  }

  static get observedAttributes() {
    return ["storepath", "icon", "detail"];
  }

  get value() {
    return this.getAttribute("value");
  }
  set value(val) {
    return this.setAttribute("value", val);
  }

  get storepath() {
    return this.getAttribute("storepath");
  }
  set storepath(val) {
    return this.setAttribute("storepath", val);
  }

  get icon() {
    return this.getAttribute("icon");
  }
  set icon(val) {
    return this.setAttribute("icon", val);
  }
  get detail() {
    return this.getAttribute("detail");
  }
  set detail(val) {
    return this.setAttribute("detail", val);
  }

  filterValueToNumber(val) {
    if (!val) return null;
    return +val;
  }

  updateStore(event) {
    if (window.app && window.app.store) {
      window.app.store[this.storepath] = this.filterValueToNumber(
        event.target.value,
      );
    }
  }

  setElement() {
    const val = this.value ? `value="${this.value}"` : "";
    const input = `<input id="${this.storepath}" inputmode="numeric" type="text" ${val}>`;
    const img = `<img src="./src/assets/icons/${this.icon}.svg"  alt="" />`;
    this.innerHTML = `
         <div class="input">
                ${input}
                <div class="left-box">
                  ${img}
                </div>
                <div class="right-box">
                  <p>${this.detail ? this.detail : ""}</p>
                </div>
        </div>
    `;
  }

  render() {
    this.setElement();
  }
}

customElements.define("input-number", InputNumber);
