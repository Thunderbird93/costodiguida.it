class ToggleMenu extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    // const ul = await this.setNavMenu();
    // this.innerHTML = `
    // <nav id="toggleMenu" class="content-container navMenuGrid">
    //     ${ul}
    // </nav>
    // `;
    this.innerHTML = `
    <nav id="toggleMenu" class="content-container navMenuGrid">
        <ul role="list" class="navMenuList">
            <li>
            <a href="/"> Home </a>
        </li>
        <li>
            <a href="/calculator.html"> Calcolatore </a>
        </li>
        <li>
            <a href="/privacy.html"> Privacy policy </a>
        </li>
            </nav>
        </ul>
    `;
  }

  //   async setNavMenu() {
  //     let nav = null;

  //     const ul = document.createElement("ul");
  //     ul.role = "list";
  //     ul.classList = "navMenuList";

  //     const createLiAndAnchorElements = (href, content) => {
  //       const liEl = document.createElement("li");
  //       const aEl = document.createElement("a");
  //       aEl.href = href;
  //       aEl.innerText = content;
  //       liEl.appendChild(aEl);
  //       return liEl;
  //     };

  //     const defaultMenu = createLiAndAnchorElements("/", "Home");

  //     if (app && app.store && (app.store.navMenu != null || app.api)) {
  //       if (app.store.navMenu != null) {
  //         nav = app.store.navMenu;
  //       } else if (app.api) {
  //         const response = await app.api.fetchNav();
  //         if (response?.menu) {
  //           app.store.navMenu = response.menu;
  //           nav = app.store.navMenu;
  //         } else {
  //           ul.appendChild(defaultMenu);
  //         }
  //       }
  //     } else {
  //       ul.appendChild(defaultMenu);
  //     }

  //     console.log("ul", ul);

  //     return ul;
  //   }
}

customElements.define("toggle-menu", ToggleMenu);
