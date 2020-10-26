import React from 'react';
import Deck from './Deck';
import NetworkModule from './SpotifyNetworkModule'
import sample from './res/sample.png'
import './App.css';

export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = "453ceedee5f94e42a7dc49bb1c00b5df";
const redirectUri =  "https://mattognibene.github.io/pokeplaylistv3";
const scopes = [
    "user-top-read"
];
// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";

class App extends React.Component {

    componentDidMount() {
        // Set token
        let _token = hash.access_token;
        if (_token) {
            // Set token
            this.setState({
                token: _token
            });            
        }
    }
    constructor(props) {
        super(props)
        this.state =  {}
    }

    render() {
        return (
            <div>
            
                {!this.state.token && (
                    <div className="login_container">
                        <h1>PokéPlaylist</h1>
                        <h3>Get your favorite artists as Pokémon cards.</h3>
                        <a
                        className="btn"
                        href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
                        >
                        Login to Spotify
                        </a>
                        <div className="sample_container">
                            <img className='sample' src={sample} />
                        </div>
                        <div className="created_by_container">Created by <a className="created_by_link" href="https://www.mattognibene.com">Matt Ognibene</a></div>
                        </div>
                )}
                {this.state.token && (
                    <Deck bearer={this.state.token}/> 
                )
                }
            </div>
            
        )
    }
}

export default App;
