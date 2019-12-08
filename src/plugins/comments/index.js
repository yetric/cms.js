const mount = (cms) => {
    cms.on('before_render', before_render);
};
const unmount = () => {};

const before_render = () => {};

export default {
    mount,
    unmount
};
