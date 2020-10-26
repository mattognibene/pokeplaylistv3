import React from 'react';
import fire from './res/fire.png';
import resistance from './res/resistance.png'
import normal from './res/normal.png'
import metal from './res/metal.png'
import psychic from './res/psychic.png'
import electric from './res/electric.png'
import ghost from './res/ghost.png'
import grass from './res/grass.png'
import fighting from './res/fighting.png'
import water from './res/water.png'
import './Card.css';

const ALBUM_FILTER = ['canadian', 'chicago', 'atl', 'dfw', 'east coast', 'west coast', 'boston', 'florida', 'miami', 'contemporary',
'modern', 'la', 'albany', 'ny']

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

const getType = (genre) => {
    if (genre) {
        if (genre.includes('emo') || genre.includes('punk')) {
            return ghost
        }
        else if (genre.includes('hip') || genre.includes('rap') || genre.includes('grime') || genre.includes('hard') || genre.includes('metal')) {
            return metal
        }
        else if (genre.includes('edm') || genre.includes('electro') || genre.includes('dubstep') || genre.includes('brostep') || genre.includes('latin')) {
            return electric
        }
        else if (genre.includes('pop')) {
            return psychic
        }
        else if (genre.includes('r&b')) {
            return fire
        }
        else if (genre.includes('indie')) {
            return water
        }
        else if (genre.includes('country') || genre.includes('folk')) {
            return grass
        }
        else if (genre.includes('rock')) {
            return fighting
        }
    }
    return normal
}

const getHolographicClass = (genre) => {
    if (genre) {
        if (genre.includes('emo') || genre.includes('punk')) {
            return 'holographic_emo'
        }
        else if (genre.includes('hip') || genre.includes('rap') || genre.includes('grime') || genre.includes('hard') || genre.includes('metal')) {
            return 'holographic_hip_hop'
        }
        else if (genre.includes('edm') || genre.includes('electro') || genre.includes('dubstep') || genre.includes('brostep') || genre.includes('latin')) {
            return 'holographic_electro'
        } 
        else if (genre.includes('pop')) {
            return 'holographic_pop'
        }
        else if (genre.includes('r&b')) {
            return 'holographic_rb'
        }
        else if (genre.includes('indie')) {
            return 'holographic_indie'
        }
        else if (genre.includes('country') || genre.includes('folk')) {
            return 'holographic_country'
        }
        else if (genre.includes('rock')) {
            return 'holographic_rock'
        }
    }
    return 'holographic_pop'
}

const getTextColor = (genre) => {
    if (genre) {
        if (genre.includes('indie')) {
            return '#000000'
        }
        if (genre.includes('hip') || genre.includes('rap') || genre.includes('grime') || genre.includes('hard') || genre.includes('metal') || genre.includes('rock') ||
        genre.includes('emo') || genre.includes('punk')) {
            return '#FFFFFF'
        }
    }
    return '#000000'
}

const getArtistName = (artistName, genre) => {
    let total_length = parseInt(1.2 * artistName.length) + cleanGenre(genre).length
    if (total_length > 35) {
        return artistName.substring(0, parseInt((35 - cleanGenre(genre).length) / 1.2) - 1) + "..."
    } else {
        return artistName
    }
}

const removeParentheses = (string) => {
    return string.replace(/ *\([^)]*\) */g, "").replace(/ *\[[^)]*\] */g, '')
  }

const formatTracks = (tracks) => {
    let cleaned = tracks.map(track => removeParentheses(track)).join(', ')
    if (cleaned.length > 100) {
        return cleaned.substring(0, 97) + "..."
    } else {
        return cleaned
    }
}

const cleanGenre = (genre) => {
    if (genre) {
        var cleaned = genre
        ALBUM_FILTER.forEach ((country) => {
            cleaned = cleaned.replace(country + ' ', '')
        })
        return cleaned
    }
    return ""
}

const getAlbums = (albums, genre) => {
    const albumsRows = []
    var image = getType(genre)
    const powers = [100, 80, 60, 120, 90]
    albums.forEach(albumItem => {
        let album = albumItem.album
        if (albumsRows.length < 2) {
            var power = powers[Math.floor(Math.random() * powers.length)];
            albumsRows.push(
            <div className="ability">
                <img className="ability_type" src={image} style={{left:'20px'}}/>
                <img className="ability_type" src={image} style={{left:'48px'}}/>
                <p className="title" style={{color: getTextColor(genre)}}>{album.name}</p>
                <p className="power" style={{color: getTextColor(genre)}}>{power}</p>
                <p className="description" style={{color: getTextColor(genre)}}>{formatTracks(albumItem.tracks)}</p>
            </div>
            )
            image = normal
        }
    });
    return albumsRows
}

const Card = ({genre, artistName, imageUrl, popularity, followers, albums, cardStyle, favoriteTrack}) => 
        <div className="card_border" style={cardStyle}>
          <div className={"card " + getHolographicClass(genre)}>
            <div className="header_container">
                <div className="genre_container">
                    { cleanGenre(genre) }
                </div>
                <p className="artist_name header_item" style={{color: getTextColor(genre)}}>{getArtistName(artistName, genre)}</p>
                <p className="hp header_item" style={{color: getTextColor(genre)}}>HP</p>
                <p className="hp_value header_item" style={{color: getTextColor(genre)}}>170</p>
                <img className="type header_item" src={getType(genre)}/>
            </div>
            <div className="artist_container">
              <img className="artist" src={imageUrl}/>
              <p id="artist_description"></p>
            </div>
            {getAlbums(albums, genre)}
            <div id="bottom_container">
                <div className="favorite_track" style={{color: getTextColor(genre)}}>{favoriteTrack}</div>
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