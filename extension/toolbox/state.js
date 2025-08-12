export const Store = (() => {
  const init = { installed: false, companies: [], loading: false, screen: 'root' };
  let state = { ...init };
  const subs = new Set();
  const get = () => state;
  const set = patch => { state = { ...state, ...patch }; subs.forEach(fn => fn(state)); };
  const on = fn => { subs.add(fn); return () => subs.delete(fn); };
  return { get, set, on };
})();
