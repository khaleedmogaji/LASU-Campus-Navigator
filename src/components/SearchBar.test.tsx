import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SearchBar } from './SearchBar';
import { POI } from '../types';

const mockPois: POI[] = [
  {
    id: '1',
    name: 'Senate Building',
    latitude: 6.4664,
    longitude: 3.2003,
    category: 'Administrative',
    description: 'Babatunde Raji Fashola Senate Building',
  },
  {
    id: '2',
    name: 'Akesode Library',
    latitude: 6.4650,
    longitude: 3.1990,
    category: 'Library',
    description: 'Main Library',
  }
];

describe('SearchBar Component', () => {
  it('should render input field and categories', () => {
    const setSearchQuery = vi.fn();
    const setFilterCategory = vi.fn();
    const onSelect = vi.fn();

    render(
      <SearchBar
        pois={mockPois}
        filterCategory="All"
        setFilterCategory={setFilterCategory}
        onSelect={onSelect}
        searchQuery=""
        setSearchQuery={setSearchQuery}
        isOpen={true}
      />
    );

    // Search input is rendered
    const input = screen.getByPlaceholderText(/Search buildings/i);
    expect(input).toBeInTheDocument();
  });

  it('should show suggestions when user types a query', () => {
    const setSearchQuery = vi.fn();
    const setFilterCategory = vi.fn();
    const onSelect = vi.fn();

    // Rerender with a query matching one of our mock POIs
    const { rerender } = render(
      <SearchBar
        pois={mockPois}
        filterCategory="All"
        setFilterCategory={setFilterCategory}
        onSelect={onSelect}
        searchQuery=""
        setSearchQuery={setSearchQuery}
        isOpen={true}
      />
    );

    // Update the query prop
    rerender(
      <SearchBar
        pois={mockPois}
        filterCategory="All"
        setFilterCategory={setFilterCategory}
        onSelect={onSelect}
        searchQuery="Senate"
        setSearchQuery={setSearchQuery}
        isOpen={true}
      />
    );

    // Suggestions matching "Senate" should appear
    expect(screen.getByText('Senate Building')).toBeInTheDocument();
    expect(screen.queryByText('Akesode Library')).not.toBeInTheDocument();
  });
});
