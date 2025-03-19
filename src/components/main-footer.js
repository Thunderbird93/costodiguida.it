class MainFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <footer>
        <nav class="content-container">
        <div></div>
        <ul role="list">
          <li>
            <a href="/mission.html">Obiettivo del sito</a>
          </li>
          <li>
            <a href="/privacy.html">Privacy policy</a>
          </li>
        </ul>
      </nav>
        </footer>
    `;
  }
}

customElements.define("main-footer", MainFooter);
