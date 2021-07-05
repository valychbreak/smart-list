// eslint-disable-next-line import/prefer-default-export
export function getImageUrlFromEvent(e: React.ChangeEvent<HTMLInputElement>): string | null {
    const selectedFile = e.currentTarget?.files ? e.currentTarget.files[0] : null;

    if (!selectedFile) {
        return null;
    }

    return URL.createObjectURL(selectedFile);
}
