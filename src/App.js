import React from 'react';
import Deck from './Deck';
import NetworkModule from './SpotifyNetworkModule'
import './App.css';

export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = "62c2f22951254954a357ada4001660b6";
const redirectUri = "https://mattognibene.github.io/pokeplaylistv3"; //'http://localhost:3000'//
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

async function getTopArtists(bearer) {
    var promise= NetworkModule.getData('https://api.spotify.com/v1/me/top/artists?time_range=medium_term', bearer)
    .then(data => {
        let items = data.items
        let artistIds = []
        for(var i = 0; i < 3; i++) {
            artistIds.push(items[i].id)
        }
        return artistIds
    })
    return await promise
}

class App extends React.Component {

    componentDidMount() {
        // Set token
        let _token = hash.access_token;
        if (_token) {
            // Set token
            this.setState({
                token: _token
            });
            console.log(_token)
            getTopArtists(_token).then(data => this.setState({artistIds: data}))
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
                    <a
                    className="btn btn--loginApp-link"
                    href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
                    >
                    Login to Spotify
                    </a>
                )}
                {this.state.token && this.state.artistIds &&(
                    <Deck bearer={this.state.token} artistIds={this.state.artistIds}/> 
                )
                /*<Deck bearer='BQBLJUOLLpHDoSNJFx5cvayY90C-GsqkZ_NTjvnOabCQK7PKwsLZZVSE2WemltIW1RyrHuTdKQUwSIcoiCxenBYFg3OBsbHKFT2VZ4HPAvOnaZkJe3Meupm_3m-4xtXCUwmsbj2U_ztpUMtIdWsHfQvU7cQm4y25jUk5WLXg'
                    artistIds={['2HSEdXKVq1WWtBbsIeNjRX', '1UTPBmNbXNTittyMJrNkvw', '7wg1qvie3KqDNQbAkTdbX0']} /> 
                */}
            </div>
            
        )
    }
}

export default App;
