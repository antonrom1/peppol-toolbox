import { btn } from './utils.js';

export function createScreens({ Store, View, api, refresh, to }) {
  function root() {
    const { installed, loading } = Store.get();
    const headerBtn = btn(
      `${window.odoo.info.server_version}${installed ? '' : ' (peppol not installed)'}`,
      'fa-list',
      api.models
    );

    const body = !installed
      ? [btn('Install Peppol', 'fa-download', async () => { await api.install(); await refresh(); })]
      : [
        btn('Peppol Mode', 'fa-cogs', () => to('mode')),
        btn(`Companies${loading ? ' …' : ''}`, 'fa-building', () => to('companies'))
      ];

    const items = [headerBtn, ...body, btn('', 'fa-times-circle', () => View.panel.classList.remove('show'))];

    View.replaceTop ? View.replaceTop(items) : View.show(items);
  }

  async function companies() {
    const { companies, loading } = Store.get();
    const head = [btn('', 'fa-chevron-left', () => to('root'))];

    if (loading) {
      View.replaceTop([...head, document.createTextNode('Loading…')]);
      return;
    }

    if (!companies.length) {
      // first time open, lazy load
      View.replaceTop([...head, document.createTextNode('Loading…')]);
      await refresh();
    } else {
      View.replaceTop([
        ...head,
        ...companies.map(c =>
          btn(
            c.text,
            c.icon,
            c.eligible
              ? () => api.openWizard(c.id, c.state)
              : () => alert(`${c.text} is not eligible`)
          )
        )
      ]);
    }
  }

  function mode() {
    View.replaceTop([
      btn('', 'fa-chevron-left', () => to('root')),
      ...['demo', 'test', 'prod'].map(m =>
        btn(m[0].toUpperCase() + m.slice(1),
          { demo: 'fa-play-circle', test: 'fa-flask', prod: 'fa-rocket' }[m],
          async () => { await api.setMode(m); to('root'); }
        )
      )
    ]);
  }

  return { root, companies, mode };
}
