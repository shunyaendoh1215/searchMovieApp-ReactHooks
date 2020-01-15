import React, { useReducer, useEffect } from "react";
// import React, { useState, useEffect } from "react";
import "../App.css";
import Header from "./Header";
import Movie from "./Movie";
import Search from "./Search";

const MOVIE_API_URL = "https://www.omdbapi.com/?s=man&apikey=f844e6a8";

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // //? useStateは配列に対して使い、[state, setState]で指定する
  // const [loading, setLoading] = useState(true);
  // const [movies, setMovies] = useState([]);
  // const [errorMessage, setErrorMessage] = useState([null]);

  //? componentDidMount、componentDidUpdateとcomponentWillUnmountの組み合わせ
  //? XMLHttpRequestよりモダンなメソッドHTTPリクエストが簡単に行える
  useEffect(() => {
    fetch(MOVIE_API_URL)
      .then(response => response.json())
      .then(jsonResponse => {
        // setMovies(jsonResponse.Search);
        // setLoading(false);
        dispatch({
          type: "SEARCH_MOVIES_SUCCESS",
          payload: jsonResponse.Search
        });
      });
  }, []); //? 第二引数は監視の対象: 今回は対象無し => 最初の一回のみ動作

  const search = searchValue => {
    // setLoading(true);
    // setErrorMessage(null);

    dispatch({
      type: "SEARCH_MOVIES_REQUEST"
    });
    fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=f844e6a8`)
      .then(response => response.json)
      .then(jsonResponse => {
        if (jsonResponse.Response === "True") {
          // setMovies(jsonResponse.Search);
          // setLoading(false);

          dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonResponse.Search
          });
        } else {
          // setErrorMessage(jsonResponse.Error);
          // setLoading(false);

          dispatch({
            type: "SEARCH_MOVIES_FAILURE",
            error: jsonResponse.Error
          });
        }
      });
  };

  const { movies, errorMessage, loading } = state;

  return (
    <div className="App">
      <Header text="HOOKED" />
      <Search search={search} />
      <p className="App-intro">Sharing a few of our favorite movies</p>
      <div className="movies">
        {loading && !errorMessage ? (
          <span>loading...</span>
        ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
          movies.map((movie, index) => (
            <Movie key={`${index}-${movie.Title}`} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
