const observer = new IntersectionObserver(
  ([entry]) => {
    toggleMenuButton.style.display = entry.isIntersecting ? "block" : "none";
  },
  { root: null, threshold: 0.05 },
);
