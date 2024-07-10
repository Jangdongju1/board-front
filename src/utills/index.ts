export const convertUrlToFile = async (url: string) => {
    const response = await fetch(url);
    const data = await response.blob();
    const extension = url.split(".").pop();
    const fileName = url.split("/").pop();
    const meta = {type: `image/${extension}`};

    return new File([data], fileName as string, meta);
}

export const convertUrlsToFile = async (urls: string[]) => {
    const files: File[] = [];
    for (const url of urls) {
        const file = await convertUrlToFile(url);
        files.push(file);
    }
    return files;
}