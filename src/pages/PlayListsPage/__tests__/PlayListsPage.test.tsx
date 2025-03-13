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
    fireEvent.change(nameInput, { target: { value: "best" } });

    expect(setSearchParamsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        searchGenre: "",
        searchName: "best",
      })
    );
  });

  it("фильтрует плейлисты по жанру и названию", () => {
    const setSearchParamsMock = jest.fn();
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams({ searchGenre: "rock", searchName: "best" }),
      setSearchParamsMock,
    ]);

    render(
      <MemoryRouter>
        <PlayListsPage />
      </MemoryRouter>
    );

    // Проверяем, что отображаются только отфильтрованные плейлисты
    const playlistLinks = screen.queryAllByTestId("playlist-link");
    expect(playlistLinks).toHaveLength(1); // Ожидаем только один плейлист

    // Проверяем название плейлиста
    expect(screen.getByText("Best Rock Hits")).toBeInTheDocument();
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
});
