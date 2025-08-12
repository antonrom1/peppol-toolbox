export const h = (t, p = {}, ...c) => {
  const e = Object.assign(document.createElement(t), p);
  c.flat().filter(Boolean).forEach(i =>
    e.append(typeof i === 'string' ? document.createTextNode(i) : i)
  );
  return e;
};

export const getSessionInfo = () => {
  const jsonStr = Array.from(document.scripts)
    .map(s => {
      const m = s.textContent.match(/odoo\.__session_info__\s*=\s*({.*?});/s);
      return m ? m[1] : null;
    })
    .find(Boolean) || null;
  return jsonStr ? JSON.parse(jsonStr) : null;
};

export const waitForOdoo = () =>
  new Promise(r => {
    const t = setInterval(() => {
      const root = window.odoo?.__WOWL_DEBUG__?.root;
      if (root?.orm && root?.actionService) {
        clearInterval(t);
        r(root);
      }
    }, 100);
  });

export const icons = {
  not_registered: 'fa-user-times',
  sender: 'fa-paper-plane',
  smp_registration: 'fa-cogs',
  receiver: 'fa-inbox',
  rejected: 'fa-ban'
};

export const btn = (label, icon, onclick) => {
  const b = h('button', { className: 'item', onclick });
  if (icon) b.append(h('i', { className: `fa ${icon}`, 'aria-hidden': 'true' }));
  b.append(h('span', { textContent: label }));
  return b;
};
