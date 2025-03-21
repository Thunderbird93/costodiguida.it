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
    this.innerHTML = `
      <header>
      <nav class="content-container">
        <div></div>
        <ul role="list">
          <li>
            <button type="button" id="toggleMenuButton" aria-expanded="false">
              <img class="menu" src="/src/assets/icons/menu.svg" alt="menu" />
              <img class="close" src="/src/assets/icons/close.svg" alt="menu" />
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
