import './style.scss';
import {loadPage, nav} from './core/cms';
const pageView = async (name) => loadPage(name);
const homeView = async () => loadPage('home');
(async () => {
    const cms = await nav({
        '/': homeView,
        '/:page': pageView
    });
    cms.onNav((event) => {
        console.log('My Custom onNav Handler', event);
    });
})();
