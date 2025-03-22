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

    this.handleObserver();
  }

  disconnectedCallback() {
    this.headerTag.removeEventListener(
      "click",
      this.changeAriaExpandedAttribute.bind(this),
    );
  }

  handleObserver() {
    const header = this.querySelector("header");
    const nav = this.querySelector("nav");

    if (!header || !nav) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const exists = nav.classList.contains("navDynamicStyle");
          if (exists) {
            nav.classList.remove("navDynamicStyle");
          }
        } else {
          nav.classList.add("navDynamicStyle");
        }
      },
      { root: null, threshold: 0 },
    );

    observer.observe(header);
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
        <a class="homeButton" href="/">
          <img class="menu" src="/src/assets/icons/garage.svg" alt="Vai alla homepage" />
        </a>
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
