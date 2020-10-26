import React from 'react';
import Deck from './Deck';
import NetworkModule from './SpotifyNetworkModule'
import sample from './res/sample.png'
import './App.css';

export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = "62c2f22951254954a357ada4001660b6";
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
            console.log(_token) // TODO remove
            
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
                        <div>Created by <a className="created_by_link" href="https://www.mattognibene.com">Matt Ognibene</a></div>
                        </div>
                )}
                
                {this.state.token && (
                    <Deck bearer={this.state.token}/> 
                )
                /*<Deck bearer='BQC3ouKLIZSE1Csp1hyffkrfIy_QeYhNtNFwEBfYhdkM6EbWp8sBjBwOeDKA3mkGNFHwfS8Q8kiBRSRwr63W733VRSsuUMKDgglTWLE9HZruy6CrqA7ciIjpQaQyVsPm2cF5FLPtmK-sIn-n6RZ9jX4Hl7wQEMSNcc8m4FSQ'
                    artistIds={['04gDigrS5kc9YWfZHwBETP', '1UTPBmNbXNTittyMJrNkvw', '2kCcBybjl3SAtIcwdWpUe3']} /> */ 
                }
            </div>
            
        )
    }
}

export default App;
