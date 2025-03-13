class MainHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setNavList();
    this.render();
    this.setObserver();
    this.headerTag = this.querySelector("header");
    this.toggleMenu = document.getElementById("toggle-menu");
    this.toggleMenu.addEventListener("click", this.updateTag.bind(this));
  }

  disconnectedCallback() {
    this.headerTag.removeEventListener("click", this.updateTag.bind(this));
  }

  updateTag() {
    //ID
    const hasID = this.headerTag.getAttribute("id");
    if (!hasID) {
      this.headerTag.setAttribute("id", "header");
      this.setNavMenu();
    } else {
      this.removeNavMenu();
      this.headerTag.removeAttribute("id");
    }

    //icon
    const img = document.getElementById("toggle-menu");
    const newSRC = this.setIcon(img.src);
    img.src = newSRC;
    img.setAttribute("src", newSRC);
  }

  setIcon(src) {
    const icons = {
      burger: "hamburger_icon",
      close: "close",
    };
    let newSRC;
    if (src.includes(icons.burger)) {
      newSRC = src.replace(icons.burger, icons.close);
      this.observer.disconnect();
      this.toggleMenu.style.filter = "brightness(0) invert(1)";
    } else {
      newSRC = src.replace(icons.close, icons.burger);
      this.observer.observe(this.hero);
    }
    return newSRC;
  }

  setObserver() {
    this.hero = document.getElementById("hero");

    this.observer = new IntersectionObserver(
      ([entry]) => {
        const int = entry.isIntersecting ? 1 : 0;
        this.toggleMenu.style.filter = `invert(${int})`;
      },
      { root: null, threshold: 0.05 },
    );
    this.observer.observe(this.hero);
  }

  async setNavList() {
    if (window.app?.api) {
      window.app.navigationList = await window.app.api.fetchNav();
    }
  }

  setNavMenu() {
    if (!window.app.navigationList) return "<div>Hello</div>";

    //parent div
    const div = document.createElement("div");
    div.classList = "main-open-nav-content";

    //nav
    const nav = document.createElement("nav");
    nav.classList = "nav-menu-list";
    const ul = document.createElement("ul");
    ul.role = "list";
    const currentPage = window.location.pathname;

    for (let i = 0; i < window.app.navigationList.menu.pagesList.length; i++) {
      const page = window.app.navigationList.menu.pagesList[i];
      const li = document.createElement("li");
      const a = document.createElement("a");
      const href = window.app.navigationList.menu.pages[page].href;
      a.href = href;
      a.innerText = page;
      if (currentPage === href) {
        a.classList = "currentPage";
      }
      li.appendChild(a);
      ul.appendChild(li);
    }
    nav.appendChild(ul);

    //contact
    const divChild = document.createElement("div");
    divChild.classList = "contact-info";
    const emailContact = document.createElement("a");
    emailContact.href = "mailto:antircristian@gmail.com";
    emailContact.innerText = "antircristian@gmail.com";
    divChild.appendChild(emailContact);

    div.appendChild(nav);
    div.appendChild(divChild);

    const playground = document.querySelector(".header-playground");
    playground.appendChild(div);
  }

  removeNavMenu() {
    const nav = document.querySelector(".main-open-nav-content");
    if (nav) {
      nav.remove();
    }
  }

  setElement() {
    const img = `
      <img
        id="toggle-menu"
        src="./src/assets/icons/hamburger_icon.svg"
        alt="Toggle menu"
      />
    `;

    this.innerHTML = `
      <header>
          <div class="header-playground">
            <nav class="nav-menu">
              <a href="#">
                ${img}
              </a>
            </nav>
          </div>
      </header>
    `;
  }

  render() {
    this.setElement();
  }
}

customElements.define("main-header", MainHeader);
