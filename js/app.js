document.addEventListener("DOMContentLoaded", () => {
    let isMenuVisible = false;
    let mainFuel = null;

    const btnS1 = document.getElementById("btnS1");

    btnS1.addEventListener("click", checkSelection);

    function checkSelection() {
        const selectedPower = document.querySelector(
            'input[name="power"]:checked',
        );
        if (!selectedPower) return;
        mainFuel = selectedPower.value;
    }

    const menu = document.getElementById("menu");
    menu.addEventListener("click", () => {
        isMenuVisible = !isMenuVisible;

        if (isMenuVisible) {
            menu.textContent = "X";
            menu.style.color = "var(--font-light)";
            const div = document.createElement("div");
            div.id = "menuOverlay";

            const subMenu = document.createElement("div");
            subMenu.id = "subMenuOverlay";
            div.appendChild(subMenu);

            const navLinks = [
                "Percorso guidato",
                "Percorso sintetico",
                "Missione",
                "Contatti",
            ];

            navLinks.forEach((el) => {
                const subDiv = document.createElement("div");
                subDiv.className = "menuLink";
                subDiv.textContent = el;
                subMenu.appendChild(subDiv);
            });

            document.body.appendChild(div);
        } else {
            menu.textContent = "=";
            menu.style.color = "var(--font-dark)";
            const div = document.getElementById("menuOverlay");
            document.body.removeChild(div);
        }
    });
});
