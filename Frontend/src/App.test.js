import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Travel Guide home title', () => {
  render(<App />);
  const title = screen.getByText(/Travel Guide/i);
  expect(title).toBeInTheDocument();
});
