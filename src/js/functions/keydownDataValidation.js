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

export default checkKeydownData;
