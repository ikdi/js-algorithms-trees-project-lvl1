import { test, expect, beforeAll } from '@jest/globals';
import makeRouter from '../src/index.js';

const routes = [
  {
    path: '/courses',
    handler: () => 'courses!',
  },
  {
    path: '/courses/:id',
    handler: (id) => `course: ${id}`,
  },
  {
    path: '/courses/:course_id/exercises/:id',
    handler: () => 'exercise!',
  },
  {
    path: '/lessons/:id/',
    handler: () => 'lessons!',
  },
  {
    path: '/',
    handler: () => 'root!',
  },
];
let router = null;

beforeAll(() => {
  router = makeRouter(routes);
});

test('simple route search', () => {
  const path = '/courses';
  const result = router.serve(path);

  expect(result.handler()).toEqual('courses!');
});

test('route search with trailing slash', () => {
  const path = '/courses/';
  const result = router.serve(path);

  expect(result.handler()).toEqual('courses!');
});

test('root route search', () => {
  const path = '/';
  const result = router.serve(path);

  expect(result.handler()).toEqual('root!');
});

test('dynamic route search', () => {
  const path = '/courses/js/exercises/100';
  const result = router.serve(path);

  expect(result.handler()).toEqual('exercise!');
  expect(result.params).toEqual({ course_id: 'js', id: '100' });
  expect(result.path).toEqual('/courses/:course_id/exercises/:id');
});

test('throw an error when route has not found', () => {
  const path = '/no_such_way';

  expect(() => { router.serve(path); }).toThrow();
});
