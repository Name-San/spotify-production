import './App.css';
import { useState, useEffect } from "react";


function App() {
  const CLIENT_ID = "0b8aa71e7eaf40f3b2c384199c421a08"
  const REDIRECT_URI = "http://localhost:3000/"
  const AUTH_ENDPOINT = "https:/accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"


  const [artist, setArtist] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [token, setToken] = useState("")
  
  useEffect(() => {
    
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith("access_token")).split("=")[1]
      //token = 'BQBCj9LehjUoJBaNPGF3OAMmh-_bApSauqiWBFM05Xb6mdVPHluuoYxAEjtV3vRtLci61a8dd9-ABu-VrAnS74HsCEYhJPt0WVArFZQ3BERa4fgt1LvwGosFdHt3mJcdtwcbkjdlHGfZmq20KU-6TL5ikqQVUgg54QLVpqgUgOHv35sbffeRQPZOAEzoBzR1_fg'
      console.log(token)
      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }
    
    setToken(token)
  }, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const searchArtists = async (e) => {
    e.preventDefault();
    try {
      const artistData = await fetchArtistData(searchKey, token);
      console.log(`Artist data: ${artistData}`)
      
      
    } catch (error) {
      console.error('Error searching for aritst:', error.message);
      alert('Error searching for track. Please try again.');
    }
  }

  const fetchArtistData = async (searchKey, token) => {
    const apiURL = `https://api.spotify.com/v1/search?q=${searchKey}&type=artist`

    const response = await fetch(apiURL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch artist data');
    }
    return await response.json();
  }

  return (
    <div className="App"> 
      <header className="App-header">
        <h1>Spotify Production</h1>
        {!token ? <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
          : <button onClick={logout}>Logout</button>
        }
        {token ?
          <form onSubmit={searchArtists}>
            <input type="text" onChange={e => setSearchKey(e.target.value)}></input>
            <button type={"submit"}>Search</button>
          </form>
          : <h2>Please login</h2>

        }

      </header>
    </div>
  );
}


export default App;
