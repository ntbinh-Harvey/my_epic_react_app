/* eslint-disable no-undef */
import * as auth from 'auth-provider';
import { server, rest } from 'test/server';
import client from 'utils/api-client';

const apiUrl = process.env.REACT_APP_API_URL;
jest.mock('auth-provider');

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  const endpoint = 'test-endpoint';
  const mockResult = { mockValue: 'VALUE' };
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => res(ctx.json(mockResult))),
  );
  const result = await client(endpoint);
  expect(result).toEqual(mockResult);
});

test('adds auth token when a token is provided', async () => {
  const mockToken = 'FakeToken';
  const endpoint = 'test-endpoint-token';
  let request;
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json('Success'));
    }),
  );
  await client(endpoint, { token: mockToken });
  expect(request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
});

test('allows for config overrides', async () => {
  const endpoint = 'test-endpoint-override';
  let request;
  server.use(
    rest.put(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json('Success'));
    }),
  );
  const customConfig = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  await client(endpoint, customConfig);
  expect(request.headers.get('Content-Type')).toBe(
    customConfig.headers['Content-Type'],
  );
});

test('when data is provided, it is stringified and the method defaults to POST', async () => {
  const endpoint = 'test-endpoint-post';
  let request;
  const mockData = {
    name: 'Binh',
    age: 20,
  };
  server.use(
    rest.post(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json('Success'));
    }),
  );
  await client(endpoint, { data: mockData });
  expect(request.body).toEqual(mockData);
});

test('Automatically log the users out if we have a status code 401', async () => {
  const endpoint = 'test-endpoint-401';
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => res(ctx.status(401), ctx.json('Success'))),
  );
  const result = await client(endpoint).catch((e) => e);

  expect(result.message).toMatchInlineSnapshot('"Please re-authenticate."');
  expect(auth.logout).toHaveBeenCalledTimes(1);
});

test('Correctly reject when there is an error', async () => {
  const endpoint = 'test-endpoint-reject-promise';
  const testError = { testError: 'testError' };
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => res(ctx.status(400), ctx.json(testError))),
  );
  await expect(client(endpoint)).rejects.toEqual(testError);
});
