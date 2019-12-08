const path = require('path');
const fs = require('fs');

const types = {
    css: 'style',
    js: 'script'
};
module.exports = class CreateNetlifyHeadersPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.afterEmit.tapAsync('CreateNetlifyHeadersPlugin', (compilation, callback) => {
            compilation.chunks.forEach((chunk) => {
                const headersFileName = '_headers';
                const paths = ['/'];
                chunk.files.forEach((filename) => {
                    const type = types[filename.split('.').pop()];
                    paths.push(`Link: <${filename}>; rel=preload; as=${type}`);
                });
                const writeFolder = process.cwd() + '/public';
                const fullPathToHeadersFile = `${writeFolder}/${headersFileName}`;
                fs.writeFileSync(fullPathToHeadersFile, paths.join('\n  '));
            });
            callback();
        });
    }
};
