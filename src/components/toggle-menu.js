class ToggleMenu extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    await this.getNavMenu();
    this.setNavMenu();
  }

  async getNavMenu() {
    if (!app || !app.api || !app.store || app.store.navMenu != null) return;
    app.store.navMenu = await app.api.fetchNav();
  }

  setNavMenu() {
    const ul = document.createElement("ul");
    ul.role = "list";
    ul.classList = "navMenuList";

    const createLiAndAnchorElements = (href, content) => {
      const liEl = document.createElement("li");
      const aEl = document.createElement("a");
      aEl.href = href;
      aEl.innerText = content;
      if (location.pathname === href) {
        aEl.classList.add("underlineAnchorText");
      }
      liEl.appendChild(aEl);
      return liEl;
    };

    app.store.navMenu.menu.pagesList.forEach((page) => {
      const li = createLiAndAnchorElements(
        app.store.navMenu.menu.pages[page].href,
        page,
      );
      ul.appendChild(li);
    });

    const nav = document.createElement("nav");
    nav.id = "toggleMenu";
    nav.classList.add("content-container", "navMenuGrid");
    nav.appendChild(ul);

    this.appendChild(nav);
  }
}

customElements.define("toggle-menu", ToggleMenu);
