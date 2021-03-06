import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';
import './Album.css';





class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      isPlaying: false,
      hoveredSong: null,
      currentTime: 0,
      duration: album.songs[0].duration,
      volume: 0,


    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }



  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleNextClick() {
    const currentI = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newI = Math.min(this.state.album.songs.length - 1, currentI + 1);
    const newTrack = this.state.album.songs[newI];
    this.setSong(newTrack)
    this.play();
  }

  onMouseEnter(song) {
    this.setState({ hoveredSong: song });
  }

  onMouseLeave(song) {
    this.setState({ hoveredSong: null });
  }

  showIcon(song, index) {
    if(this.state.currentSong === song && this.state.isPlaying === true) {
      return <span className="icon ion-md-pause"></span>
    } else if (this.state.hoveredSong === song){
        return <span className="icon ion-md-play"></span>
    }
      else {
        return <span>{index + 1}</span>
      }
  };

  componentDidMount(){
    this.eventListeners = {
       timeupdate: e => {
         this.setState({ currentTime: this.audioElement.currentTime });
       },
       durationchange: e => {
         this.setState({ duration: this.audioElement.duration });
       }
     };
     this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);

  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);

  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }


  volumeChange(e) {
    this.audioElement.volume = e.target.value;
    this.setState({ volume: e.target.value })
  }

  formatTime(time) {
    if (time) {
      let minutes = Math.floor(time/60)
      let seconds = Math.floor(time % 60)
      seconds = seconds < 10 ? "0" + seconds : seconds
        return minutes + ":" + seconds
    } else {
        return "-:--"
    }
  }




  render() {
    return (
      <section className="album">
        <section id="album-info" />
          <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
          <div>
          <table id="song-list">
           <colgroup >
             <col id="song-number-column" />
             <col id="song-title-column" />
             <col id="song-duration-column" />
           </colgroup>

            <tbody>
              {this.state.album.songs.map((song, index) => (
                <tr className="song" key={index} onClick={ () => this.handleSongClick(song) }
                   onMouseEnter={ () => this.onMouseEnter(song) } onMouseLeave={ () => this.onMouseLeave(null) } >
                   { this.showIcon(song, index) }

                  <td > {song.title}</td>
                  <td >{this.formatTime(song.duration)}</td>

                </tr>
              ))}

            </tbody>

          </table>
          </div>
          <PlayerBar
            isPlaying={ this.state.isPlaying }
            currentSong={ this.state.currentSong }
            currentTime={this.audioElement.currentTime}
            formatTime={(t) => this.formatTime(t)}
            duration={this.audioElement.duration}
            volume={this.state.volume}
            handleSongClick={() => this.handleSongClick(this.state.currentSong)}
            handlePrevClick={() => this.handlePrevClick()}
            handleNextClick={() => this.handleNextClick()}
            handleTimeChange={(e) => this.handleTimeChange(e)}
            volumeChange={(e) => this.volumeChange(e)}
           />
      </section>
    );
  }
}

export default Album;
