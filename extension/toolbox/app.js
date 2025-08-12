import { h, getSessionInfo, waitForOdoo } from './utils.js';
import { Store } from './state.js';
import { View } from './view.js';
import { makeApi } from './api.js';
import { createScreens } from './screens.js';

(async () => {
  if (!window.odoo) return;
  const sessionInfo = getSessionInfo();
  if (!sessionInfo?.is_admin) return;

  const { orm, actionService } = await waitForOdoo();
  View.mount();

  let inFlight = null;
  async function refresh() {
    if (inFlight) return inFlight;
    Store.set({ loading: true });
    inFlight = Promise.all([api.installed(), api.companies()])
      .then(([installed, companies]) => Store.set({ installed, companies, loading: false }))
      .catch(() => Store.set({ loading: false }))
      .finally(() => { inFlight = null; });
    return inFlight;
  }

  const api = makeApi(orm, actionService, refresh);

  function to(screen) {
    Store.set({ screen });
  }

  const Screens = createScreens({ Store, View, api, refresh, to });

  function render() {
    const { screen } = Store.get();
    (Screens[screen] || Screens.root)();
  }

  Store.on(render);
  to('root');       // initial route
  await refresh();  // initial data
})();
