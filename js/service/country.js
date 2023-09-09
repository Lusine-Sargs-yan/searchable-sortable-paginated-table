import {BASE_URL} from "./config.js";

export const getAllCountries = async () => {
    const endpoint = 'all';
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`)

        if (!response.ok) throw new Error(response.statusText);

        return await response.json();

    } catch (err) {
        console.log(err.message);
    }
};

