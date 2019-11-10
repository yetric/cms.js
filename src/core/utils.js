export const isAbsolute = (url) => !!/^https?:\/\//i.test(url);
export const isExistingPath = (href) => {
    const avoidPushURLs = ['/rss.xml', '/sitemap.xml'];
    return avoidPushURLs.indexOf(href) > -1;
};

export const isPushStateURL = (href) => !isAbsolute(href) && !isExistingPath(href);
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
