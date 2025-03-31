class MainFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <footer>
        <nav class="content-container">
        <div></div>
        <ul role="list">
          <li>
            <a href="/privacy">Privacy policy</a>
          </li>
        </ul>
      </nav>
        </footer>
    `;
  }
}

customElements.define("main-footer", MainFooter);
