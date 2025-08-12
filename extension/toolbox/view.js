import { h } from './utils.js';

export const View = (() => {
  const panel = h('div', { id: 'ptb-panel' });
  const navs = [];
  const show = items => {
    if (navs.length) navs.at(-1).className = 'nav out';
    const nav = h('div', { className: 'nav in' }, ...items);
    panel.append(nav);
    navs.push(nav);
  };
  const replaceTop = items => {
    const top = navs.at(-1);
    const next = h('div', { className: 'nav in' }, ...items);
    panel.replaceChild(next, top);
    navs[navs.length - 1] = next;
  };
  const back = () => {
    if (navs.length < 2) return;
    const top = navs.pop();
    top.className = 'nav out';
    top.addEventListener('transitionend', () => top.remove(), { once: true });
    navs.at(-1).className = 'nav in';
  };
  const mount = () => {
    document.body.append(
      h('div', {
        id: 'ptb-btn',
        innerHTML: '<i class="fa fa-wrench"></i>',
        onclick: () => panel.classList.toggle('show')
      }),
      panel
    );
    show([h('div')]); // placeholder so replaceTop can swap
  };
  return { panel, show, replaceTop, back, mount };
})();
