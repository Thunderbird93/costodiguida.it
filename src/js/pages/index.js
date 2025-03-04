document.addEventListener("DOMContentLoaded", () => {
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
