//Helper functions

export const getFilteredData = (arr, value) => {
    const results = [];

    for (let i = 0; i < arr.length; i++) {
        const newValue = value.toLowerCase();
        const countryName = arr[i].country.toLowerCase();
        const capital = arr[i].capital.toLowerCase();
        const region = arr[i].region.toLowerCase();
        const population = arr[i].population;
        const area = arr[i].area;
        const id = arr[i].id;

        if (countryName.includes(newValue) || capital.includes(newValue) || region.includes(newValue)
            || population === Number(newValue) || area === Number(newValue) || id === Number(newValue)) {
            results.push(arr[i]);
        }
    }

    return results;
};

export const getVisibleData = (totalData, currentPage, perPageData) => {
    const endIndex = currentPage * perPageData;
    const startIndex = endIndex - perPageData;

    return totalData.slice(startIndex, endIndex);
};

export const loadState = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch {
        alert("Please, activate local storage!");
    }
};


export const saveState = (key, value) => {
    try {
        return localStorage.setItem(key, JSON.stringify(value));
    } catch {
        alert("Please, activate local storage!");
    }
};