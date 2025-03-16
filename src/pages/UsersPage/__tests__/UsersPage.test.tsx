import { render, screen, fireEvent } from '@testing-library/react';
import { UsersPage } from '../UsersPage';
import { useSearchParams } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom'; 
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn(),
}));

describe('UsersPage', () => {
  it('вызывает setSearchParam при вводе имени пользователя', () => {
    
    const setSearchParamMock = jest.fn();
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams(), 
      setSearchParamMock, 
    ]);

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>
    );

    const input = screen.getByLabelText('введите имя');

    fireEvent.change(input, { target: { value: 'John' } });
  
    expect(setSearchParamMock).toHaveBeenCalledWith({ searchName: 'john' });
  });

  it('фильтрует пользователей по имени', () => {
    const setSearchParamMock = jest.fn();
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams({ searchName: 'abraham' }), 
      setSearchParamMock,
    ]);

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>
    );

    const userLinks = screen.getAllByRole('link');
    expect(userLinks).toHaveLength(1); 
    expect(userLinks[0]).toHaveTextContent('Abraham Walsh'); 
  });
});