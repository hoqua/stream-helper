import React from 'react';
import { render } from '@testing-library/react';
import Page from '../src/app/page';

// jest.setup.js
jest.mock('@clerk/nextjs', () => ({
  // keep other exports if needed
  useUser: () => ({ isSignedIn: false }),
  ClerkProvider: ({ children }) => <div>{children}</div>, // optional stub
}));

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
