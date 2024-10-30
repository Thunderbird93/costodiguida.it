import fuelPrices from "./fuelPrices.js";
import regionsTax from "./regionsTax.js";
document.addEventListener("DOMContentLoaded", () => {
    const car = {
        distance: null,
        efficiency: null,
        fuelType: null,
        ownerResidency: null,
        enginePower: null,
        costs: {
            yearlyFuelConsumption: null,
            bollo: null,
            superbollo: null,
        },
    };

    const calcFuelConsumption = () => {
        const litres = car.distance / car.efficiency;
        const fuelPricePerLitre = fuelPrices[car.fuelType] / 1000; //€
        car.costs.yearlyFuelConsumption = litres * fuelPricePerLitre;
    };

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

    const action = document.getElementById("action");

    action.addEventListener("click", () => {
        car.fuelType = document.querySelector(
            'input[name="fuelType"]:checked',
        ).value;

        const region = document.getElementById("regions-select");
        car.ownerResidency = region.value;

        function parseAndAssignValue(id) {
            const element = document.getElementById(id);
            const value = parseInt(element.value);
            car[id] = isNaN(value) ? 0 : value;
            element.value = car[id];
        }

        parseAndAssignValue("distance");
        parseAndAssignValue("efficiency");
        parseAndAssignValue("enginePower");

        calcFuelConsumption();
        calcBollo();
        calcSuperbollo();
        console.log("car.costs", car.costs);
    });
});
