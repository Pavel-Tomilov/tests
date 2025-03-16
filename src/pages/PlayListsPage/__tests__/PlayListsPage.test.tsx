import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PlayListsPage } from "../PlayListsPage";
import { useSearchParams } from "react-router-dom";
import "@testing-library/jest-dom";

// Мокаем useSearchParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: jest.fn(),
}));

// Мокаем данные плейлистов
jest.mock("../../../data/playlists", () => ({
  PLAYLISTS: require("../../../../mocks/playlistsMock").PLAYLISTS,
}));

describe("PlayListsPage", () => {
  it("вызывает setSearchParams при вводе жанра", () => {
    const setSearchParamsMock = jest.fn();
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams(),
      setSearchParamsMock,
    ]);

    render(
      <MemoryRouter>
        <PlayListsPage />
      </MemoryRouter>
    );

    const genreInput = screen.getByTestId("genre-input");
    fireEvent.change(genreInput, { target: { value: "rock" } });

    expect(setSearchParamsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        searchGenre: "rock",
        searchName: "",
      })
    );
  });

  it("вызывает setSearchParams при вводе названия", () => {
    const setSearchParamsMock = jest.fn();
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams(),
      setSearchParamsMock,
    ]);

    render(
      <MemoryRouter>
        <PlayListsPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByTestId("name-input");
    fireEvent.change(nameInput, { target: { value: "great" } });

    expect(setSearchParamsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        searchGenre: "",
        searchName: "great",
      })
    );
  });

  it("фильтрует плейлисты по жанру и названию", () => {
    const setSearchParamsMock = jest.fn();
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams({ searchGenre: "rock", searchName: "great" }),
      setSearchParamsMock,
    ]);

    render(
      <MemoryRouter>
        <PlayListsPage />
      </MemoryRouter>
    );

    // Проверяем, что отображается только один плейлист с названием "Great Rock Hits"
    const playlistLinks = screen.queryAllByTestId("playlist-link");
    expect(playlistLinks).toHaveLength(1); // Ожидаем только один плейлист

    // Проверяем название плейлиста
    expect(screen.getByText("Great Rock Hits")).toBeInTheDocument();
  });

  it("отображает сообщение 'Список пуст', если плейлисты не найдены", () => {
    const setSearchParamsMock = jest.fn();
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams({ searchGenre: "unknown", searchName: "unknown" }),
      setSearchParamsMock,
    ]);

    render(
      <MemoryRouter>
        <PlayListsPage />
      </MemoryRouter>
    );

    // Проверяем, что отображается сообщение "Список пуст"
    expect(screen.getByTestId("empty-list")).toBeInTheDocument();
  });

  it("фильтрует плейлисты по жанру 'Jazz'", () => {
    const setSearchParamsMock = jest.fn();
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams({ searchGenre: "jazz", searchName: "" }),
      setSearchParamsMock,
    ]);

    render(
      <MemoryRouter>
        <PlayListsPage />
      </MemoryRouter>
    );

    // Проверяем, что отображаются плейлисты с жанром "Jazz"
    const playlistLinks = screen.queryAllByTestId("playlist-link");
    expect(playlistLinks.length).toBeGreaterThan(0); // Ожидаем хотя бы один плейлист

    // Проверяем, что все отображаемые плейлисты имеют жанр "Jazz"
    playlistLinks.forEach((link) => {
      const playlist = require("../../../../mocks/playlistsMock").PLAYLISTS.find(
        (p: any) => p.name === link.textContent
      );
      expect(playlist?.genre.toLowerCase()).toBe("jazz");
    });
  });

  it("фильтрует плейлисты по названию 'Country'", () => {
    const setSearchParamsMock = jest.fn();
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams({ searchGenre: "", searchName: "country" }),
      setSearchParamsMock,
    ]);

    render(
      <MemoryRouter>
        <PlayListsPage />
      </MemoryRouter>
    );

    // Проверяем, что отображаются плейлисты с названием, содержащим "Country"
    const playlistLinks = screen.queryAllByTestId("playlist-link");
    expect(playlistLinks.length).toBeGreaterThan(0); // Ожидаем хотя бы один плейлист

    // Проверяем, что все отображаемые плейлисты содержат "Country" в названии
    playlistLinks.forEach((link) => {
      expect(link.textContent?.toLowerCase()).toContain("country");
    });
  });
});