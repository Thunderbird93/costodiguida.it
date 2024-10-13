import routes from "../routes.js";

const fetchContent = async (path) => {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error("Network K.O.");
    }
    return await response.text();
};

const getContent = async (component) => {
    const route = routes[component];
    if (!route) {
        throw new Error(`Component "${component}" not found.`);
    }

    if (!route.content) {
        route.content = await fetchContent(route.path);
    }

    return route.content;
};

const setContent = async (component, location) => {
    try {
        console.time("content");
        const content = await getContent(component);
        location.innerHTML = content;
        console.timeEnd("content");
    } catch (e) {
        console.error(e);
    }
};

export default setContent;
