import React from 'react';
import Card from './Card'
import NetworkModule from './SpotifyNetworkModule'
import './Deck.css';

async function getArtistInfo(artistId, bearer) {
  var promise= NetworkModule.getData("https://api.spotify.com/v1/artists/" + artistId, bearer)
  .then(data => {
    return {
      genre : data.genres[0],
      name : data.name,
      imageUrl : data.images[0].url,
      popularity: data.popularity,
      followers: data.followers.total
    }
  })
  return await promise
}

async function getArtistAlbums(artistId, bearer) {
  var promise= NetworkModule.getData('https://api.spotify.com/v1/artists/' + artistId + '/albums?limit=50', bearer)
  .then(data => {
    let items = data.items
    let albums = []
    items.forEach(function(album) {
        if (album.album_type === "album" && albums.length < 2) {
          albums.push({name: album.name, spotifyId: album.id})
        } 
    });
    return albums
  })

  const albums = await promise
  const tracksPromises = []
  albums.forEach(async function (album) {
    let albumPromise = NetworkModule.getData('https://api.spotify.com/v1/albums/' + album.spotifyId + '/tracks', bearer)
    .then(data => {
      let items = data.items
      let tracks = []
      items.forEach(function(track) {
          if (tracks.length < 6) {
            tracks.push(track.name)
          }
      });
      return tracks
    })
    tracksPromises.push(albumPromise)
  })
  let tracks = await Promise.all(tracksPromises)
  const albumsTracksCombined = []

  for (var i = 0; i < albums.length; i++) {
    albumsTracksCombined.push({album: albums[i], tracks: tracks[i]})
  }
  return albumsTracksCombined
}

class Deck extends React.Component {

  componentDidMount () {
    console.log(this.props.artistIds)
    
    getArtistInfo(this.props.artistIds[0], this.props.bearer).then(data => this.setState({firstArtistInfo: data}))
    getArtistAlbums(this.props.artistIds[0], this.props.bearer).then(data => this.setState({firstArtistAlbums: data}))
    
    getArtistInfo(this.props.artistIds[1], this.props.bearer).then(data => this.setState({secondArtistInfo: data}))
    getArtistAlbums(this.props.artistIds[1], this.props.bearer).then(data => this.setState({secondArtistAlbums: data}))

    getArtistInfo(this.props.artistIds[2], this.props.bearer).then(data => this.setState({thirdArtistInfo: data}))
    getArtistAlbums(this.props.artistIds[2], this.props.bearer).then(data => this.setState({thirdArtistAlbums: data}))
  }

  constructor(props) {
    super(props)
    this.state =  {
      // firstArtistInfo: {},
      // firstArtistAlbums: [],
      // secondArtistInfo: {},
      // secondArtistAlbums: [],
      // thirdArtistInfo: {},
      // thirdArtistAlbums: [],
    }
  }

  render() {
    return (
      <div className="deck_container">
        {this.state.thirdArtistInfo && this.state.thirdArtistAlbums && (
        <Card
          genre={this.state.thirdArtistInfo.genre}
          artistName={this.state.thirdArtistInfo.name}
          imageUrl={this.state.thirdArtistInfo.imageUrl}
          popularity={this.state.thirdArtistInfo.popularity}
          followers={this.state.thirdArtistInfo.followers}
          albums={this.state.thirdArtistAlbums}
          cardStyle={{left: '375px', zIndex: 1, top: '50px', transform: 'rotate(30deg)'}}
          />
        )}
        {this.state.secondArtistInfo && this.state.secondArtistAlbums && (
        <Card
          genre={this.state.secondArtistInfo.genre}
          artistName={this.state.secondArtistInfo.name}
          imageUrl={this.state.secondArtistInfo.imageUrl}
          popularity={this.state.secondArtistInfo.popularity}
          followers={this.state.secondArtistInfo.followers}
          albums={this.state.secondArtistAlbums}
          cardStyle={{left: '-375px', marginTop: '-648px', zIndex: 1, transform: 'rotate(-30deg)'}}
          />
        )}
        
        {this.state.firstArtistInfo && this.state.firstArtistAlbums && (
        <Card
          genre={this.state.firstArtistInfo.genre}
          artistName={this.state.firstArtistInfo.name}
          imageUrl={this.state.firstArtistInfo.imageUrl}
          popularity={this.state.firstArtistInfo.popularity}
          followers={this.state.firstArtistInfo.followers}
          albums={this.state.firstArtistAlbums}
          cardStyle={{left: '0px', marginTop: '-760px', zIndex: 2}}
          />
        )}
      </div>
    );
  }
}
export default Deck;