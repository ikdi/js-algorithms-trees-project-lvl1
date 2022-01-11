const hasProperty = (obj, property) => Object.prototype.hasOwnProperty.call(obj, property);

export default class Node {
  static DYNAMIC_SIGN = ':';

  constructor(name, options = null) {
    this.name = name;
    this.handlers = options ? { [options.method]: options.handler } : {};
    this.children = new Map();
    this.dynamicChildren = new Map();
  }

  addChild(segment, options) {
    const children = segment.startsWith(Node.DYNAMIC_SIGN) ? this.dynamicChildren : this.children;
    if (!children.has(segment)) {
      const node = new Node(segment, options);
      children.set(segment, node);
      return node;
    }

    const node = children.get(segment);
    node.setOptions(options);
    return node;
  }

  setOptions(options) {
    if (options && !hasProperty(this.handlers, options.method)) {
      this.handlers[options.method] = options.handler;
    }
  }

  findChild(segments, method) {
    const [segment, ...rest] = segments;
    if (!this.children.has(segment)) return null;

    const child = this.children.get(segment);
    const data = child.find(rest, method);
    return data
      ? { ...data, path: [segment, ...data.path] }
      : null;
  }

  findDynChild(segments, method) {
    const [segment, ...rest] = segments;
    // eslint-disable-next-line no-restricted-syntax
    for (const [dynSegment, child] of this.dynamicChildren.entries()) {
      const data = child.find(rest, method);
      if (data !== null) {
        const name = dynSegment.slice(1);
        return {
          ...data,
          path: [dynSegment, ...data.path],
          params: { [name]: segment, ...data.params },
        };
      }
    }

    return null;
  }

  find(segments, method) {
    if (segments.length === 0) {
      const handler = this.handlers[method];
      return handler ? { path: [], params: {}, handler } : null;
    }

    const data = this.findChild(segments, method);
    if (data) return data;

    return this.findDynChild(segments, method);
  }
}
