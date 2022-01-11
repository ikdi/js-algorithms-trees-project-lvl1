import { test, expect, beforeAll } from '@jest/globals';
import makeRouter from '../src/index.js';

const routes = [
  {
    method: 'GET',
    path: '/courses',
    handler: () => 'courses!',
  },
  {
    method: 'GET',
    path: '/courses/:id',
    handler: (id) => `course: ${id}`,
  },
  {
    method: 'GET',
    path: '/courses/:course_id/exercises/:id',
    handler: () => 'get exercise!',
  },
  {
    method: 'POST',
    path: '/courses/:course_id/exercises/:id',
    handler: () => 'post exercise!',
  },
  {
    method: 'GET',
    path: '/lessons/:id/',
    handler: () => 'lessons!',
  },
  {
    method: 'GET',
    path: '/',
    handler: () => 'root!',
  },
];
let router = null;

beforeAll(() => {
  router = makeRouter(routes);
});

test('simple route search with default GET method', () => {
  const requestWithoutMethod = { path: '/courses' };
  const resultWithoutMethod = router.serve(requestWithoutMethod);

  const requestWithMethod = { path: '/courses', method: 'GET' };
  const resultWithMethod = router.serve(requestWithMethod);

  expect(resultWithoutMethod).toEqual(resultWithMethod);
});

test('route search with trailing slash', () => {
  const request = { path: '/courses/' };
  const result = router.serve(request);

  expect(result.handler()).toEqual('courses!');
});

test('root route search', () => {
  const request = { path: '/' };
  const result = router.serve(request);

  expect(result.handler()).toEqual('root!');
  expect(result.method).toEqual('GET');
});

test('dynamic route search get', () => {
  const request = { path: '/courses/js/exercises/100', method: 'GET' };
  const result = router.serve(request);

  expect(result.handler()).toEqual('get exercise!');
  expect(result.params).toEqual({ course_id: 'js', id: '100' });
  expect(result.path).toEqual('/courses/:course_id/exercises/:id');
  expect(result.method).toEqual('GET');
});

test('dynamic route search post', () => {
  const request = { path: '/courses/js/exercises/200', method: 'POST' };
  const result = router.serve(request);

  expect(result.handler()).toEqual('post exercise!');
  expect(result.params).toEqual({ course_id: 'js', id: '200' });
  expect(result.path).toEqual('/courses/:course_id/exercises/:id');
  expect(result.method).toEqual('POST');
});
test('simple route search', () => {
  const request = { path: '/courses' };
  const result = router.serve(request);

  expect(result.handler()).toEqual('courses!');
  expect(result.method).toEqual('GET');
});

test('throw an error when path does not exist', () => {
  const request = { path: '/no_such_way' };

  expect(() => { router.serve(request); }).toThrow();
});

test('throw an error when path exists but founded method does not', () => {
  const request = { path: '/courses/js/exercises/100', method: 'DELETE' };

  expect(() => { router.serve(request); }).toThrow();
});
