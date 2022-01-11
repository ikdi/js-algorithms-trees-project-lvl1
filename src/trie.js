import Node from './node.js';

export default class RoutesTrie {
  static normalizePath(path) {
    const trimmedPath = path.trim();
    return trimmedPath.endsWith('/') ? trimmedPath.slice(0, -1) : trimmedPath;
  }

  constructor() {
    this.root = new Node('*');
  }

  addRoute(path, options) {
    const normalizedPath = RoutesTrie.normalizePath(path);
    const segments = normalizedPath.split('/');
    const segmentsLastIndex = segments.length - 1;

    segments.reduce((currentNode, segment, i) => {
      const terminalOptions = segmentsLastIndex === i ? options : null;
      return currentNode.addChild(segment, terminalOptions);
    }, this.root);
  }

  find(path, method) {
    const normalizedPath = RoutesTrie.normalizePath(path);
    const segments = normalizedPath.split('/');

    const result = this.root.find(segments, method);

    if (!result) {
      throw new Error(`${path} not found!`);
    }

    return { ...result, path: result.path.join('/'), method };
  }
}
