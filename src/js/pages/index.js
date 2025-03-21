import API from "../services/API.js";
window.app = {};
app.api = API;

(async () => {
  await import("../../components/index.js");
})();

document.addEventListener("DOMContentLoaded", () => {
  console.info("Page loaded.");
});
