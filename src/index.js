import './style.scss';
import {loadPage, nav} from './core/cms';
const pageView = async (name) => loadPage(name);
const homeView = async () => loadPage('home');
const app = nav({
    '/': homeView,
    '/:page': pageView
});
