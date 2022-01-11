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

  find(segments, method) {
    if (segments.length === 0) {
      if (!hasProperty(this.handlers, method)) return null;
      return {
        path: [], params: {}, handler: this.handlers[method], method,
      };
    }

    const [segment, ...rest] = segments;

    if (this.children.has(segment)) {
      const childNode = this.children.get(segment);
      const childData = childNode.find(rest, method);
      if (childData === null) return null;
      return { ...childData, path: [segment, ...childData.path] };
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const [dynSegment, childNode] of this.dynamicChildren.entries()) {
      const childData = childNode.find(rest, method);
      if (childData !== null) {
        const name = dynSegment.slice(1);
        return {
          ...childData,
          path: [dynSegment, ...childData.path],
          params: { [name]: segment, ...childData.params },
        };
      }
    }

    return null;
  }
}
