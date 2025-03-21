class ToggleMenu extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    if (
      window.app?.store &&
      window.app.api &&
      window.app.store.navMenu === null
    ) {
      const response = await window.app.api.fetchNav();
      if (response?.menu) {
        window.app.store.navMenu = response.menu;
      }
    }

    this.innerHTML = `
    <nav id="toggleMenu" class="content-container navMenuGrid">
        <ul role="list" class="navMenuList">
            <li>
                <a href="/" > Home </a>
            </li>
             <li>
                <a href="/" > Calcolatore </a>
            </li>
             <li>
                <a href="/" > Privacy </a>
            </li>
        </ul>
    </nav>
    `;
  }
}

customElements.define("toggle-menu", ToggleMenu);
