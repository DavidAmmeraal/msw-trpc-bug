import { createTRPCMsw } from 'msw-trpc';
import { setupServer } from 'msw/node';
import { AppRouter } from './server/routers/_app';
import assert from 'node:assert/strict';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { transformer } from './utils/transformer';
const server = setupServer();

const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: 'http://localhost/trpc' })],
  transformer,
});

export const trpcMsw = createTRPCMsw<AppRouter>({
  baseUrl: 'http://localhost/trpc',
});

server.use(
  trpcMsw.post.byId.query((req, res, ctx) => {
    assert.equal(req.getInput(), { id: '1' });

    return res(
      ctx.status(200),
      ctx.data({
        id: '1',
        title: 'test',
        text: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
  }),
);

server.listen();

(async () => {
  await client.post.byId.query({ id: '1' });
})();
