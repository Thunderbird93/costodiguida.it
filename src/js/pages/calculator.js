import Store from "../services/Store.js";
import API from "../services/API.js";
import Router from "../services/Router.js";

window.app = {};
app.store = Store;
app.router = Router;

document.addEventListener("DOMContentLoaded", async () => {
  const $$ = (args) => document.querySelectorAll(args);
  HTMLElement.prototype.$$ = (s) => this.querySelectorAll(s);

  const hero = $$("#hero");
  const toggleMenu = $$("#hamburger-menu");

  const observer = new IntersectionObserver(
    ([entry]) => {
      const int = entry.isIntersecting ? 1 : 0;
      toggleMenu[0].style.filter = `invert(${int})`;
    },
    { root: null, threshold: 0.05 },
  );

  observer.observe(hero[0]);
});
