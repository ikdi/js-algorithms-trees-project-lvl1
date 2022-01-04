/*
const patterns = [
  {
    path: '/courses/:id',
    handler: () => 'courses id!',
    pattern: '/courses/(\\w+)',
    params: [':id'],
  },
  {
    path: '/courses',
    handler: () => 'courses!',
    pattern: '/courses',
    params: [],
  },
];
*/

const makeTemplate = (route) => {
  const { path, handler } = route;
  const parts = path.split('/');

  const params = parts.filter((part) => part.startsWith(':')).map((part) => part.substr(1));

  const pattern = parts.map((part) => (part.startsWith(':') ? '(\\w+)' : part)).join('/');
  const re = new RegExp(`^${pattern}$`);

  return {
    path, handler, params, re,
  };
};

const findMatch = (templates, path) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const template of templates) {
    const match = path.match(template.re);
    if (match !== null) {
      return {
        template,
        match,
      };
    }
  }

  return null;
};

const makeServe = (templates) => (path) => {
  const matchAndTemplate = findMatch(templates, path);

  if (matchAndTemplate === undefined) {
    throw new Error(`${path} not found!`);
  }

  const { match, template } = matchAndTemplate;

  const params = {};

  template.params.forEach((param, i) => {
    params[param] = match[i + 1];
  });

  return {
    path: template.path,
    handler: template.handler,
    params,
  };
};

export default (routes) => {
  const templates = routes.map((route) => makeTemplate(route));

  return {
    serve: makeServe(templates),
  };
};
