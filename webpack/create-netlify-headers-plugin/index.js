const {writeFileSync} = require('../../bin/core/utils');
const types = {
    css: 'stylesheet',
    js: 'script'
};
module.exports = class CreateNetlifyHeadersPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
            compilation.chunks.forEach((chunk) => {
                const headersFileName = '_headers';
                const paths = ['/'];
                chunk.files.forEach((filename) => {
                    const type = types[filename.split('.').pop()];
                    paths.push(`Link: <${filename}>; rel=preload; as=${type}`);
                });
                writeFileSync(__dirname + `/../../public/_headers`, paths.join('\n  '));
            });

            callback();
        });
    }
};
