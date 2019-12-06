import {initObserver} from './events';

const getYoutubeVideoIdFromURL = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return match[2];
    }
    return false;
};

export const youtubeEmbed = (videoId) => {
    return `<div class="embed-youtube">
<iframe width="560" height="315" frameborder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
  src="https://www.youtube.com/embed/${videoId}?autoplay=1"
></iframe></div>`;
};

export const listenForEmbeds = () => {
    initObserver(document.querySelector('[href*="youtube.com"]'), (entry) => {
        entry.innerHTML = youtubeEmbed(getYoutubeVideoIdFromURL(entry.href));
    });
};
