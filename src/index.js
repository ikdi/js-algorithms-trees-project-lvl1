import RoutesTrie from './trie.js';

const DEFAULT_METHOD = 'GET';

export default (routes) => {
  const trie = new RoutesTrie();

  routes.forEach(({ path, handler, method = DEFAULT_METHOD }) => {
    trie.addRoute(path, { handler, method });
  });

  return {
    serve({ path, method = DEFAULT_METHOD }) {
      return trie.find(path, method);
    },
  };
};
