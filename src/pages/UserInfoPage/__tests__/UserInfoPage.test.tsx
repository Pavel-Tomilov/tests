import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserInfoPage } from '../UserInfoPage';
import { useParams } from 'react-router-dom';
import { USERS } from '../../../data';
import { MemoryRouter } from 'react-router-dom'; 
import '@testing-library/jest-dom'; 

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('UserInfoPage', () => {
  it('отображает текст по умолчанию, если пользователь не найден', () => {
    (useParams as jest.Mock).mockReturnValue({ userId: '999' });

    render(
      <MemoryRouter>
        <UserInfoPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/пользователя с таким userId нет/i)).toBeInTheDocument();
  });

  it('отображает данные пользователя, если пользователь найден', () => {
    const existingUser = USERS[0];

    (useParams as jest.Mock).mockReturnValue({ userId: existingUser.id.toString() });

    render(
      <MemoryRouter>
        <UserInfoPage />
      </MemoryRouter>
    );

    expect(screen.getByText(existingUser.fullName)).toBeInTheDocument();

    expect(screen.getByText(existingUser.jobTitle)).toBeInTheDocument();

    expect(screen.getByText(existingUser.email)).toBeInTheDocument();

    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', existingUser.avatar);

    expect(screen.getByText(existingUser.bio)).toBeInTheDocument();

    if (existingUser.playlist) {
      expect(screen.getByText(existingUser.playlist.name)).toBeInTheDocument();
    }
  });
});