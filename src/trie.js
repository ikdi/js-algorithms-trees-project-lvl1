import Node from './node.js';

export default class RoutesTrie {
  static normalizePath(path) {
    const trimmedPath = path.trim();
    return trimmedPath.endsWith('/') ? trimmedPath.slice(0, -1) : trimmedPath;
  }

  constructor() {
    this.root = new Node('*');
  }

  static isDynamicSegment(segment) {
    return segment.startsWith(':');
  }

  static getSegmentConstraint(segment, constraints) {
    if (!this.isDynamicSegment(segment)) return null;

    const name = segment.slice(1);
    return constraints[name] ?? null;
  }

  addRoute(path, options) {
    const normalizedPath = RoutesTrie.normalizePath(path);
    const segments = normalizedPath.split('/');
    const segmentsLastIndex = segments.length - 1;

    const { constraints, ...terminalOptions } = options;

    segments.reduce((currentNode, segment, i) => {
      const nodeOptions = segmentsLastIndex === i ? terminalOptions : null;
      const nodeConstraint = RoutesTrie.getSegmentConstraint(segment, constraints);
      return currentNode.addChild(segment, nodeConstraint, nodeOptions);
    }, this.root);
  }

  find(path, method) {
    const errMessage = /no such path/i;
    if (!path.includes('/')) throw new Error(errMessage);
    const normalizedPath = RoutesTrie.normalizePath(path);
    const segments = normalizedPath.split('/');

    const result = this.root.find(segments, method);

    if (!result) {
      throw new Error(errMessage);
    }

    return { ...result, path: result.path.join('/'), method };
  }
}
