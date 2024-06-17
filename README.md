# React Router to Remix

Incrementally migrating from React Router v6.3.0 vite app to Remix.

shadcn/ui for components.

MSW for mocking the api calls.

@tanstack/react-query in the mix.

Some steps in migrating intentionally have some poorly implemented stuff for demo purposes.

- https://reactrouter.com/en/main/start/tutorial

- https://remix.run/docs/en/main/guides/spa-mode#what-is-spa-mode

- https://tanstack.com/query/latest/docs/framework/react/examples/react-router

- https://remix.run/docs/en/main/guides/migrating-react-router-app

## Setup

> If you want to commit and push your work as you go, you'll want to
> [fork](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo)
> first and then clone your fork rather than this repo directly.

Choose whatever package manager you want (I am using pnpm) and install packages.

```shell
pnpm i
```

## Running the app

To get the app up and running (and really see if it worked), run:

```shell
pnpm dev
```

### Authenticating in the app

Hardcoded user in app.

Username: admin@admin.com,
Password: admin.

Change it if you want so you can work with multiple users.

### Migrating steps by commits

1. [initial app with router 6.3.0](https://github.com/stevan-borus/old-router-to-remix/commit/9c0a9cc050be2fc4e2025a69b337d03987acd9d6)

   - initial app setup with React Router v6.3.0, tailwind, shadcn components, zustand and msw for mocking api calls
   - useEffects for fetching data
   - when mutating data changes are not visible until refresh is hit
   - formik and yup for forms and validation
   - zustand stores authenticated user

2. [react-query](https://github.com/stevan-borus/old-router-to-remix/commit/79dca1b33e01580b72517414aa91a514d62b1931)

   - @tanstack/react-query setup and using it for fetching and mutating data instead of useEffects
   - no more stale data after mutations

3. [react router 6.23.1, w/o react query](https://github.com/stevan-borus/old-router-to-remix/commit/ad87b58116347089766ce74bbdd9bf9c4c72d0eb)

   - using new RouterProvider with loader and action functions on Route objects for fetching and mutating data
   - protected routes handled through loaders instead of `ProtectedRoute` component
   - zod and tiny-invariant for validating data instead of yup
   - removed formik since state is not needed while working with actions and form
   - added error boundaries

4. [react router with react query](https://github.com/stevan-borus/old-router-to-remix/commit/afc421a8b9daf4d473a6272f31e2ba5234bfaceb)

   - using react-query alongside new router

5. [react router to remix spa](https://github.com/stevan-borus/old-router-to-remix/commit/7666f5b0d8cb23c6226657d83726db7a632600a0)

   - using [Hydrating a div instead of the full document](https://remix.run/docs/en/main/guides/spa-mode#hydrating-a-div-instead-of-the-full-document) approach
   - [manual route config](https://remix.run/docs/en/main/file-conventions/vite-config#routes) via vite.config.ts

6. [root layout and meta for routes](https://github.com/stevan-borus/old-router-to-remix/commit/2edbf6558c7c297262f515b47f0f1e2ec6bc3c29)

   - hydrating full HTML document
   - `Layout` in root.tsx
   - using meta

7. [remix spa with react query](https://github.com/stevan-borus/old-router-to-remix/commit/e9f162b66648f678e57a600cab5a8e2ea09c27dc)

   - using react-query alongside remix spa mode

8. [spa mode to remix](https://github.com/stevan-borus/old-router-to-remix/commit/285d83b837cb97249e9e2214595e8186420a747e)

   - remix-auth for authentication, removed zustand store
   - msw on server
   - removed localforage, working with in-memory notes - will get reset to initial values when server is restarted!
