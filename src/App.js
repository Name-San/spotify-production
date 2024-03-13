import './App.css';
import { useState, useEffect, useRef } from "react";


function App() {
  const CLIENT_ID = "47010e28220345c18ce0ddf8b9ee9d47"
  const REDIRECT_URI = "http://localhost:3000/"
  const AUTH_ENDPOINT = "https:/accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"


  const [spotifydata, setSpotifyData] = useState([])
  const [searchKey, setSearchKey] = useState("")
  const [token, setToken] = useState("")
  const [tokenStatus, setTokenStatus] = useState(true)
  const [dataType, setDataType] = useState("artist")

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

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token")
  }

  const search = async (e) => {
    e.preventDefault();   
    try {
      const datafetch = await fetchData(searchKey, token, dataType);
      const type = `${dataType}s`;
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
    handleToken(response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} data`);
    }
    return await response.json();
  }

  const handleToken = async (status) => {
    if (status === 401) {
      setTokenStatus(false);
      throw new Error('Token expired');
    } else {
      setTokenStatus(true);
    }
  }

  const renderFetchData = () => {
    return spotifydata.map(d => (
        <div key={d.id}>
          {d.images.length ? <img width={"100%"} src={d.images[0].url} alt=""/> : <div>No Image</div>}
          {d.name}
        </div>
      )) 
  }

  return (
    <div className="App"> 
      <header className="App-header">
        <h1>Spotify Production</h1>
        {token ? 
          <form onSubmit={search}>
            <input type="text" onChange={e => setSearchKey(e.target.value)}></input>
            <button type={"submit"}>Search</button>            
          </form>
          : <h4>Authorize your spotify account</h4>
        }
        {!token ? <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
          : <button className="btn" onClick={logout}>Logout</button>
        }
        {!tokenStatus ? <h2>Please re-authorize your spotify account</h2> : <></>}

        {renderFetchData()}
        
      </header>
    </div>
  );
}


export default App;
