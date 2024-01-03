import Head from "next/head";
import { Text, Link, Navbar, Spacer, Divider, Button, Card, Modal, Dropdown, Loading, Input} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router"
import data from "../props/data.json"
import axios from "axios";
import React from "react"

export default function Home() {
    const router=useRouter()
    const [groupname, setGroupName]=useState("")
    const [uploading_song, SetUploadingSong]=useState(false)
    const [available_songs, SetAvailableSongs]=useState([])
    const [audios, setAudios]=useState([])
    const [editing_song, SetEditingSong]=useState({visibility:false, song:{"name":"", "start":0, "stop":0, "fade_in":0, "fade_out":0}, playing: false})
    useEffect(()=>{
        if (router.query.group!==undefined) {
            setGroupName(router.query.group)
        }
    })
    const [add_song, SetAddSong]=useState(false)
    const [songs, setSongs]=useState([])
    const [first, setFirst]=useState(true)
    const [currently_playing, SetCurrentlyPlaying]=useState()
    const [selected_song, SetSelectedSong]=useState("Select Song")
    const [group, setGroup]=useState({})
    const [saving, setSaving]=useState(false)
    if (first) {
        axios.get(data.api_url+"/songs").then((x)=>{
            setSongs(x.data)
        })
        setFirst(false)
    }
    if (JSON.stringify(group)==="{}" && groupname!=="") {
        axios.get(data.api_url+"/group?group="+groupname).then((x)=>{
            var group=x.data
            x.data.songs.forEach((x, index)=>{
                group.songs[index].url=data.api_url+"/song?song="+group.songs[index].name+".mp3"
            })
            setGroup(group)
            var y=x.data
            SetAvailableSongs(songs.filter((x)=>{
                var res=true
                y.songs.forEach(element => {
                    if (res===true) {
                        if (element.name===x) {
                            res=false
                        }
                    }
                })
                return res
            }))
        })
    }
    const [practicing, setPracting]=useState(false)
    const [playing, setPlaying]=useState(false)
    if (JSON.stringify(group)!=="{}" && groupname!=="")
    return (
        <>
        <Navbar isBordered isCompact variant="sticky" css={{bgBlur: "#000000"}}>
            <Navbar.Brand>
                <Link href="/"><Text h3>Shaadi</Text></Link>
            </Navbar.Brand>
            <Navbar.Content activeColor="secondary">
            <Navbar.Item><Button auto bordered color=""><Link color="text" href="/">Home</Link></Button></Navbar.Item>
            </Navbar.Content>
        </Navbar>
        <Text h1 className="wrapper">{groupname}</Text>
        <div className="wrapper">
        {playing ? <Loading></Loading> : ""}
        {playing ? "" : <Button onClick={()=>{
            setPlaying(true)
            axios.get(data.api_url+"/export_group?group="+groupname).then(()=>{
              setPlaying(false)
              window.location=data.api_url+"/song?song="+encodeURIComponent("group_export"+groupname+".mp3")
            })
        }}><Text color="black">Export Group Song</Text></Button>}
        </div>
        {practicing ? 
        <AudioPlayer
        songs={group.songs}
        isPlaying={playing}
        setAudios={setAudios}
        audios={audios}
        ></AudioPlayer>
        : ""}
        </>
    )
}

class AudioPlayer extends React.Component {
    state = {
        currentSongIndex: 0,
        currentAudio: null,
        isPlaying: this.props.isPlaying,
        setAudios: this.props.setAudios,
        audios: this.props.audios
      };
    
      componentDidMount() {
        this.playAudioWithFadeInOut(
          this.props.songs[this.state.currentSongIndex].url,
          this.props.songs[this.state.currentSongIndex].fade_in,
          this.props.songs[this.state.currentSongIndex].fade_out,
          this.props.songs[this.state.currentSongIndex].start,
          this.props.songs[this.state.currentSongIndex].stop
        );
      }
    
      componentDidUpdate(prevProps, prevState) {
        const { isPlaying, currentSongIndex } = this.state;
      
        if (prevProps.isPlaying !== isPlaying) {
          if (isPlaying) {
            // If play state changes to true, start or resume playback
            this.playAudioWithFadeInOut(
              this.props.songs[currentSongIndex].url,
              this.props.songs[currentSongIndex].fade_in,
              this.props.songs[currentSongIndex].fade_out,
              this.props.songs[currentSongIndex].start,
              this.props.songs[currentSongIndex].stop
            );
          } else {
            // If play state changes to false, pause playback and reset audio
            this.state.currentAudio.pause();
            this.state.currentAudio.currentTime = 0;
          }
        }
      
        if (prevState.currentSongIndex !== currentSongIndex) {
          // If the current song changes, play the new song
          this.playAudioWithFadeInOut(
            this.props.songs[currentSongIndex].url,
            this.props.songs[currentSongIndex].fade_in,
            this.props.songs[currentSongIndex].fade_out,
            this.props.songs[currentSongIndex].start,
            this.props.songs[currentSongIndex].stop
          );
        }
      }

      playAudioWithFadeInOut(url, fadeInDuration, fadeOutDuration, startTime, endTime) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audio = new Audio();
        this.state.setAudios([...this.state.audios, audio])
        
        const source = audioContext.createMediaElementSource(audio);
        const gainNode = audioContext.createGain();
    
        audio.crossOrigin = 'anonymous';
        source.crossOrigin = 'anonymous';
    
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
    
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + fadeInDuration);
    
        audio.src = url;
        audio.currentTime = startTime;
    
        audio.addEventListener('ended', () => {
          gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeOutDuration);
          this.playNextSong();
        });
    
        if (this.state.isPlaying) {
          audio.play();
        }
    
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
          this.playNextSong()
        }, (endTime - startTime) * 1000);
    
        this.setState({ currentAudio: audio });
      }
    
      playNextSong() {
        const { songs } = this.props;
        const { currentSongIndex } = this.state;
    
        if (currentSongIndex + 1 < songs.length) {
          this.setState({ currentSongIndex: currentSongIndex + 1 });
        } else {
          this.setState({ currentSongIndex: 0, isPlaying: false });
        }
      }
    
      componentWillUnmount() {
        if (this.state.currentAudio) {
          this.state.currentAudio.pause();
          this.state.currentAudio.currentTime = 0;
        }
      }
    
    render () {

    }
}