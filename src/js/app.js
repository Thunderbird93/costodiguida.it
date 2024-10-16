import setContent from "./functions/setContent.js";
import car from "./car.js";
import fuelPrices from "./fuelPrices.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM content loaded.");
    const main = document.querySelector("main");

    const calcCosts = (data, fuelType) => {
        if (fuelType !== "electric") {
            const safe = (fn) => {
                const result = fn();
                return isNaN(result) ? 0 : result;
            };

            const calcSuperbollo = () => {
                if (data.power <= 185) {
                    return 0;
                }
                const taxablePower = data.power - 185;
                const superbollo = Math.trunc(taxablePower * 20);
                return superbollo;
            };

            const calcFuelConsumption = () => {
                const kmYear = data.distance;
                const kmL = data.efficiency;
                const litresYear = kmYear / kmL;
                const eurL = fuelPrices[fuelType] / 1000;
                const fuelCost = Math.trunc(litresYear * eurL);
                console.log("Carburante: €", fuelCost, "/anno");
                return fuelCost;
            };

            const calcPayments = () => {
                const { monthly, months, upfront } = data;
                const totalCosts = Math.trunc(monthly * months + upfront);
                return (totalCosts / months) * 12;
            };

            const fuel = safe(calcFuelConsumption);
            const taxes = safe(calcSuperbollo);
            const payments = safe(calcPayments);
            const totalCosts = payments + taxes + fuel;
            const monthly = Math.trunc(totalCosts / 12);
            console.log(`Costo effettivo di ${monthly}€/mese`);
        } else {
            console.log("Work in progress");
        }
    };

    //ottimizzare e spostare fuori da app
    const actionButton = document.getElementById("action");
    if (actionButton) {
        actionButton.addEventListener("click", async () => {
            await setContent("fuel", main);
            const fuelOptions = document.querySelectorAll(
                'input[type="radio"][name="fuel"]',
            );
            if (fuelOptions) {
                const fuels = [...fuelOptions];
                fuels.forEach((fuelRadioButton) => {
                    fuelRadioButton.addEventListener(
                        "change",
                        async ({ target }) => {
                            car.fuel.type = target.value;
                            const content = `${target.value}-page`;
                            await setContent(content, main);
                            const calcButton =
                                document.getElementById("calc-button");
                            calcButton.addEventListener("click", () => {
                                function getValueById(id) {
                                    return (
                                        Number(
                                            document.getElementById(id)?.value,
                                        ) || 0
                                    );
                                }

                                const distance = getValueById("distance");
                                const efficiency = getValueById("efficiency");
                                const power = getValueById("power");
                                const upfront = getValueById("upfront");
                                const monthly = getValueById("monthly");
                                const months = getValueById("months");

                                const data = {
                                    distance,
                                    efficiency,
                                    power,
                                    upfront,
                                    monthly,
                                    months,
                                };

                                calcCosts(data, car.fuel.type);
                            });
                        },
                    );
                });
            }
        });
    }
});

//TODO NEXT
//Salvare in local i data
