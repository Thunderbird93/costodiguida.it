document.addEventListener("DOMContentLoaded", () => {
    let isMenuVisible = false;
    let costsToCalc = []; //costi da calcolare
    let mainFuel = null; //carburante scelto
    let distance = null; // km/anno
    let mainFuelEfficiency = null; // consumo

    //section seleziona i costi da calcolare
    const btnS1 = document.getElementById("btnS1");

    btnS1.addEventListener("click", setCostsToCalc);

    function setCostsToCalc() {
        costsToCalc = [];

        const checkboxes = ["cost-1", "cost-2", "cost-3", "cost-4"];

        checkboxes.forEach((id) => {
            const checkbox = document.getElementById(id);
            if (checkbox.checked) {
                const cost = +id.split("-")[1];
                costsToCalc.push(cost);
            }
        });
    }

    //section selezione carburanti
    const btnS2 = document.getElementById("btnS2");

    btnS2.addEventListener("click", checkSelection);

    function checkSelection() {
        const selectedPower = document.querySelector(
            'input[name="power"]:checked',
        );
        if (!selectedPower) return;
        mainFuel = +selectedPower.id.split("-")[1];

        setFuelEfficiencyLabel();
    }

    // km/anno
    const btnS3 = document.getElementById("btnS3");

    btnS3.addEventListener("click", checkDistance);

    function checkDistance() {
        distance = +document.getElementById("distance").value;
    }

    // kwh
    const btnS4 = document.getElementById("btnS4");

    btnS4.addEventListener("click", checkFuelEfficiency);

    function checkFuelEfficiency() {
        const fuelEficiency = document.getElementById("fuelEficiency");
        const selectedPower = document.querySelector(
            'input[name="fuelEficiencyChoice"]:checked',
        );

        if (mainFuel === 1 || selectedPower.id === "l100km") {
            mainFuelEfficiency = fuelEficiency.value;
        } else {
            mainFuelEfficiency = 100 / fuelEficiency.value;
        }
    }

    function setFuelEfficiencyLabel() {
        const fuelEficiencyInput = document.getElementById("fuelEficiency");

        function removeElementById(id) {
            const element = document.getElementById(id);
            if (element) element.remove();
        }

        if (mainFuel === 1) {
            removeElementById("fuelEficiencyChoice");

            if (!document.getElementById("testing")) {
                const label = document.createElement("label");
                label.setAttribute("for", "fuelEficiency");
                label.id = "testing";
                label.textContent = "kWh/100km";
                fuelEficiencyInput.insertAdjacentElement("afterend", label);
            }
        } else {
            removeElementById("testing");

            if (!document.getElementById("fuelEficiencyChoice")) {
                const mainDiv = document.createElement("div");
                mainDiv.id = "fuelEficiencyChoice";
                fuelEficiencyInput.insertAdjacentElement("afterend", mainDiv);

                const options = [
                    { id: "l100km", text: "L/100km" },
                    { id: "kml", text: "km/L" },
                ];

                options.forEach((option) => {
                    const input = document.createElement("input");
                    input.id = option.id;
                    input.type = "radio";
                    input.name = "fuelEficiencyChoice";
                    if (option.id === "l100km") {
                        input.checked = true;
                    }
                    const label = document.createElement("label");
                    label.setAttribute("for", option.id);
                    label.textContent = option.text;

                    mainDiv.appendChild(input);
                    mainDiv.appendChild(label);
                });
            }
        }
    }

    //menu
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
