import fuelPrices from "./fuelPrices.js";
import regionsTax from "./regionsTax.js";
document.addEventListener("DOMContentLoaded", () => {
    const car = {
        distance: null,
        efficiency: null,
        fuelEfficiencyType: null,
        fuelType: null,
        fuelTypeUnit: null,
        ownerResidency: null,
        enginePower: null,
        upfront: null,
        monthly: null,
        months: null,
        costs: {
            yearlyFuelConsumption: null,
            bollo: null,
            superbollo: null,
            yearlyFinancial: null,
        },
    };

    //Fuel consumption
    const calcFuelConsumption = () => {
        if (
            car.distance == null ||
            car.efficiency == null ||
            car.fuelEfficiencyType == null
        ) {
            return;
        }
        const eff =
            car.fuelEfficiencyType === "unitPer100km"
                ? car.efficiency
                : 100 / car.efficiency;
        const units = car.distance / eff;
        car.costs.yearlyFuelConsumption = units * fuelPrices[car.fuelType];

        console.log(
            "car.costs.yearlyFuelConsumption",
            car.costs.yearlyFuelConsumption,
        );
    };

    const distance = document.getElementById("distance");
    if (distance) {
        const checkAndAssignValue = () => {
            const value = parseInt(distance.value);
            car.distance = !value || isNaN(value) ? 0 : value;
            distance.value = car.distance;
            calcFuelConsumption();
        };

        distance.addEventListener("input", () => {
            checkAndAssignValue();
        });

        if (car.distance == null) {
            checkAndAssignValue();
        }
    }

    const fuelTypes = document.querySelectorAll('input[name="fuelType"]');
    const fuelUnitElements = document.querySelectorAll(".fuelUnit");

    if (fuelTypes) {
        for (const type of fuelTypes) {
            const stateChange = () => {
                if (car.fuelType === type.value) return;
                car.fuelType = type.value;
                car.fuelTypeUnit = car.fuelType === "electric" ? "kWh" : "L";
                for (const el of fuelUnitElements) {
                    el.innerText = car.fuelTypeUnit;
                    document.getElementById("unitPer100km").checked = true;
                }
                calcFuelConsumption();
            };

            type.addEventListener("click", () => {
                stateChange();
            });

            if (car.fuelType === null && type.checked) {
                stateChange();
            }
        }
    }

    const efficiency = document.getElementById("efficiency");
    if (efficiency) {
        const checkAndAssignValue = () => {
            //da fixare, se cancello e riscrivo mi si bugga
            const value = parseFloat(efficiency.value).toFixed(2);
            car.efficiency = !value || isNaN(value) ? 0.1 : value;
            efficiency.value = !value || isNaN(value) ? 0.1 : efficiency.value;
            calcFuelConsumption();
        };

        efficiency.addEventListener("input", () => {
            checkAndAssignValue();
        });

        if (car.efficiency == null) {
            checkAndAssignValue();
        }
    }

    const fuelEfficiencyOptions = document.querySelectorAll(
        'input[name="fuelEfficiency"]',
    );
    if (fuelEfficiencyOptions) {
        for (const type of fuelEfficiencyOptions) {
            const assignFuelEfficiencyType = () => {
                if (type.checked) {
                    car.fuelEfficiencyType = type.value;
                    calcFuelConsumption();
                }
            };
            type.addEventListener("change", () => {
                assignFuelEfficiencyType();
            });

            if (car.fuelEfficiencyType == null) {
                assignFuelEfficiencyType();
            }
        }
    }

    const calcBollo = () => {
        if (car.enginePower > 100) {
            const min = 100 * regionsTax[car.ownerResidency][0];
            const surplus =
                (car.enginePower - 100) * regionsTax[car.ownerResidency][1];
            car.costs.bollo = min + surplus;
        } else {
            car.costs.bollo =
                car.enginePower * regionsTax[car.ownerResidency][0];
        }
    };

    const calcSuperbollo = () => {
        if (car.enginePower > 185) {
            car.costs.superbollo = (car.enginePower - 185) * 20;
        } else {
            car.costs.superbollo = 0;
        }
    };

    const calcFinancial = () => {
        const upfrontSplitMonthly = car.upfront / car.months;
        const monthlyCost = upfrontSplitMonthly + car.monthly;
        car.costs.yearlyFinancial = monthlyCost * 12;
    };

    const action = document.getElementById("action");

    action.addEventListener("click", () => {
        // car.fuelType = document.querySelector(
        //     'input[name="fuelType"]:checked',
        // ).value;
        // const region = document.getElementById("regions-select");
        // car.ownerResidency = region.value;
        // function parseAndAssignValue(id) {
        //     const element = document.getElementById(id);
        //     const value = parseInt(element.value);
        //     car[id] = isNaN(value) ? 0 : value;
        //     element.value = car[id];
        // }
        // parseAndAssignValue("distance");
        // parseAndAssignValue("efficiency");
        // parseAndAssignValue("enginePower");
        // parseAndAssignValue("upfront");
        // parseAndAssignValue("monthly");
        // parseAndAssignValue("months");
        // calcFuelConsumption();
        // calcBollo();
        // calcSuperbollo();
        // calcFinancial();
        // console.log("car.costs", car.costs);
        // const totalCost =
        //     car.costs.bollo +
        //     car.costs.superbollo +
        //     car.costs.yearlyFinancial +
        //     car.costs.yearlyFuelConsumption;
        // console.log("totalCost", totalCost, "/year");
        // console.log("totalCost", totalCost / 12, "/month");
    });
});
