const path = require('path');
const {writeHelperFile} = require('./core/utils');
const pagesPath = path.resolve('./src/pages/');
const cmsConfig = require('../cms');
const ignores = ['404.md'];

['sitemap', 'rss'].forEach((type) => {
    writeHelperFile({
        ignores,
        cmsConfig,
        pagesPath,
        type
    })
        .then((result) => {
            console.log(type + ' written');
        })
        .catch((error) => {
            console.error(error);
        });
});
