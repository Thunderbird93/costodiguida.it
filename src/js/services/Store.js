const Store = {
  upfront: null,
  monthly: null,
  months: null,
  rentMonthlyCost: 0,
  //
  isItHybrid: null,
  isItPlugIn: null,
  isItElectric: null,
  displayPreMessage: false,
  //
};

const proxiedStore = new Proxy(Store, {
  set(target, property, value) {
    target[property] = value;
    if (property === "upfront") {
      window.dispatchEvent(new Event("upfrontchange"));
    }
    if (property === "monthly") {
      window.dispatchEvent(new Event("monthlychange"));
    }
    if (property === "months") {
      window.dispatchEvent(new Event("monthschange"));
    }
    if (property === "rentMonthlyCost") {
      window.dispatchEvent(new Event("rentMonthlyCostchange"));
    }
    if (property === "isItHybrid") {
      window.dispatchEvent(new Event("isItHybridchange"));
    }
    if (property === "isItPlugIn") {
      window.dispatchEvent(new Event("isItPlugInchange"));
    }
    if (property === "isItElectric") {
      window.dispatchEvent(new Event("isItElectricchange"));
    }
    if (property === "displayPreMessage") {
      window.dispatchEvent(new Event("displayPreMessagechange"));
    }

    return true;
  },

  get(target, property) {
    return target[property];
  },
});

export default proxiedStore;
