class InputNumber extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.inputElement = this.querySelector("input");

    this.boundUpdateStore = this.updateStore.bind(this);
    this.inputElement.addEventListener("input", this.boundUpdateStore);

    if (this.detail?.includes(this.storepath)) {
      const eventName = `${this.detail}change`;
      this.boundRender = this.render.bind(this);
      window.addEventListener(eventName, this.boundRender);
    }
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener("input", this.boundUpdateStore);
    if (this.detail?.includes(this.storepath) && this.boundRender) {
      const eventName = `${this.detail}change`;
      window.removeEventListener(eventName, this.boundRender);
    }
  }

  static get observedAttributes() {
    return ["storepath", "icon", "detail"];
  }

  // Getters and setters for attributes
  get value() {
    return this.getAttribute("value");
  }
  set value(val) {
    this.setAttribute("value", val);
  }

  get storepath() {
    return this.getAttribute("storepath");
  }
  set storepath(val) {
    this.setAttribute("storepath", val);
  }

  get icon() {
    return this.getAttribute("icon");
  }
  set icon(val) {
    this.setAttribute("icon", val);
  }

  get detail() {
    return this.getAttribute("detail");
  }
  set detail(val) {
    this.setAttribute("detail", val);
  }

  get inputmode() {
    return this.getAttribute("inputmode");
  }
  set inputmode(val) {
    this.setAttribute("inputmode", val);
  }

  filterValueToNumber(val) {
    return val ? +val : null;
  }

  updateStore(event) {
    if (window.app && window.app.store) {
      window.app.store[this.storepath] = this.filterValueToNumber(
        event.target.value,
      );
    }
  }

  setElement() {
    const inputmode = this.inputmode || "numeric";
    const val = this.value ? `value="${this.value}"` : "";
    const input = `<input id="${this.storepath}" inputmode="${inputmode}" type="text" ${val}>`;
    const img = `<img src="./src/assets/icons/${this.icon}.svg" alt="" />`;
    let detailText = "";
    if (window.app.store) {
      const { store } = window.app;
      detailText = store[this.detail] ?? this.detail;
    }

    this.innerHTML = `
      <div class="input">
        ${input}
        <div class="left-box">
          ${img}
        </div>
        <div class="right-box">
          <p>${detailText}</p>
        </div>
      </div>
    `;
  }

  render() {
    this.setElement();
  }
}

customElements.define("input-number", InputNumber);
