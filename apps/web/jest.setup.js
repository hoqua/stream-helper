// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.SKIP_ENV_VALIDATION = 'true';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
}));
