document.addEventListener("DOMContentLoaded", () => {
    console.info("DOM loaded.");
    const user = {
        distance: {
            yearly: null,
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

    const distance = document.getElementById("distance");
    if (distance) {
        distance.addEventListener("input", ({ target }) => {
            target.value = target.value.replace(",", ".");
        });

        distance.addEventListener("keydown", (event) => {
            checkKeydownData(event);
        });

        distance.addEventListener("change", ({ target }) => {
            let input = parseFloat(target.value);
            if (isNaN(input)) {
                input = 0;
            }
            user.distance.yearly = input;
            target.value = parseFloat(input).toFixed(0);
        });
    }
});
