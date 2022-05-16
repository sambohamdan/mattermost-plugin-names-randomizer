export const fetchCurrentUsers = () => {
    const currentChannelKey = Object.keys(localStorage).filter((v) => v.startsWith('focalboardLastViewedChannel'));
    const currentChannelID = localStorage.getItem(currentChannelKey);
    const baseUrl = window.location.origin;
    return fetch(`${baseUrl}/api/v4/users?in_channel=${currentChannelID}&page=0&per_page=100&sort=status&active=true`).
        then((response) => response.json());
};

export const isCurrentPathIsChannel = () => {
    const temp = window.location.pathname.split('/');
    return temp[2].includes('channels');
};

export const getCurrentChannelName = () => {
    const temp = window.location.pathname.split('/');
    // eslint-disable-next-line
    return isCurrentPathIsChannel() ? temp[3] : undefined;
};

export const observeUrlChange = (randomizerTrigger) => {
    if (isCurrentPathIsChannel()) {
        randomizerTrigger.classList.remove('hide');
    }

    function onUrlChange() {
        if (isCurrentPathIsChannel()) {
            randomizerTrigger.classList.remove('hide');
        } else {
            randomizerTrigger.classList.add('hide');
        }
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            onUrlChange();
        }
    }).observe(document, {subtree: true, childList: true});
};
