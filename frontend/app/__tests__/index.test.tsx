import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Home from '../index';

describe('Home Component', () => {
    it('renders the main title correctly', () => {
        render(<Home />);

        const titleElement = screen.getByText('PEC Event App');
        expect(titleElement).toBeTruthy();
    });

    it('renders the subtitle with React version info', () => {
        render(<Home />);

        const subtitleElement = screen.getByText('React 19 + React Native 0.79.5');
        expect(subtitleElement).toBeTruthy();
    });

    it('renders the test ref component', () => {
        render(<Home />);

        const testComponentTitle = screen.getByText('Ref Test Component');
        expect(testComponentTitle).toBeTruthy();
    });
}); 