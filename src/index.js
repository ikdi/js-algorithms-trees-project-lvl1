export default (routes) => ({
  serve: (path) => {
    const result = routes.find((route) => route.path === path);

    if (result === undefined) {
      throw new Error(`${path} not found!`);
    }

    return result.handler;
  },

});
