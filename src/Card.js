import React from 'react';
import fire from './res/fire.png';
import resistance from './res/resistance.png'
import normal from './res/normal.png'
import './Card.css';

const ALBUM_LOCATIONS = ['canadian', 'chicago', 'atl', 'dfw']

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const getResistance = (popularity) => {
    let num = 0
    if (popularity >= 75) {
        num = 3
    } else if (popularity >= 50) {
        num = 2
    } else if (popularity >= 25) {
        num = 1
    }

    const items = []
    var left = 20; // TODO so much hardcoded shit
    for (var i = 0; i < num; i++) { 
        items.push(<img className="resistance" src={resistance} style={{left:left}}/>)
        left += 25
    }
    return <div>{items}</div>
} 

const removeParentheses = (string) => {
    return string.replace(/ *\([^)]*\) */g, "").replace(/ *\[[^)]*\] */g, '')
  }

const formatTracks = (tracks) => {
    return tracks.map(track => removeParentheses(track)).join(', ')
}

const cleanGenre = (genre) => {
    var cleaned = genre
    ALBUM_LOCATIONS.forEach ((country) => {
        cleaned = cleaned.replace(country + ' ', '')
    })
    return cleaned
}

const getAlbums = (albums) => {
    const albumsRows = []
    var image = fire
    const powers = [100, 80, 60, 120, 90]
    albums.forEach(albumItem => {
        let album = albumItem.album
        if (albumsRows.length < 2) {
            var power = powers[Math.floor(Math.random() * powers.length)];
            albumsRows.push(
            <div className="ability">
                <img className="ability_type" src={image} style={{left:'20px'}}/>
                <img className="ability_type" src={image} style={{left:'48px'}}/>
                <p className="title">{album.name}</p>
                <p className="power">{power}</p>
                <p className="description">{formatTracks(albumItem.tracks)}</p>
            </div>
            )
            image = normal
        }
    });
    return albumsRows
}

const Card = ({genre, artistName, imageUrl, popularity, followers, albums, cardStyle}) => 
        <div className="card_border" style={cardStyle}>
          <div className="card holographic">
            <div className="header_container">
              <div className="genre_container">
                { cleanGenre(genre) }
              </div>
            <p className="artist_name header_item">{artistName}</p>
            <p className="hp header_item">HP</p>
            <p className="hp_value header_item">170</p>
            <img className="type header_item" src={fire}/>
            </div>
            <div className="artist_container">
              <img className="artist" src={imageUrl}/>
              <p id="artist_description"></p>
            </div>
            {getAlbums(albums)}
            <div id="bottom_container">
                <div id="line_seperator"/>
                <div id="bottom_stats">
                    <div className="bottom_item popularity">
                        <p className="title bottom_title">Popularity</p>
                        <p className="description bottom_sub">{popularity} / 100</p>
                    </div>
                    <div className="bottom_item followers">
                        <p className="title bottom_title">Followers</p>
                        <p className="description bottom_sub">{numberWithCommas(followers)}</p>
                    </div>
                    <div className="resistance_container">
                        {getResistance(followers)}
                    </div>
                </div>
            </div>
          </div>
        </div>
export default Card