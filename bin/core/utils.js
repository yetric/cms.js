const fs = require('fs');
const fm = require('front-matter');
const MarkdownIt = require('markdown-it');
const Twig = require('twig');
const md = new MarkdownIt();
const excerptHtml = require('excerpt-html');

function parseFromMdContent(config, filename, content) {
    const {body, attributes} = fm(content);
    const html = md.render(body);
    const slug = filename.replace('.md', '');
    const path = slug === 'home' ? '/' : '/' + slug;

    return {
        title: attributes.title,
        link: config.baseURL + path,
        date: attributes.date,
        excerpt: excerptHtml(html),
        html
    };
}

const readFiles = async (dirname, onFileContent, onDone, onError) => {
    try {
        for (const filename of fs.readdirSync(dirname)) {
            const file = `${dirname}/${filename}`;
            const content = await fs.readFileSync(file, 'utf8');
            onFileContent(filename, content);
        }
        onDone();
    } catch (error) {
        onError(error);
    }
};

const writeFileSync = (filename, content) => {
    fs.writeFileSync(filename, content);
};

const render = (tpl, data, callback) => {
    Twig.renderFile(__dirname + `/../views/${tpl}.twig`, data, (err, html) => {
        if (err) {
            console.error(err);
            return;
        }
        callback(html);
    });
};

const writeHelperFile = async ({pagesPath, ignores, cmsConfig, type, suffix = 'xml'}) => {
    const pages = [];
    await readFiles(
        pagesPath,
        (filename, content) => {
            if (ignores.indexOf(filename) === -1) {
                const page = parseFromMdContent(cmsConfig, filename, content);
                if (type === 'rss') {
                    page.date && pages.push(page);
                } else {
                    pages.push(page);
                }
            }
        },
        () => {
            if (type === 'rss') {
                // TODO: Sort by pubDate
            }
            render(type, {pages, cms: cmsConfig}, (rendered) => {
                writeFileSync(`${process.cwd()}/public/${type}.${suffix}`, rendered);
            });
        },
        (error) => {
            console.error(error);
        }
    );
};

module.exports = {
    readFiles,
    render,
    writeFileSync,
    writeHelperFile
};
