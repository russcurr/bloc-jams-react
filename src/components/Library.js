import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import albumData from './../data/albums';
import './Library.css';




class Library extends Component {
  constructor(props) {
    super(props)
    this.state = { albums: albumData };
  }




  render() {
    return (
      <section className='library'>
      {
        this.state.albums.map( (album, index ) =>
          <Link to={`/album/${album.slug}`} key={index}>
            <img src={album.albumCover} alt={album.title}/>
            <div id="album">{album.title} </div>
            <div id="artist">{album.artist}</div>
            <div id="song-info">{album.songs.length} songs</div>

          </Link>

        )
      }
      <div></div>
      </section>
    );
  }
}

export default Library;
