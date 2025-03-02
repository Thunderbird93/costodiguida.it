document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelectorAll("#hero");
  const toggleMenu = document.querySelectorAll("#hamburger-menu");

  const observer = new IntersectionObserver(
    ([entry]) => {
      const int = entry.isIntersecting ? 1 : 0;
      toggleMenu[0].style.filter = `invert(${int})`;
    },
    { root: null, threshold: 0.05 },
  );

  observer.observe(hero[0]);
});
