import { icons } from './utils.js';

export function makeApi(orm, actionService, refresh) {
  const eligCache = new Map();

  const api = {
    models: () =>
      orm.searchRead('ir.model', [], ['model'])
        .then(r => alert(r.map(m => m.model).join('\n'))),

    setMode: m =>
      // updated syntax in 19.1+ uses set_str, and up to 19.0 uses set_param, so we just read & write explicitly
      orm.searchRead('ir.config_parameter', [['key', '=', 'account_peppol.edi.mode']], ['id', 'value'])
        .then(res => {
          const current = res[0]?.value;
          if (current === m) {
            alert(`Peppol mode is already set to ${m}`);
            return;
          }
          orm.write('ir.config_parameter', [res[0].id], { value: m })
            .then(() => {
              alert(`Peppol mode set to ${m}`);
              refresh();
            });
        }),

    install: async () => {
      const [id] = await orm.search('ir.module.module', [['name', '=', 'account_peppol']]);
      await orm.call('ir.module.module', 'button_install', [id]);
      await orm.call('base.module.upgrade', 'upgrade_module', [0], {});
      alert('Installed Peppol');
    },

    installed: async () =>
      (await orm.searchRead('ir.module.module', [['name', '=', 'account_peppol']], ['state']))[0]
        ?.state === 'installed',

    settings: p => orm.create('res.config.settings', p),

    openWizard: async (companyId, state) => {
      const [sid] = await api.settings([{ company_id: companyId }]);
      const actionName = state === 'not_registered'
        ? 'action_open_peppol_form'
        : 'button_open_peppol_config_wizard';
      const act = await orm.call('res.config.settings', actionName, [sid], {});
      act.views = [[false, 'form']];
      await actionService.doAction(act, { onClose: refresh });
    },

    eligible: async id => {
      if (eligCache.has(id)) return eligCache.get(id);
      const [sid] = await api.settings([{ company_id: id }]);
      const val = (await orm.read('res.config.settings', [sid], ['is_account_peppol_eligible']))[0]
        .is_account_peppol_eligible;
      eligCache.set(id, val);
      return val;
    },

    companies: async () => {
      if (!await api.installed())
        return [];

      const rows = await orm.searchRead('res.company', [], ['name', 'account_peppol_proxy_state']);
      return Promise.all(rows.map(async r => {
        const eligible = await api.eligible(r.id);
        return {
          id: r.id,
          text: r.name,
          icon: eligible ? icons[r.account_peppol_proxy_state] || 'fa-question-circle' : 'fa-times',
          state: r.account_peppol_proxy_state,
          eligible
        };
      }));
    }
  };

  return api;
}
