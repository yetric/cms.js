import {triggerEvent} from './events';
import {createElement} from './utils';
export const supportsNativeShareWidget = () => 'share' in navigator;
export const getShareButton = (shareText) => {
    const shareAnchor = createElement(
        'a',
        {
            href: '#share',
            class: 'share-btn'
        },
        {
            click: (event) => {
                event.preventDefault();
                share({
                    title: document.title,
                    text: document.title,
                    url: location.href
                });
            }
        }
    );
    shareAnchor.innerText = shareText;
    return shareAnchor;
};

export const share = ({title, text, url}) => {
    if (navigator.share) {
        navigator
            .share({title, text, url})
            .then(() => {
                triggerEvent(document, 'sharedURL', {title, text, url});
            })
            .catch((error) => {
                console.warn(error);
            });
    }
};
