export const isAbsolute = (url) => !!/^https?:\/\//i.test(url);
export const isExistingPath = (href) => {
    const avoidPushURLs = ['/rss.xml', '/sitemap.xml'];
    return avoidPushURLs.indexOf(href) > -1;
};

export const isCustomProtocol = (url) => {
    const protocols = ['mailto', 'ftp', 'file', 'nntp', 'telnet', 'gopher'];
    for (let i = 0; i < protocols.length; i++) {
        const protocol = protocols[i];
        if (url.startsWith(`${protocol}:`)) {
            return true;
        }
    }

    return false;
};

export const isPushStateURL = (href) =>
    !isAbsolute(href) && !isExistingPath(href) && !isCustomProtocol(href);

export const getTracker = () => {
    if ('ga' in window) {
        let tracker = ga.getAll()[0];
        return tracker;
    }
    return null;
};

export const send = (...args) => {
    const tracker = getTracker();
    tracker && tracker.send.apply(tracker, args);
};
export const trackPageView = (path) => {
    send('pageview', path);
};

export const trackEvent = (category, action, label = null, value = null) => {
    send('event', category, action, label, value);
};

export const setEventHandlers = (element, handlers) => {
    for (let key in handlers) {
        if (handlers.hasOwnProperty(key)) {
            element.addEventListener(key, handlers[key]);
        }
    }
    return element;
};

export const setAttributes = (element, attrs) => {
    for (let key in attrs) {
        if (attrs.hasOwnProperty(key)) {
            element.setAttribute(key, attrs[key]);
        }
    }
    return element;
};

export const createElement = (tagName, attrs = {}, handlers = {}) =>
    setEventHandlers(setAttributes(document.createElement(tagName), attrs), handlers);
