import { configure } from '@testing-library/dom';

// Configure testing library
configure({ testIdAttribute: 'data-testid' });

// Extend Jest matchers for Testing Library
import '@testing-library/jest-dom';
