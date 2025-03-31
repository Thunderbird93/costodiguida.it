class MainHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.headerTag = this.querySelector("header");
    this.toggleMenuButton = document.getElementById("toggleMenuButton");
    this.toggleMenuButton.addEventListener(
      "click",
      this.changeAriaExpandedAttribute.bind(this),
    );
  }

  disconnectedCallback() {
    this.headerTag.removeEventListener(
      "click",
      this.changeAriaExpandedAttribute.bind(this),
    );
  }

  changeAriaExpandedAttribute() {
    let ariaExpanded = this.toggleMenuButton.getAttribute("aria-expanded");

    this.toggleMenuButton.setAttribute(
      "aria-expanded",
      ariaExpanded === "false" ? "true" : "false",
    );
  }

  setElement() {
    const goBackHome =
      "<a class='homeIcon' href='/'> <img src='/src/assets/icons/home.svg' alt='Torna alla homepage' />  </a>";
    const homepage = `
        <div>
          ${location.pathname === "/" ? "" : goBackHome}
        </div>
    `;
    this.innerHTML = `
      <header>
      <nav class="content-container">
        ${homepage}
        <ul role="list">
          <li>
            <button type="button" id="toggleMenuButton" aria-expanded="false">
              <img class="menu" src="/src/assets/icons/menu.svg" alt="Apri il menu" />
              <img class="close" src="/src/assets/icons/close.svg" alt="Chiudi il menu" />
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
