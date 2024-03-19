import './App.css';
import { useState, useEffect } from "react";


function LoginPage({auth_endpoint, client_id, redirect_uri, response_type}) {
  return(
    <a href={`${auth_endpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}`}>
      Login to Spotify
    </a>
  );
}

function SpotifyUI({logout, search, searchKey, setSearchKey, setSearchType}) {


  return(
    <div>
      <form onSubmit={search}>
        <input type="text" onChange={e => setSearchKey(e.target.value)} value={searchKey}></input>
        <button type={"submit"}>Search</button> 
        <button className="btn" onClick={logout}>Logout</button>           
      </form>
      <div className="search-type">
        <button className='btn' onClick={e => setSearchType("album")}>Album</button>
        <button className='btn' onClick={e => setSearchType("artist")}>Artist</button>
        <button className='btn' onClick={e => setSearchType("playlist")}>Playlist</button>
        <button className='btn' onClick={e => setSearchType("track")}>Track</button>
      </div>
    </div>
    );
}

function App() {
  const CLIENT_ID = "47010e28220345c18ce0ddf8b9ee9d47"
  const REDIRECT_URI = "http://localhost:3000/"
  const AUTH_ENDPOINT = "https:/accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  //useStates
  const [spotifydata, setSpotifyData] = useState([])
  const [searchKey, setSearchKey] = useState("")
  const [token, setToken] = useState("")
  const [searchType, setSearchType] = useState("")

  //cycles
  useEffect(() => {
    
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith("access_token")).split("=")[1]
      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }
    
    setToken(token)
  }, [])

  //functions
  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token")
  }

  const search = async (e) => {
    
    e.preventDefault();   
    try {
      const datafetch = await fetchData(searchKey, token, searchType);
      const type = `${searchType}s`;
      //console.log(datafetch)
      setSpotifyData(datafetch[type].items);
      
        
    } catch (error) {
      console.error('Error searching for artist:');
    }
  }

  const fetchData = async (searchKey, token, type) => {
    const apiURL = `https://api.spotify.com/v1/search?q=${searchKey}&type=${type}`
    console.log(apiURL);
    const response = await fetch(apiURL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} data`);
    }
    return await response.json();
  }

  const renderFetchData = () => {
    console.log(spotifydata);
    /*
    const frame = spotifydata.map(d => (
        <div key={d.id}>
          {d.album.images.length ? <img src={d.album.images[0]} width="100%" alt={d.name}></img> : "" }
          <a href={d.external_urls.spotify}>{d.name}</a>
        </div>
      )) 
    return frame; **/
  }

  return (
    <div className="App"> 
      <header className="App-header">
        <h1>Spotify Production</h1>
        {token ?
          <SpotifyUI logout={logout} search={search} setSearchKey={setSearchKey} searchKey={searchKey} setSearchType={setSearchType}/>
          : <LoginPage auth_endpoint={AUTH_ENDPOINT} client_id={CLIENT_ID} redirect_uri={REDIRECT_URI} response_type={RESPONSE_TYPE}/>
        }

        {renderFetchData()}
        
      </header>
    </div>
  );
}


export default App;
