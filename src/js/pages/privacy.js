import Store from "../services/Store.js";
import API from "../services/API.js";

window.app = {};
app.store = Store;
app.api = API;

(async () => {
  await import("../../components/main-header.js");
  await import("../../components/toggle-menu.js");
})();

document.addEventListener("DOMContentLoaded", () => {
  console.info("Page loaded.");
});
