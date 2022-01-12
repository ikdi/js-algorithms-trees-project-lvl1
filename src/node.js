const hasProperty = (obj, property) => Object.prototype.hasOwnProperty.call(obj, property);

export default class Node {
  static DYNAMIC_SIGN = ':';

  constructor(name, constraint = null, options = null) {
    Node.checkConstraintType(constraint);

    this.name = name;
    this.constraint = constraint;
    this.handlers = options ? { [options.method]: options.handler } : {};
    this.children = new Map();
    this.dynamicChildren = new Map();
  }

  static checkConstraintType(constraint) {
    if (constraint === null) return true;
    if (constraint instanceof RegExp) return true;
    if (typeof constraint === 'function') return true;

    throw new Error('Unknown constraint type');
  }

  isValidName(name) {
    if (!this.constraint) return true;
    if (this.constraint instanceof RegExp) return this.constraint.test(name);
    if (typeof this.constraint === 'function') return this.constraint(name);
    return false;
  }

  addChild(name, constraint, options) {
    const children = name.startsWith(Node.DYNAMIC_SIGN) ? this.dynamicChildren : this.children;
    if (!children.has(name)) {
      const node = new Node(name, constraint, options);
      children.set(name, node);
      return node;
    }

    const node = children.get(name);
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
      if (child.isValidName(segment)) {
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
