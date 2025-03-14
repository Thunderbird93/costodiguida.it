class RadioButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();

    this.inputElements = this.querySelectorAll("input");

    this.inputElements.forEach((inputRadio) => {
      inputRadio.addEventListener("change", this.updateStore.bind(this));
    });
  }

  disconnectedCallback() {
    this.inputElements.forEach((el) => {
      el.removeEventListener("change", this.updateStore);
    });
  }

  static get observedAttributes() {
    return ["storepath", "values", "labels", "checked"];
  }

  get storepath() {
    return this.getAttribute("storepath");
  }
  set storepath(val) {
    return this.setAttribute("storepath", val);
  }

  get values() {
    return this.getAttribute("values");
  }
  set values(val) {
    return this.setAttribute("values", val);
  }

  get labels() {
    return this.getAttribute("labels");
  }
  set labels(val) {
    return this.setAttribute("labels", val);
  }

  get checked() {
    return this.getAttribute("checked");
  }
  set checked(val) {
    return this.setAttribute("checked", val);
  }

  updateStore(event) {
    if (window.app && window.app.store) {
      let val;
      if (event.target.value === "true" || event.target.value === "false") {
        val = event.target.value === "true";
      } else {
        val = event.target.value;
      }
      window.app.store[this.storepath] = val;
    }
  }

  setElement() {
    const values = this.values.split(".");
    const labels = this.labels.split(".");

    this.innerHTML = `
        <div class="radio-input">
            <label class="choice-1">
                <input type="radio" name="${this.storepath}" value="${
      values[0]
    }" ${this.checked && this.checked === values[0] ? 'checked="true"' : ""}/>
               <span>${labels[0]}</span>
            </label>
            <label class="choice-2">
                <input type="radio" name="${this.storepath}" value="${
      values[1]
    }" ${this.checked && this.checked === values[1] ? 'checked="true"' : ""} />
                <span>${labels[1]}</span>
            </label>
        </div>
    `;
  }

  render() {
    this.setElement();
  }
}

customElements.define("radio-button", RadioButton);
