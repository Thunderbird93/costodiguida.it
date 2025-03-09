class MainHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <header>
            <nav class="nav-menu">
                <a href="#">
                    <img
                      id="hamburger-menu"
                      src="./src/assets/icons/hamburger_icon.svg"
                      alt="Hamburger menu" />
                </a>
            </nav>
        </header>
        `;
  }
}

customElements.define("main-header", MainHeader);
