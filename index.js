document.addEventListener("DOMContentLoaded", () => {
    console.info("DOM loaded.");
    const entity = {
        distance: {
            year: null,
        },
        finance: {
            lifetime: {
                months: null,
            },
            payment: {
                monthly: null,
                upfront: null,
            },
        },
        fuel: {
            efficiency: {
                value: null,
                unit: null,
            },
            type: null,
            unit: null,
        },
        power: {
            unit: null,
            value: null,
        },
    };

    const checkKeydownData = (e, int) => {
        const keyValue = parseInt(e.key);
        if (e.target.value.trim() === "0" && !isNaN(keyValue)) {
            e.target.value = "";
        }

        const allowedKeys = new Set(
            int
                ? ["Backspace", "ArrowLeft", "ArrowRight", "Tab"]
                : ["Backspace", "ArrowLeft", "ArrowRight", "Tab", ".", ","],
        );

        if ((isNaN(e.key) && !allowedKeys.has(e.key)) || e.code === "Space") {
            e.preventDefault();
        }

        if ((e.key === "." || e.key === ",") && e.target.value.includes(".")) {
            e.preventDefault();
        }
    };

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

    const efficiency = document.getElementById("efficiency");
    if (efficiency) {
        efficiency.addEventListener("keydown", (event) => {
            checkKeydownData(event, false);
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
            entity.fuel.efficiency.value = input;
        });

        const initialValue = parseFloat(
            parseFloat(efficiency.value).toFixed(1),
        );

        if (isNaN(initialValue)) {
            return;
        }
        entity.fuel.efficiency.value = initialValue;
    }

    const efficiencyUnits = document.querySelectorAll(
        'input[name="fuelEfficiency"]',
    );
    if (efficiencyUnits) {
        for (const type of efficiencyUnits) {
            type.addEventListener("change", () => {
                if (type.checked) {
                    entity.fuel.efficiency.unit = type.value;
                }
            });

            if (type.checked) {
                entity.fuel.efficiency.unit = type.value;
            }
        }
    }

    //Power units
    const powerUnits = document.querySelectorAll('input[name="powerUnit"]');
    for (const unit of powerUnits) {
        unit.addEventListener("change", () => {
            if (unit.checked) {
                entity.power.unit = unit.value;
            }
        });
        if (unit.checked) {
            entity.power.unit = unit.value;
        }
    }

    const setupInputListeners = (elementId, entityPropertyPath) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.addEventListener("keydown", (event) =>
            checkKeydownData(event, true),
        );
        element.addEventListener("input", ({ target }) => {
            target.value = target.value.replace(",", ".");
        });
        element.addEventListener("change", ({ target }) => {
            let input = parseInt(target.value);
            if (isNaN(input)) input = 0;
            target.value = input;

            setNestedProperty(entity, entityPropertyPath, input);
        });

        let initialValue = parseInt(element.value);
        if (!isNaN(initialValue)) {
            setNestedProperty(entity, entityPropertyPath, initialValue);
        }
    };

    const setNestedProperty = (obj, path, value) => {
        const keys = path.split(".");
        let current = obj;
        while (keys.length > 1) {
            const key = keys.shift();
            if (!current[key]) current[key] = {};
            current = current[key];
        }
        current[keys[0]] = value;
    };

    setupInputListeners("distance", "distance.year");
    setupInputListeners("power", "power.value");
    setupInputListeners("upfront", "finance.payment.upfront");
    setupInputListeners("monthly", "finance.payment.monthly");
    setupInputListeners("lifetime", "finance.lifetime.months");
});
