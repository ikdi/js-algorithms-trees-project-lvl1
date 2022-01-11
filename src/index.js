import RoutesTrie from './trie.js';

export default (routes) => {
  const trie = new RoutesTrie();

  routes.forEach(({ path, handler }) => {
    trie.addRoute(path, handler);
  });

  // console.log(inspect(trie, { colors: true, depth: 20 }));

  return {
    serve(path) {
      return trie.find(path);
    },
  };
};
