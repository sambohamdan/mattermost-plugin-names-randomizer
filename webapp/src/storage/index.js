import {getCurrentChannelName} from '../helpers';
export const STORAGE_ENTRY = 'saved-names';

export const isMainEntryDefined = () => {
    return Boolean(localStorage.getItem(STORAGE_ENTRY));
};

export const getFromLocalStorage = (name, key) => {
    // Get the existing data
    return JSON.parse(localStorage.getItem(name))[key];
};

// eslint-disable-next-line consistent-return
export const isCurrentChannelKeyIsRegistered = (existing, name, key) => {
    // eslint-disable-next-line no-unused-expressions
    existing === null && localStorage.setItem(name, JSON.stringify({}));
    if (existing && !Object.keys(existing).includes(getCurrentChannelName())) {
        var cachedResponse = JSON.parse(localStorage.getItem(name));
        if (cachedResponse) {
            cachedResponse[key] = [];
            localStorage.setItem(name, JSON.stringify(cachedResponse));
            return false;
        }
    }
};

export const isCurrentKeyIsFound = (entry, key) => {
    const cachedResponse = JSON.parse(localStorage.getItem(entry));
    return Boolean(Object.keys(cachedResponse).find((currentKey) => currentKey === key));
};

export const resetSpecificEntryInLocalStorage = (name, key) => {
    const cachedResponse = JSON.parse(localStorage.getItem(name));
    // eslint-disable-next-line no-unused-expressions
    isCurrentKeyIsFound(name, key) && delete cachedResponse[key];
    localStorage.setItem(name, JSON.stringify(cachedResponse));
};

export const addToLocalStorage = (name, key, value) => {
    // Get the existing data
    let existing = JSON.parse(localStorage.getItem(STORAGE_ENTRY));

    // check if the key is not already registered
    isCurrentChannelKeyIsRegistered(existing, name, key);

    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    existing = existing ? getFromLocalStorage(name, key) : [];

    // Add new data to localStorage Array and filter out any duplicate.
    // eslint-disable-next-line
    (existing.indexOf(value) > -1) ? existing : existing.push(value);

    // pull pre-defined key
    const getFreshData = JSON.parse(localStorage.getItem(STORAGE_ENTRY));
    let toSave;
    if (Object.keys(getFreshData).includes(getCurrentChannelName())) {
        toSave = {...getFreshData, [key]: existing};
    } else {
        // prepare data to be saved
        toSave = {
            ...getFreshData,
            [key]: existing,
        };
    }

    // Save back to localStorage
    localStorage.setItem(name, JSON.stringify(toSave));
};
