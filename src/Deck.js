import React from 'react';
import Card from './Card'
import NetworkModule from './SpotifyNetworkModule'
import './Deck.css';
import './App.css';
import * as htmlToImage from 'html-to-image';
import { toPng } from 'html-to-image';
import download from 'downloadjs'

const cleanAlbumName = (albumName) => {
  let cleanName = removeParentheses(albumName)
  if (cleanName.length > 33) {
    cleanName = cleanName.substring(0, 30) + "..."
  }
  return cleanName
}

async function getTopArtists(bearer, timeRange) {
  var promise= NetworkModule.getData('https://api.spotify.com/v1/me/top/artists?time_range=' + timeRange, bearer)
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
    let seen = []
    items.forEach(function(album) {
        if (album.album_type === "album" && albums.length < 2 && !album.name.toLowerCase().includes('live')) {
          let cleanName = cleanAlbumName(album.name)
          if (seen.indexOf(cleanName) < 0) {
            albums.push({name: cleanName, spotifyId: album.id})
            seen.push(cleanName)
          }
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

const removeParentheses = (string) => {
  return string.replace(/ *\([^)]*\) */g, "").replace(/ *\[[^)]*\] */g, "")
}

const getTimeRangeString = (timeRange) => {
  if (timeRange == "short_term") {
    return "over the last month"
  } else if (timeRange == "medium_term") {
    return "over the last six months"
  } else {
    return "of all time"
  }
}
const downloadImage = () => {
  var node = document.getElementById('deck_container');
 
  htmlToImage.toPng(node)
    .then(function (dataUrl) {
      download(dataUrl, 'pokeplaylist.png');
    })
    .catch(function (error) {
      console.error('oops, something went wrong!', error);
    });
}
class Deck extends React.Component {

  updateState = (timeRange, bearer) => {
    getTopArtists(bearer, timeRange).then((artistIds) => {
      this.state.timeRange = timeRange
      if (artistIds[0]) {
        getArtistInfo(artistIds[0], bearer).then(data => this.setState({firstArtistInfo: data}))
        getArtistAlbums(artistIds[0], bearer).then(data => this.setState({firstArtistAlbums: data}))
      }
      
      if (artistIds[1]) {
        getArtistInfo(artistIds[1], bearer).then(data => this.setState({secondArtistInfo: data}))
        getArtistAlbums(artistIds[1], bearer).then(data => this.setState({secondArtistAlbums: data}))
      }
      
      if (artistIds[2]) {
        getArtistInfo(artistIds[2], bearer).then(data => this.setState({thirdArtistInfo: data}))
        getArtistAlbums(artistIds[2], bearer).then(data => this.setState({thirdArtistAlbums: data}))
      }
    });
  }

  componentDidMount () {  
    this.updateState('medium_term', this.props.bearer)
  }

  constructor(props) {
    super(props)
    this.state =  {
      scale: Math.min(1, window.innerWidth / 1600), // todo hardcoded
      bearer: this.props.bearer
    }
  }

  render() {
    return (
      <div>
        <div className="results">
          <div className="time_container">
            <div className="btn" onClick={() => this.updateState('short_term', this.state.bearer)}>Last Month</div>
            <div className="btn" onClick={() => this.updateState('medium_term', this.state.bearer)}>Last 6 Months</div>
            <div className="btn" onClick={() => this.updateState('long_term', this.state.bearer)}>All Time</div>
          </div>
          {this.state.firstArtistInfo && (
            <h1>{this.state.firstArtistInfo.name}, I choose you!</h1>
          )}
          <h3>Your top 3 artists {getTimeRangeString(this.state.timeRange)}.</h3>
        </div>
        <div className="scale_container" style={{height:parseInt(this.state.scale * 765).toString() + 'px'}}>
          <div id="deck_container" style={{transform: 'scale(' + this.state.scale + ')'}}> 
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
          <div className="results">
              {/* <div style={{marginTop: '100px'}} className="btn" onClick={() => downloadImage()}>Download Image</div> */}
              <h4 style={{marginTop: '10px'}}>Created with PokéPlaylist</h4>
            </div>
        </div>
      </div>
    );
  }
}
export default Deck;