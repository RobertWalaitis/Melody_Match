import fetchMock from "jest-fetch-mock";

import {
  getProfiles,
  login,
  createProfile,
  likeSong,
  searchSongsByTitle
} from "../api";

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("Frontend API unit tests (mocked fetch)", () => {

  test("getProfiles returns profiles", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([{ profile_id: 1, profile_name: "Alice" }])
    );

    const profiles = await getProfiles();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(profiles[0].profile_name).toBe("Alice");
  });

  test("login sends credentials and returns success", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ success: true, profile_id: 1 })
    );

    const result = await login("Alice", "password");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/profiles/login"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "Alice",
          password: "password"
        })
      })
    );

    expect(result.success).toBe(true);
  });

  test("createProfile creates a new profile", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ success: true, profile_id: 2 })
    );

    const result = await createProfile("Bob", "1234");

    expect(fetch).toHaveBeenCalled();
    expect(result.profile_id).toBe(2);
  });

  test("likeSong sends user_id and song_id", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ success: true })
    );

    const result = await likeSong(1, 10);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/liked"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          user_id: 1,
          song_id: 10
        })
      })
    );

    expect(result.success).toBe(true);
  });

  test("searchSongsByTitle builds correct query string", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    await searchSongsByTitle("Hello", 1);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "/songs/search/title?title=Hello&user_id=1"
      )
    );
  });

});
