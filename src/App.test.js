import { render, screen } from '@testing-library/react';
import Workspace from './space/Workspace/Workspace';

test('renders learn react link', () => {
  render(<Workspace />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
