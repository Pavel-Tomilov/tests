import React from 'react';
import { render, screen } from '@testing-library/react';
import { PlayListInfoPage } from '../PlayListInfoPage';
import { useParams } from 'react-router-dom';
import { PLAYLISTS } from '../../../data';
import { MemoryRouter } from 'react-router-dom'; // Добавьте этот импорт
import '@testing-library/jest-dom'; // Добавьте этот импорт

// Мокаем useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('PlayListInfoPage', () => {
  it('отображает данные о плейлисте, если он доступен', () => {
    // Выбираем существующий плейлист из PLAYLISTS
    const existingPlaylist = PLAYLISTS[0];

    // Мокаем useParams, чтобы вернуть существующий playlistId
    (useParams as jest.Mock).mockReturnValue({ playlistId: existingPlaylist.id.toString() });

    // Рендерим компонент, обернутый в MemoryRouter
    render(
      <MemoryRouter>
        <PlayListInfoPage />
      </MemoryRouter>
    );

    // Проверяем, что отображается жанр плейлиста
    expect(screen.getByText(existingPlaylist.genre)).toBeInTheDocument();

    // Проверяем, что отображается название плейлиста
    expect(screen.getByText(existingPlaylist.name)).toBeInTheDocument();

    // Проверяем, что отображается количество песен
    const songElements = screen.getAllByText(/- .+/i); // Ищем все элементы, начинающиеся с "-"
    expect(songElements.length).toBe(existingPlaylist.songs.length);
  });
});