const API = {
  url: "/src/js/data/italian_regions.json",
  fetchRegions: async () => {
    const result = await fetch(API.url);
    return await result.json();
  },
};

export default API;
