import { Link, useSearchParams } from "react-router-dom";
import { PLAYLISTS } from "../../data";
import { ChangeEvent } from "react";
import "./PlayListsPage.css";

export function PlayListsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchGenre = searchParams.get("searchGenre")?.toLowerCase() || "";
  const searchName = searchParams.get("searchName")?.toLowerCase() || "";

  const handleSearchGenre = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchParams({
      searchGenre: event.target.value.toLowerCase(),
      searchName: searchParams.get("searchName") || "",
    });
  };

  const handleSearchName = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchParams({
      searchGenre: searchParams.get("searchGenre") || "",
      searchName: event.target.value.toLowerCase(),
    });
  };

  const filteredList = PLAYLISTS.filter(
    (item) =>
      item.genre.toLowerCase().includes(searchGenre) &&
      item.name.toLowerCase().includes(searchName)
  );

  console.log("Filtered Playlists:", filteredList);

  return (
    <div className="playList">
      <h2>PlayListsPage</h2>
      <form name="filterList">
        <div className="playList__input">
          <label htmlFor="genre">Жанр:</label>
          <input id="genre" type="search" data-testid="genre-input" value={searchGenre} onChange={handleSearchGenre} />
        </div>
        <div className="playList__input">
          <label htmlFor="name">Название:</label>
          <input id="name" type="search" data-testid="name-input" value={searchName} onChange={handleSearchName} />
        </div>
      </form>
      <div className="list">
        {filteredList.length > 0 ? (
          filteredList.map((item) => (
            <Link className="listLink" data-testid="playlist-link" to={`/playlist/${item.id}`} key={item.id}>
              {item.name}
            </Link>
          ))
        ) : (
          <span data-testid="empty-list">Список пуст</span>
        )}
      </div>
    </div>
  );
}
