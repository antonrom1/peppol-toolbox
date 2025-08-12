(() => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = chrome.runtime.getURL('peppol.css');
    (document.head || document.documentElement).appendChild(css);

    const s = document.createElement('script');
    s.type = 'module';
    s.src = chrome.runtime.getURL('toolbox/app.js');
    s.onload = () => s.remove();
    (document.head || document.documentElement).appendChild(s);
})();
