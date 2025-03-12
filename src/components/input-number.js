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

  get inputmode() {
    return this.getAttribute("inputmode");
  }
  set inputmode(val) {
    return this.setAttribute("inputmode", val);
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
    if (["KeyE", "Slash"].includes(e.code)) {
      e.preventDefault();
    }

    if (this.inputmode !== "decimal" && ["Comma", "Period"].includes(e.code)) {
      e.preventDefault();
    }
  }

  setElement() {
    const inputmode = this.inputmode ? this.inputmode : "numeric";
    const val = this.value ? `value="${this.value}"` : "";
    const input = `<input id="${this.storepath}"  inputmode="${inputmode}" type="number"  ${val}>`;
    const img = `<img src="./src/assets/icons/${this.icon}.svg"  alt="" />`;
    const detail = this.detail ? this.detail : "";

    this.innerHTML = `
         <div class="input">
                ${input}
                <div class="left-box">
                  ${img}
                </div>
                <div class="right-box">
                  <p>${detail}</p>
                </div>
        </div>
    `;
  }

  render() {
    this.setElement();
  }
}

customElements.define("input-number", InputNumber);
