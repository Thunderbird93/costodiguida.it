class FieldsMessageResults extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
          <div class="result">
                    <div class="left"></div>
                    <div class="right">
                      <p>Fantastico! Ora puoi procedere.</p>
                    </div>
            </div>
          `;
  }
}

customElements.define("fields-message-result", FieldsMessageResults);
