import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Luna Chatbot title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Luna Chatbot/i);
    expect(titleElement).toBeInTheDocument();
});