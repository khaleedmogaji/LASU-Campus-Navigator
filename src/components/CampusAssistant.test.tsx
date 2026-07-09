
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CampusAssistant } from './CampusAssistant';
import { POI } from '../types';

// Mock timers for typing delays
vi.useFakeTimers();

const mockPois: POI[] = [
  {
    id: '1',
    name: 'Senate Building',
    latitude: 6.4664,
    longitude: 3.2003,
    category: 'Administrative',
    description: 'Babatunde Raji Fashola Senate Building',
  }
];

describe('CampusAssistant Component', () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  it('should render floating assistant chat button when closed', () => {
    const onNavigate = vi.fn();
    render(
      <CampusAssistant
        pois={mockPois}
        onNavigate={onNavigate}
        externalOpen={false}
        isSearchOpen={false}
      />
    );

    // Floating button should be visible
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should render welcome message and suggested chips when chat assistant is opened', () => {
    const onNavigate = vi.fn();
    render(
      <CampusAssistant
        pois={mockPois}
        onNavigate={onNavigate}
        externalOpen={true}
        isSearchOpen={false}
      />
    );

    // Welcome message should be displayed
    expect(screen.getByText(/I'm your LASU Campus Assistant/i)).toBeInTheDocument();

    // Suggestion chips should be displayed
    expect(screen.getByText('Where is Computer Science?')).toBeInTheDocument();
    expect(screen.getByText('Where is LT1?')).toBeInTheDocument();
  });

  it('should allow user to type and send messages, rendering assistant response after simulated delay', () => {
    const onNavigate = vi.fn();
    render(
      <CampusAssistant
        pois={mockPois}
        onNavigate={onNavigate}
        externalOpen={true}
        isSearchOpen={false}
      />
    );

    // Type a query
    const input = screen.getByPlaceholderText(/Ask about departments/i);
    fireEvent.change(input, { target: { value: 'where is computer science?' } });
    
    // Submit query
    const form = screen.getByRole('textbox').closest('form');
    expect(form).not.toBeNull();
    if (form) {
      fireEvent.submit(form);
    }

    // Verify user message appears in UI
    expect(screen.getByText('where is computer science?')).toBeInTheDocument();

    // Fast-forward simulated typing delay inside act
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Check that assistant reply is rendered
    expect(screen.getByText(/📍 Computer Science/i)).toBeInTheDocument();
  });
});
