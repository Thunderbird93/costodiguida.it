const Store = {
  car: null,
};

const proxiedStore = new Proxy(Store, {
  set(target, property, value) {
    target[property] = value;
    if (property === "car") {
      window.dispatchEvent(new Event("appcarchange"));
    }
    return true;
  },
});

export default proxiedStore;
