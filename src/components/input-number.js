import { num } from "../js/mocks/helpers.js";
class InputNumber extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.imgFeedback = "";
    this.textFeedback = "";
    this.render();
    this.inputElement = this.querySelector("input");
    this.feedbackEl = this.querySelector(".feedback-text");
    this.inputElement.addEventListener("keydown", this.filterKeys.bind(this));
    this.inputElement.addEventListener("input", this.updateStore.bind(this));
    if (
      app?.store &&
      this.storepath &&
      app.store[this.storepath] === null &&
      (this.storepath === "petrolPrice" ||
        this.storepath === "dieselPrice" ||
        this.storepath === "electricityPrice")
    ) {
      window.addEventListener(
        `${this.storepath}Change`,
        this.setNewValue.bind(this),
        { once: true },
      );
    }
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener("input", this.updateStore.bind(this));
    this.inputElement.removeEventListener(
      "keydown",
      this.filterKeys.bind(this),
    );
  }

  setNewValue() {
    const element = this.inputElement.getAttribute("value");
    if (!element) {
      this.inputElement.setAttribute("value", app.store[this.storepath]);
    }
  }

  static get observedAttributes() {
    return ["storepath", "icon", "detail", "min", "max", "step", "inputmode"];
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
    return Number(val);
  }

  updateStore({ target }) {
    if (!app || !app.store) return;
    app.store[this.storepath] = this.filterValueToNumber(target.value);
    this.checkParamsValidation();
  }

  checkParamsValidation() {
    if (this.min && app.store[this.storepath] < this.min) {
      this.textFeedback = `Digita un numero uguale o superiore a ${this.min}`;
      this.feedbackEl.textContent = this.textFeedback;
      return;
    }

    if (this.max && app.store[this.storepath] > this.max) {
      this.textFeedback = `Digita un numero uguale o inferiore a ${this.max}`;
      this.feedbackEl.textContent = this.textFeedback;
      return;
    }

    this.textFeedback = "";
    this.feedbackEl.textContent = "";
  }

  filterKeys(e) {
    if (
      ["KeyE", "KeyV", "Slash", "BracketRight"].includes(e.code) ||
      (["Comma", "Period"].includes(e.code) &&
        (!this.inputmode || this.inputmode !== "decimal"))
    ) {
      e.preventDefault();
    }
  }

  setElement() {
    const min = this.min ? `min="${this.min}"` : "";
    const max = this.max ? `max="${this.max}"` : "";
    const step = this.step ? `step="${this.step}"` : "";
    const inputmode = this.inputmode ? this.inputmode : "numeric";
    let val = "";
    if (app?.store && this.storepath && app.store[this.storepath] !== null) {
      val = `value="${app.store[this.storepath]}"`;
    }

    const input = `<input type="number" id="${this.storepath}"  inputmode="${inputmode}" ${min} ${max} ${step} ${val}>`;
    const img = `<img src="./src/assets/icons/${this.icon}.svg"  alt="" />`;

    this.innerHTML = `
         <div class="input-area" >
                ${input}
               <div class="left-box">
                  ${img}
              </div>
                <div class="right-box">
                  ${this.imgFeedback}
                </div>
        </div>
      <div class="feedback-text">
        ${this.textFeedback}
      </div>
    `;
  }

  render() {
    this.setElement();
  }
}

customElements.define("input-number", InputNumber);
