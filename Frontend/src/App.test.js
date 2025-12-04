import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Travel Guide home hero', () => {
  render(<App />);
  const cta = screen.getByRole('button', { name: /Start Exploring/i });
  expect(cta).toBeInTheDocument();
});
