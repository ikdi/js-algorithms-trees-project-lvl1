import { test, expect, beforeAll } from '@jest/globals';
import makeRouter from '../src/index.js';

const routes = [
  {
    path: '/courses',
    handler: () => 'courses!',
  },
  {
    path: '/courses/basics',
    handler: () => 'basics',
  },
];
let router = null;

beforeAll(() => {
  router = makeRouter(routes);
});

test('succesful route search', () => {
  const path = '/courses';
  const handler = router.serve(path);

  expect(handler()).toEqual('courses!');
});

test('throw an error when route has not found', () => {
  const path = '/no_such_way';

  expect(() => { router.serve(path); }).toThrow();
});
