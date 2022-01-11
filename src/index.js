import RoutesTrie from './trie.js';

const DEFAULT_METHOD = 'GET';

export default (routes) => {
  const trie = new RoutesTrie();

  routes.forEach(({ path, handler, method = DEFAULT_METHOD }) => {
    trie.addRoute(path, { handler, method });
  });

  // console.log(inspect(trie, { colors: true, depth: 20 }));

  return {
    serve({ path, method = DEFAULT_METHOD }) {
      return trie.find(path, method);
    },
  };
};
