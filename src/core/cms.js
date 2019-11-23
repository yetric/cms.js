import {isExistingPath, isPushStateURL, setAttributes} from './utils';
import {triggerEvent, on} from './events';
import {parseHtmlForEmbeds} from './embed';

let APP_ROUTES = [];
const appRoot = document.getElementById('app');
const pageCache = {};

export const prefetch = async (tpl, type) => {
    pageCache[tpl] = await import(`../${type}/${tpl}.md`);
    return true;
};

export const onError = (error) => {
    console.error(error);
};

/* WiP - Handle 404 with noindex meta tag */
export const injectToHead = (elm) => {
    document.getElementsByTagName('head')[0].appendChild(elm);
};

export const setMetaTag = (metaType, value) => {
    const metaTag = document.createElement('meta');
    setAttributes(metaTag, {
        name: metaType,
        content: value
    });
    injectToHead(metaTag);
};

export const removeMetaTag = (metaType, value) => {
    const tag = document.querySelector(`[name="${metaType}"][content="${value}"]`);
    tag && tag.remove();
};

export const handle404 = async (error) => {
    const fourOhFour = await import(`../pages/404.md`);
    setMetaTag('robots', 'noindex');
    setAppTitle(fourOhFour.attributes.title || document.title);
    setAppContent(fourOhFour.html);
    onError(error);
};

export const importImagesToHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const images = Array.from(div.getElementsByTagName('img'));
    if (images.length > 0) {
        images.forEach((image) => {
            let imagePath = image.src;
            let parser = document.createElement('a');
            parser.href = imagePath;
            let {protocol, host} = parser;
            let domain = `${protocol}//${host}/`;
            let relativeToSrcPath = imagePath.replace(domain, '');
            let webpackImg = require('../' + relativeToSrcPath);
            html = html.replace(relativeToSrcPath, webpackImg + '#js-embed');
        });
    }
    return html;
};

export const setAppContent = (html) => {
    appRoot.innerHTML = parseHtmlForEmbeds(importImagesToHtml(html));
};

export const setAppTitle = (title) => {
    document.title = title;
};

export const isLocalScript = (script) => {
    return true;
};

export const loadPage = async (tpl, type = 'pages') => {
    setAppContent('Laddar sida');
    removeMetaTag('robots', 'noindex'); // TODO: Do this when you leave a noindex page
    try {
        let page = null;
        if (pageCache.hasOwnProperty(tpl)) {
            page = pageCache[tpl];
        } else {
            page = await import(/* webpackChunkName: "pages" */ `../${type}/${tpl}.md`);
            pageCache[tpl] = page;
        }
        setAppContent(page.html);
        if (page.attributes.hasOwnProperty('scripts')) {
            const customScripts = page.attributes.scripts;
            customScripts.forEach((script) => {
                if (isLocalScript(script)) {
                    import('../' + script);
                } else {
                    // TODO: Add to head and remove on page view
                }
            });
        }
        setAppTitle(page.attributes.title || document.title);
    } catch (error) {
        await handle404(error);
    }
};

const routesToTraversable = (routes) =>
    Object.keys(routes)
        .sort((a, b) => b.length - a.length)
        .map((path) => ({
            path: new RegExp('^' + path.replace(/:[^\s/]+/g, '([\\w-]+)') + '$'),
            module: routes[path]
        }));

const matchRoute = (path, traversableRoutes) => {
    for (let i = 0, l = traversableRoutes.length; i < l; i++) {
        let found = path.match(traversableRoutes[i].path);
        if (found) {
            let module = traversableRoutes[i].module;
            let args = found.slice(1);
            return {
                module,
                args
            };
        }
    }
    return null;
};

const popStateHandler = async (event) => {
    await navigate(document.location.pathname);
};

const removeNavHandlers = (event) => {
    window.removeEventListener('popstate', popStateHandler);
    document.removeEventListener('click', navigateHandler);
};

export const navigate = async (path, doPushState = true) => {
    const route = matchRoute(path, APP_ROUTES);
    const {history} = window;
    if (route && typeof route.module === 'function') {
        triggerEvent(document, 'nav', {
            path
        });
        await route.module.apply(route.module, route.args);
    }
    if (doPushState) {
        history.pushState({}, null, path);
        window.scrollTo(0, 0);
    }
};

const navigateHandler = async (event) => {
    let {target} = event;
    if (target && target.tagName.toLowerCase() === 'a') {
        const href = target.getAttribute('href');
        if (isPushStateURL(href)) {
            event.preventDefault();
            await navigate(href);
        } else {
            if (!isExistingPath(href)) {
                target.setAttribute('target', '_blank');
            }
        }
    }
};

export const nav = async (routes) => {
    APP_ROUTES = routesToTraversable(routes);
    const onNavHandlers = [];
    window.addEventListener('popstate', popStateHandler);
    window.addEventListener('beforeunload', removeNavHandlers);
    document.addEventListener('click', navigateHandler);
    await navigate(document.location.pathname, false);
    on(document, 'nav', (event) => {
        onNavHandlers.forEach((handler) => handler(event.detail));
    });
    return {
        onNav: (handler) => onNavHandlers.push(handler)
    };
};
