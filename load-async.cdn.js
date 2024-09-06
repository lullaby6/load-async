function loadJS(src, onLoad = null, parent = document.head) {
    if (Array.isArray(src)) return src.map(s => loadJS(s, onLoad, parent));

    if (parent.querySelector(`script[src="${src}"]`)) return null;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;

    if (typeof onLoad === 'function') script.onload = onLoad;
    script.onerror = () => {
        console.error(`Failed to load script: ${src}`);
        script.remove();
    }

    parent.appendChild(script);
    return script;
}

function loadCSS(src, onLoad = null, parent = document.head) {
    if (Array.isArray(src)) return src.map(s => loadCSS(s, onLoad, parent));

    if (parent.querySelector(`link[href="${src}"]`)) return null;

    const link  = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = src;
    link.media = 'all';

    if (typeof onLoad === 'function') link.onload = onLoad;
    link.onerror = () => {
        console.error(`Failed to load stylesheet: ${src}`);
        link.remove();
    }

    parent.appendChild(link);
    return link;
}

function loadAsyncJS(src, onLoad = null, parent = document.head) {
    return new Promise((resolve, reject) => {
        const script = loadJS(src, event => {
            if (typeof onLoad === 'function') onLoad(event);
            resolve(script)
        }, parent);

        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    });
}

function loadAsyncCSS(src, onLoad = null, parent = document.head) {
    return new Promise((resolve, reject) => {
        const link = loadCSS(src, event => {
            if (typeof onLoad === 'function') onLoad(event);
            resolve(link)
        }, parent);

        link.onerror = () => reject(new Error(`Failed to load stylesheet: ${src}`));
    });
}

async function loadAsync(src, onLoad = null, parent = document.head) {
    if (Array.isArray(src)) return Promise.all(src.map(s => loadAsync(s, onLoad, parent)));

    try {
        const response = await fetch(src);
        const contentType = response.headers.get('content-type');

        if (contentType.includes('text/javascript') || contentType.includes('application/javascript')) {
            return loadAsyncJS(src, onLoad, parent);
        } else if (contentType.includes('text/css')) {
            return loadAsyncCSS(src, onLoad, parent);
        }

        throw new Error(`Unsupported content type: ${contentType}`)
    } catch (error) {
        throw new Error(`Failed to get content type: ${src}`);
    }
}

async function loadAsyncJSWithError(src, onLoad = null, parent = document.head) {
    try {
        const script = await loadAsyncJS(src, onLoad, parent);
        return [script, null];
    } catch (error) {
        return [null, error];
    }
}

async function loadAsyncCSSWithError(src, onLoad = null, parent = document.head) {
    try {
        const link = await loadAsyncCSS(src, onLoad, parent);
        return [link, null];
    } catch (error) {
        return [null, error];
    }
}

async function loadAsyncWithError(src, onLoad = null, parent = document.head) {
    try {
        const file = await loadAsync(src, onLoad, parent);
        return [file, null];
    } catch (error) {
        return [null, error];
    }
}