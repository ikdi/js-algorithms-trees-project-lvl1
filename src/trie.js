import Node from './node.js';

export default class RoutesTrie {
  static normalizePath(path) {
    const trimmedPath = path.trim();
    return trimmedPath.endsWith('/') ? trimmedPath.slice(0, -1) : trimmedPath;
  }

  constructor() {
    this.root = new Node('*');
  }

  addRoute(path, handler) {
    const normalizedPath = RoutesTrie.normalizePath(path);
    const segments = normalizedPath.split('/');
    const segmentsLastIndex = segments.length - 1;

    segments.reduce((currentNode, segment, i) => {
      const currentHandler = segmentsLastIndex === i ? handler : null;
      return currentNode.addChild(segment, currentHandler);
    }, this.root);
  }

  find(path) {
    const normalizedPath = RoutesTrie.normalizePath(path);
    const segments = normalizedPath.split('/');

    const result = this.root.find(segments);

    if (!result) {
      throw new Error(`${path} not found!`);
    }

    return { path: result.path.join('/'), handler: result.handler, params: { ...result.params } };
  }
}
