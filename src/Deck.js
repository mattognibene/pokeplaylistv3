import React from 'react';
import Card from './Card'
import NetworkModule from './SpotifyNetworkModule'

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
    getArtistInfo(this.props.artistId, this.props.bearer).then(data => this.setState({artistInfo: data}))
    getArtistAlbums(this.props.artistId, this.props.bearer).then(data => this.setState({artistAlbums: data}))
  }

  constructor(props) {
    super(props)
    this.state =  {
      artistInfo: {genre: "", name:"", imageUrl:"", popularity: 0, followers: 0},
      artistAlbums: []
    }
  }

  render() {
    return (
      <div>
        <Card 
          genre={this.state.artistInfo.genre}
          artistName={this.state.artistInfo.name}
          imageUrl={this.state.artistInfo.imageUrl}
          popularity={this.state.artistInfo.popularity}
          followers={this.state.artistInfo.followers}
          albums={this.state.artistAlbums}
          />
      </div>
    );
  }
}

export default Deck;