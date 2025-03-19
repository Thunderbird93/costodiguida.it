class MainHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.headerTag = this.querySelector("header");
    this.toggleMenu = document.getElementById("toggleMenu");
    this.toggleMenu.addEventListener("click", this.doSomething.bind(this));
  }

  disconnectedCallback() {
    this.headerTag.removeEventListener("click", this.doSomething.bind(this));
  }

  doSomething(e) {
    console.log("e", e);
  }

  setElement() {
    this.innerHTML = `
      <header>
      <nav class="content-container">
        <a href="/" class="logo">
          <span class="font-accent">CONSULENZA</span>
          <br />NOLEGGIO AUTO
        </a>
        <ul role="list">
          <li>
            <button type="button" id="toggleMenu">
              <img src="/src/assets/icons/menu.svg" alt="menu" />
            </button>
          </li>
        </ul>
      </nav>
    </header>
    `;
  }

  render() {
    this.setElement();
  }
}

customElements.define("main-header", MainHeader);
