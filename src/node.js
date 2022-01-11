export default class Node {
  static DYNAMIC_SIGN = ':';

  constructor(name, handler = null) {
    this.name = name;
    this.handler = handler;
    this.children = new Map();
    this.dynamicChildren = new Map();
  }

  addChild(segment, handler) {
    const children = segment.startsWith(Node.DYNAMIC_SIGN) ? this.dynamicChildren : this.children;
    if (!children.has(segment)) {
      const node = new Node(segment, handler);
      children.set(segment, node);
      return node;
    }

    const node = children.get(segment);
    node.setHandler(handler);
    return node;
  }

  setHandler(handler) {
    if (handler && !this.handler) {
      this.handler = handler;
    }
  }

  find(segments) {
    if (segments.length === 0) {
      if (!this.handler) return null;
      return { path: [], params: {}, handler: this.handler };
    }

    const [segment, ...rest] = segments;

    if (this.children.has(segment)) {
      const childNode = this.children.get(segment);
      const childData = childNode.find(rest);
      return childData === null
        ? null
        : {
          path: [segment, ...childData.path],
          params: { ...childData.params },
          handler: childData.handler,
        };
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const [dynamicSegment, childNode] of this.dynamicChildren.entries()) {
      const childData = childNode.find(rest);
      if (childData !== null) {
        const dynamicSegmentName = dynamicSegment.slice(1);
        return {
          path: [dynamicSegment, ...childData.path],
          params: { [dynamicSegmentName]: segment, ...childData.params },
          handler: childData.handler,
        };
      }
    }

    return null;
  }
}
