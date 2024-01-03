import Head from "next/head";
import { Text, Link, Navbar, Spacer, Divider, Button, Card, Modal, Dropdown, Loading, Input} from "@nextui-org/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router"
import data from "../props/data.json"
import axios from "axios";
import React from "react"


const Music = (name, index, currently_playing, SetCurrentlyPlaying, groupname, SetAvailableSongs, setGroup, songs, SetEditingSong, group) => {
    return (
        <>
        <Card css={{p:"$5", bgBlur:"$backgroundAlpha", border:"1px solid white", width:"400px"}} isPressable isHoverable onClick={()=>{
            if (index===-1) {
                index=group.songs.length-1
            }
            SetEditingSong({visibility:false, song:{"name":"", "start":0, "stop":0, "fade_in":0, "fade_out":0}, playing: false})
            setTimeout(SetEditingSong({visibility:true, song:{"name":name, "start":group.songs[index].start, "stop":group.songs[index].stop, "fade_in":group.songs[index].fade_in, "fade_out":group.songs[index].fade_out}, playing: false}))
        }}>
            <Card.Header>
                <div style={{width:(index==-1 || index==0) ? "100%" : "50%"}}><Text>{name}</Text></div>
                {index!=-1 ? <div style={{width:"15%"}}>
                    <Button color={""} auto css={{margin:"5px", padding: "", float:"right"}} onClick={()=>{
                        if (index===-1) {
                            index=group.songs.length-1
                        }
                    axios.get(data.api_url+"/song_action?group="+groupname+"&song="+name+"&action=minus").then(()=>{
                        axios.get(data.api_url+"/group?group="+groupname).then((x)=>{
                            setGroup(x.data)
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
                    })
                }}><Text color="black">-</Text></Button>
                </div> : ""}
                {index!=0 ? <div style={{width:"15%"}}>
                    <Button color={""} auto css={{margin:"5px", padding: "", float:"right"}} onClick={()=>{
                        if (index===-1) {
                            index=group.songs.length-1
                        }
                    axios.get(data.api_url+"/song_action?group="+groupname+"&song="+name+"&action=plus").then(()=>{
                        axios.get(data.api_url+"/group?group="+groupname).then((x)=>{
                            setGroup(x.data)
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
                    })
                }}><Text color="black">+</Text></Button>
                </div> : ""}
                <div style={{width:"20%", float:"right"}}><Button bordered auto onClick={()=>{
                    if (index===-1) {
                        index=group.songs.length-1
                    }
                    if (currently_playing!==name) {
                        SetCurrentlyPlaying(name)
                        SetEditingSong({visibility:false, song:{"name":"", "start":0, "stop":0, "fade_in":0, "fade_out":0}, playing: false})
                        setTimeout(SetEditingSong({visibility:false, song:{"name":name, "start":group.songs[index].start, "stop":group.songs[index].stop, "fade_in":group.songs[index].fade_in, "fade_out":group.songs[index].fade_out}, playing: true}), 100)
                    } else {
                        SetCurrentlyPlaying("")
                        setTimeout(SetEditingSong({visibility:false, song:{"name":name, "start":group.songs[index].start, "stop":group.songs[index].stop, "fade_in":group.songs[index].fade_in, "fade_out":group.songs[index].fade_out}, playing: false}), 100)
                    }
                }}><Text>{currently_playing==name ? "Pause" : "Play"}</Text></Button></div>
            </Card.Header>
        </Card>
        </>
    )
}

export default function Home() {
    const router=useRouter()
    const [groupname, setGroupName]=useState("")
    const [uploading_song, SetUploadingSong]=useState(false)
    const [available_songs, SetAvailableSongs]=useState([])
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
            setGroup(x.data)
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
    if (JSON.stringify(group)!=="{}" && groupname!=="")
    return (
        <>
            <Head>
                <title></title>
            </Head>
            <audio id="audio"></audio>
            <audio id="audio2"></audio>
            <Navbar isBordered isCompact variant="sticky" css={{bgBlur: "#000000"}}>
                <Navbar.Brand>
                    <Text h3>Shaadi</Text>
                </Navbar.Brand>
                <Navbar.Content activeColor="secondary">
                <Navbar.Item><Button auto bordered color=""><Link color="text" href="/">Home</Link></Button></Navbar.Item>
                </Navbar.Content>
            </Navbar>

            <Text h2 className="wrapper">Group: {groupname}</Text>
            <Spacer y={2}></Spacer>
            <Text h2 className="wrapper">Songs</Text>
            <Spacer></Spacer>
            <div className="wrapper">
                <Button onClick={()=>{
                    SetAddSong(true)
                }}><Text color="black">Add Song</Text></Button>
                <Spacer></Spacer>
                <Button onClick={()=>{
                    axios.get(data.api_url+"/remove_group?group="+groupname).then(()=>{
                        window.location="/"
                    })
                }} color={"error"}><Text>Delete Group</Text></Button>
            </div>
            <Modal
            open={add_song}
            onClose={()=>{
                SetAddSong(false)

            }}
            >
            <Modal.Header>
                <Text h2>Add Song</Text>
            </Modal.Header>
            <Modal.Body>
            <Dropdown>
                <Dropdown.Button flat>{selected_song}</Dropdown.Button>
                <Dropdown.Menu aria-label="Static Actions" 
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selected_song}
                onSelectionChange={(x)=>{
                    SetSelectedSong(available_songs[Number(x.values().next().value.split(".")[1])])
                }}>
                    {songs.filter((x)=>{
                        var res=true
                        group.songs.forEach(element => {
                            if (res===true) {
                                if (element.name===x) {
                                    res=false
                                }
                            }
                        })
                        return res
                    }).map((x)=>{
                        return (
                            <Dropdown.Item>{x}</Dropdown.Item>
                        )
                    })}
                </Dropdown.Menu>
                </Dropdown>
                <div className="wrapper">
                    {uploading_song ? "" : <Button onClick={()=>{
                        if (selected_song=="Select Song") {
                            return
                        }
                        SetUploadingSong(true)
                        axios.get(data.api_url+"/add_song_to_group?group="+groupname+"&song="+selected_song).then((x)=>{
                            SetUploadingSong(false)
                            SetAddSong(false)
                            axios.get(data.api_url+"/group?group="+groupname).then((x)=>{
                                setGroup(x.data)
                                var y=x
                                SetAvailableSongs(songs.filter((x)=>{
                                    var res=true
                                    y.data.songs.forEach(element => {
                                        if (res===true) {
                                            if (element.name===x) {
                                                res=false
                                            }
                                        }
                                    })
                                    return res
                                }))
                            })
                        })
                    }}><Text color="black">Add Song</Text></Button>}
                    {uploading_song ? <Loading></Loading> : ""}
                </div>
            </Modal.Body>
            </Modal>
            <Spacer></Spacer>
            <div className="wrapper">
                <div>
                    {group.songs.map((x, index)=>{
                        if (index+1==group.songs.length) {
                            index=-1
                        }
                        return (
                            <>
                            {Music(x.name, index, currently_playing, SetCurrentlyPlaying, groupname, SetAvailableSongs, setGroup, songs, SetEditingSong, group)}
                            <Spacer></Spacer>
                            </>
                        )
                    })}
                </div>
            </div>
            <Modal
            open={editing_song.visibility}
            onClose={()=>{
                SetEditingSong({visibility:false, song:{"name":"", "start":0, "stop":0, "fade_in":0, "fade_out":0}, playing: false})
            }}
            >
            <Modal.Header><Text h2>Editing Song</Text></Modal.Header>
            <Modal.Body>
                <Text className="vertical">{editing_song.song.name}</Text>
                <label>Start</label>
                <Input bordered id="start" value={editing_song.song.start}></Input>
                <label>Stop</label>
                <Input bordered id="stop" value={editing_song.song.stop}></Input>
                <label>Fade in</label>
                <Input bordered id="fadein" value={editing_song.song.fade_in}></Input>
                <label>Fade out</label>
                <Input bordered id="fadeout" value={editing_song.song.fade_out}></Input>
            </Modal.Body>
            <Modal.Footer>
                <Button color={"success"} onClick={()=>{
                    var ed=editing_song
                    ed.playing=!ed.playing
                    ed.song.start=Number(document.getElementById("start").value)
                    ed.song.stop=Number(document.getElementById("stop").value)
                    ed.song.fade_in=Number(document.getElementById("fadein").value)
                    ed.song.fade_out=Number(document.getElementById("fadeout").value)
                    SetEditingSong(ed)
                    if (editing_song.song.name===currently_playing) {
                        SetCurrentlyPlaying("")
                    } else {
                        SetCurrentlyPlaying(editing_song.song.name)
                    }
                }} id="aoishf">{editing_song.song.name===currently_playing ? "Pause" : "Preview"}</Button>
                {saving ? <Loading></Loading> : ""}
                {saving ? "" : <Button onClick={()=>{
                    setSaving(true)
                    var start=(document.getElementById("start").value)
                    var stop=(document.getElementById("stop").value)
                    var fade_in=(document.getElementById("fadein").value)
                    var fade_out=(document.getElementById("fadeout").value)
                    axios.get(data.api_url+"/set_song?song="+editing_song.song.name+"&group="+groupname+"&fadein="+fade_in+"&fadeout="+fade_out+"&start="+start+"&stop="+stop).then((x)=>{
                        axios.get(data.api_url+"/group?group="+groupname).then((x)=>{
                            setGroup(x.data)
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
                        setSaving(false)
                        SetEditingSong({visibility:false, song:{"name":"", "start":0, "stop":0, "fade_in":0, "fade_out":0}, playing: false})
                    })
                }}><Text color="black">Save</Text></Button>}
                <Button color={"error"} onClick={()=>{
                    axios.get(data.api_url+"/remove_song?group="+groupname+"&song="+editing_song.song.name).then((x)=>{
                        axios.get(data.api_url+"/group?group="+groupname).then((x)=>{
                            setGroup(x.data)
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
                        SetEditingSong({visibility:false, song:{"name":"", "start":0, "stop":0, "fade_in":0, "fade_out":0}, playing: false})
                    })
                }}>Remove</Button>
            </Modal.Footer>
            </Modal>
            {editing_song.playing ? <AudioPlayer src={data.api_url+"/song?song="+editing_song.song.name+".mp3"} fadeInDuration={editing_song.song.fade_in} fadeOutDuration={editing_song.song.fade_out} startTime={editing_song.song.start} endTime={editing_song.song.stop}></AudioPlayer> : ""}
        </> 
    )
}

const AudioPlayer = ({ src, fadeInDuration, fadeOutDuration, startTime, endTime }) => {
    const audioContext = useRef(null);
    const audioRef = useRef(null);
  
    useEffect(() => {
      const initAudio = async () => {
        // Initialize AudioContext only once
        if (!audioContext.current) {
          audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        }
  
        // Create a new audio element for each playback
        const audio = new Audio();
        audioRef.current = audio;
  
        // Set crossOrigin attribute for both audio and media source node
        audio.crossOrigin = 'anonymous';
  
        // Create audio nodes
        const source = audioContext.current.createMediaElementSource(audio);
        const gainNode = audioContext.current.createGain();
  
        source.connect(gainNode);
        gainNode.connect(audioContext.current.destination);
  
        // Set initial volume to 0
        gainNode.gain.setValueAtTime(0, audioContext.current.currentTime);
  
        // Fade in
        gainNode.gain.linearRampToValueAtTime(1, audioContext.current.currentTime + fadeInDuration);
  
        // Start playing at the specified start time
        audio.src = src;
        audio.currentTime = startTime;
  
        // Schedule the end of playback
        audio.addEventListener('ended', () => {
          // Fade out
          gainNode.gain.linearRampToValueAtTime(0, audioContext.current.currentTime + fadeOutDuration);
        });
  
        // Play the audio
        try {
          await audio.play();
        } catch (error) {
          console.error('Error initiating playback:', error);
        }
  
        // Stop playback at the specified end time
        setTimeout(() => {
          if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
          }
        }, (endTime - startTime) * 1000);
      };
  
      // Call the function to initialize and play audio
      initAudio();
  
      // Cleanup on component unmount
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      };
    }, [src, fadeInDuration, fadeOutDuration, startTime, endTime]);
  
    return null; // Since this is a utility component
  };