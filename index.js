document.addEventListener("DOMContentLoaded", () => {
    console.info("DOM loaded.");
    const entity = {
        distance: {
            year: null,
        },
        fuel: {
            type: null,
            efficiency: null,
            efficiencyUnit: null,
            unit: null,
        },
    };

    const checkKeydownData = (e) => {
        const keyValue = parseInt(e.key);
        if (e.target.value.trim() === "0" && !isNaN(keyValue)) {
            e.target.value = "";
        }

        const allowedKeys = new Set([
            "Backspace",
            ".",
            ",",
            "ArrowLeft",
            "ArrowRight",
            "Tab",
        ]);

        if ((isNaN(e.key) && !allowedKeys.has(e.key)) || e.code === "Space") {
            e.preventDefault();
        }

        if ((e.key === "." || e.key === ",") && e.target.value.includes(".")) {
            e.preventDefault();
        }
    };

    //Distance
    const distance = document.getElementById("distance");
    if (distance) {
        distance.addEventListener("keydown", (event) => {
            checkKeydownData(event);
        });

        distance.addEventListener("input", ({ target }) => {
            target.value = target.value.replace(",", ".");
        });

        distance.addEventListener("change", ({ target }) => {
            let input = parseInt(target.value);
            if (isNaN(input)) {
                input = 0;
            }

            target.value = input;
            entity.distance.year = input;
        });

        let initialValue = parseInt(distance.value);
        if (isNaN(initialValue)) {
            return;
        }
        entity.distance.year = initialValue;
    }

    //Fuel units
    const fuels = document.querySelectorAll('input[name="fuelType"]');
    const fuelUnits = document.querySelectorAll(".fuelUnit");

    const setFuelUnit = () => {
        if (entity.fuel.type === "electric") {
            entity.fuel.unit = "kWh";
        } else {
            entity.fuel.unit = "L";
        }
    };

    const handleFuelUnits = (fuel) => {
        entity.fuel.type = fuel.value;
        setFuelUnit();
        for (const el of fuelUnits) {
            el.innerText = entity.fuel.unit;
        }
    };

    for (const fuel of fuels) {
        fuel.addEventListener("change", () => {
            handleFuelUnits(fuel);
        });

        if (fuel.checked) {
            handleFuelUnits(fuel);
        }
    }

    //Efficiency
    const efficiency = document.getElementById("efficiency");
    if (efficiency) {
        efficiency.addEventListener("keydown", (event) => {
            checkKeydownData(event);
        });

        efficiency.addEventListener("input", ({ target }) => {
            target.value = target.value.replace(",", ".");
        });

        efficiency.addEventListener("change", ({ target }) => {
            const input = parseFloat(parseFloat(target.value).toFixed(1));
            if (isNaN(input)) {
                input = 0;
            }

            target.value = input;
            entity.fuel.efficiency = input;
            console.log("input", input);
        });

        const initialValue = parseFloat(
            parseFloat(efficiency.value).toFixed(1),
        );

        if (isNaN(initialValue)) {
            return;
        }
        entity.fuel.efficiency = initialValue;
    }

    const efficiencyUnits = document.querySelectorAll(
        'input[name="fuelEfficiency"]',
    );
    if (efficiencyUnits) {
        for (const type of efficiencyUnits) {
            type.addEventListener("change", () => {
                if (type.checked) {
                    entity.fuel.efficiencyUnit = type.value;
                }
            });

            if (type.checked) {
                entity.fuel.efficiencyUnit = type.value;
            }
        }
    }

    console.log("entity:", entity);
});
