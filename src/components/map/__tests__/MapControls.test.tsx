
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MapControls from '../MapControls';

describe('MapControls Component', () => {
  it('displays the correct number of routes', () => {
    render(<MapControls routesCount={42} />);
    expect(screen.getByText('Routes: 42')).toBeInTheDocument();
  });

  it('shows origin and destination legends', () => {
    render(<MapControls routesCount={10} />);
    expect(screen.getByText('Origins')).toBeInTheDocument();
    expect(screen.getByText('Destinations')).toBeInTheDocument();
  });

  it('displays validated status when validated is true', () => {
    render(<MapControls routesCount={10} validated={true} />);
    expect(screen.getByText('Data Validated')).toBeInTheDocument();
  });

  it('displays validation failed status when validated is false', () => {
    render(<MapControls routesCount={10} validated={false} />);
    expect(screen.getByText('Validation Failed')).toBeInTheDocument();
  });

  it('shows the correct data source', () => {
    render(<MapControls routesCount={10} dataSource="test_data.csv" />);
    expect(screen.getByText('Source: test_data.csv')).toBeInTheDocument();
  });

  it('uses default values when props are not provided', () => {
    render(<MapControls routesCount={10} />);
    expect(screen.getByText('Data Validated')).toBeInTheDocument();
    expect(screen.getByText('Source: deeptrack_3.csv')).toBeInTheDocument();
  });
});
