export const getMediaType = (url: string) => {
    const imageExtensions = /\.(jpeg|jpg|gif|png|bmp|svg)$/i;
    const videoExtensions = /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)$/i;

    if (imageExtensions.test(url)) {
        return "image";
    }
    // else if (videoExtensions.test(url)) {
    return "video";
    // }
};
