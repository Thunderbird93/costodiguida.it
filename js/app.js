document.addEventListener("DOMContentLoaded", () => {
    let isMenuVisible = false;

    let entity = {
        costsToCalc: [], //costi da calcolare
        mainFuel: null, //carburante scelto
        distance: null, // km/anno
        mainFuelEfficiency: null, // consumo
        enginePower: null, //potenza motore
        upfrontPayment: null, //anticipo
        monthly: null, //pagamento mensile
        months: null, //mesi
        services: [], //servizi inclusi
    };

    //section seleziona i costi da calcolare
    const servicesToCalc = document.getElementById("servicesToCalc");

    servicesToCalc.addEventListener("click", setCostsToCalc);

    function setCostsToCalc() {
        entity.costsToCalc = [];

        const checkboxes = ["cost-1", "cost-2", "cost-3", "cost-4"];

        checkboxes.forEach((id) => {
            const checkbox = document.getElementById(id);
            if (checkbox.checked) {
                const cost = +id.split("-")[1];
                entity.costsToCalc.push(cost);
            }
        });

        console.log("entity", entity);
        console.table(entity);
    }

    //section selezione carburanti
    const btnS2 = document.getElementById("btnS2");

    btnS2.addEventListener("click", checkSelection);

    function checkSelection() {
        const selectedPower = document.querySelector(
            'input[name="power"]:checked',
        );
        if (!selectedPower) return;
        entity.mainFuel = +selectedPower.id.split("-")[1];

        setFuelEfficiencyLabel();
        console.log("entity", entity);
        console.table(entity);
    }

    // km/anno
    const btnS3 = document.getElementById("btnS3");

    btnS3.addEventListener("click", checkDistance);

    function checkDistance() {
        entity.distance = +document.getElementById("distance").value;
        console.log("entity", entity);
        console.table(entity);
    }

    // kwh
    const btnS4 = document.getElementById("btnS4");

    btnS4.addEventListener("click", checkFuelEfficiency);

    function checkFuelEfficiency() {
        const fuelEficiency = document.getElementById("fuelEficiency");
        const selectedPower = document.querySelector(
            'input[name="fuelEficiencyChoice"]:checked',
        );

        if (entity.mainFuel === 1 || selectedPower.id === "l100km") {
            entity.mainFuelEfficiency = +fuelEficiency.value;
        } else {
            entity.mainFuelEfficiency = 100 / fuelEficiency.value;
        }

        console.log("entity", entity);
        console.table(entity);
    }

    //car power
    const btnS5 = document.getElementById("btnS5");

    btnS5.addEventListener("click", checkCarPower);

    function checkCarPower() {
        const enginePower = +document.getElementById("enginePower").value;

        const selectedEnginePower = document.querySelector(
            'input[name="enginePower"]:checked',
        );
        const converter = 0.7355;
        entity.enginePower =
            selectedEnginePower.id === "kw"
                ? enginePower
                : enginePower * converter;

        console.log("entity", entity);
        console.table(entity);
    }

    // VFG
    const btnS6 = document.getElementById("btnS6");
    btnS6.addEventListener("click", checkFinance);

    function checkFinance() {
        const upfrontPayment = +document.getElementById("upfrontPayment").value;
        const monthly = +document.getElementById("monthly").value;
        const months = +document.getElementById("months").value;

        entity.upfrontPayment = upfrontPayment;
        entity.monthly = monthly;
        entity.months = months;

        console.log("entity", entity);
        console.table(entity);
    }

    // Servizi
    const btnS7 = document.getElementById("btnS7");
    btnS7.addEventListener("click", setServices);

    function setServices() {
        entity.services = [];

        const checkboxes = [
            "service-1",
            "service-2",
            "service-3",
            "service-4",
            "service-5",
        ];

        checkboxes.forEach((id) => {
            const checkbox = document.getElementById(id);
            if (checkbox.checked) {
                const cost = +id.split("-")[1];
                entity.services.push(cost);
            }
        });

        console.log("entity", entity);
        console.table(entity);
    }
    //
    //

    function setFuelEfficiencyLabel() {
        const fuelEficiencyInput = document.getElementById("fuelEficiency");

        function removeElementById(id) {
            const element = document.getElementById(id);
            if (element) element.remove();
        }

        if (entity.mainFuel === 1) {
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

            if (document.getElementById("fuelEficiencyChoice")) return;

            const mainDiv = document.createElement("div");
            mainDiv.id = "fuelEficiencyChoice";
            fuelEficiencyInput.insertAdjacentElement("afterend", mainDiv);

            const options = [
                { id: 1, text: "L/100km" },
                { id: 2, text: "km/L" },
            ];

            options.forEach((option) => {
                const input = document.createElement("input");
                input.id = option.id;
                input.type = "radio";
                input.name = "fuelEficiencyChoice";
                if (option.id === 1) {
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

    //menu
    const menu = document.getElementById("menu");
    if (!menu) return;
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
