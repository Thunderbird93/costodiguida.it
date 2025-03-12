class InputNumber extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.inputElement = this.querySelector("input");
    this.inputElement.addEventListener("keydown", this.filterKeys.bind(this));
    this.inputElement.addEventListener("input", this.updateStore.bind(this));
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener("input", this.updateStore.bind(this));
    this.inputElement.removeEventListener(
      "keydown",
      this.filterKeys.bind(this),
    );
  }

  static get observedAttributes() {
    return ["storepath", "icon", "detail", "min", "max", "step", "inputmode"];
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

  get inputmode() {
    return this.getAttribute("inputmode");
  }
  set inputmode(val) {
    return this.setAttribute("inputmode", val);
  }

  get min() {
    return this.getAttribute("min");
  }
  set min(val) {
    return this.setAttribute("min", val);
  }

  get max() {
    return this.getAttribute("max");
  }
  set max(val) {
    return this.setAttribute("max", val);
  }

  get step() {
    return this.getAttribute("step");
  }
  set step(val) {
    return this.setAttribute("step", val);
  }

  filterValueToNumber(val) {
    if (!val) return null;
    return +val;
  }

  updateStore({ target }) {
    if (window.app && window.app.store) {
      window.app.store[this.storepath] = this.filterValueToNumber(target.value);
    }
  }

  filterKeys(e) {
    if (
      ["KeyE", "Slash"].includes(e.code) ||
      (this.inputmode !== "decimal" && ["Comma", "Period"].includes(e.code))
    ) {
      e.preventDefault();
    }
  }

  setElement() {
    const min = this.min ? `min="${this.min}"` : "";
    const max = this.max ? `max="${this.max}"` : "";
    const step = this.step ? `step="${this.step}"` : "";
    const inputmode = this.inputmode ? this.inputmode : "numeric";
    const val = this.value ? `value="${this.value}"` : "";
    const input = `<input type="number" id="${this.storepath}"  inputmode="${inputmode}" ${min} ${max} ${step} ${val}>`;
    const img = `<img src="./src/assets/icons/${this.icon}.svg"  alt="" />`;
    const detail = this.detail ? `<p>${this.detail}</p>` : "";

    this.innerHTML = `
         <div class="input">
                ${input}
                <div class="left-box">
                  ${img}
                </div>
                <div class="right-box">
                  ${detail}
                </div>
        </div>
    `;
  }

  render() {
    this.setElement();
  }
}

customElements.define("input-number", InputNumber);
