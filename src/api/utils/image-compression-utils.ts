const maxImageWidth = 200;
const maxImageHeight = 200;
const imageQuality = 0.1; // 10% to save space in local storage

function getImageSize(img: any): number[] {
    const { width, height } = img;

    // calculate the width and height, constraining the proportions
    if (width > height) {
        if (width > maxImageWidth) {
            const ratio = height / width;
            const newHeight = Math.round(maxImageWidth * ratio);
            const newWidth = maxImageWidth;
            return [newWidth, newHeight];
        }
    } else if (height > maxImageHeight) {
        const ratio = width / height;
        const newWidth = Math.round(maxImageHeight * ratio);
        const newHeight = maxImageHeight;
        return [newWidth, newHeight];
    }

    return [width, height];
}

export default function compressImage(
    url: string,
    outputFormat?: any
): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        // eslint-disable-next-line func-names
        img.onload = function () {
            let canvas: any = document.createElement("CANVAS");
            const ctx = canvas.getContext("2d");

            const [imgWidth, imgHeight] = getImageSize(img);
            canvas.height = imgHeight;
            canvas.width = imgWidth;

            ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
            const dataURL = canvas.toDataURL(outputFormat, imageQuality);
            resolve(dataURL);
            canvas = null;
        };
        img.src = url;
    });
}
