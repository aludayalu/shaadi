import Head from "next/head";
import { Text, Link, Navbar, Spacer, Divider, Button, Card, Input, Modal, Loading} from "@nextui-org/react";
import data from "../props/data.json"
import { useState } from "react";
import axios from "axios";

const Music = (name, currently_playing, SetCurrentlyPlaying) => {
    return (
        <>
        <Card css={{p:"$5", bgBlur:"$backgroundAlpha", border:"1px solid white", width:"400px"}}>
            <Card.Header>
                <div style={{width:"80%"}}><Text>{name}</Text></div>
                <div style={{width:"20%"}}><Button bordered auto onClick={()=>{
                    if (currently_playing!==name) {
                        SetCurrentlyPlaying(name)
                        document.getElementById("audio").src=data.api_url+"/song?song="+name+".mp3"
                        document.getElementById("audio").play()
                        document.getElementById("audio").loop=true
                    } else {
                        SetCurrentlyPlaying("")
                        document.getElementById("audio").pause()
                        document.getElementById("audio").loop=false
                    }
                }}><Text>{currently_playing==name ? "Pause" : "Play"}</Text></Button></div>
            </Card.Header>
        </Card>
        </>
    )
}

export default function Home() {
    const [add_song, SetAddSong]=useState(false)
    const [uploading_song, SetUploadingSong]=useState(false)
    const [first, setFirst]=useState(true)
    const [songs, setSongs]=useState([])
    const [currently_playing, SetCurrentlyPlaying]=useState()
    const [search, SetSearch]=useState("")
    if (first) {
        axios.get(data.api_url+"/songs").then((x)=>{
            setSongs(x.data)
        })
        setFirst(false)
    }
    return (
        <>
            <Head>
                <title></title>
            </Head>
            <audio id="audio"></audio>
            <Navbar isBordered isCompact variant="sticky" css={{bgBlur: "#000000"}}>
                <Navbar.Brand>
                    <Link href="/"><Text h3>Shaadi</Text></Link>
                </Navbar.Brand>
                <Navbar.Content activeColor="secondary">
                <Navbar.Item><Button auto bordered color=""><Link color="text" href="/">Home</Link></Button></Navbar.Item>
                </Navbar.Content>
            </Navbar>

            <Text h2 className="wrapper">Songs</Text>
            <Spacer y={2}></Spacer>
            <div className="wrapper">
                <Button color={""} onClick={()=>{
                    SetAddSong(true)
                }}><Text color="black">Upload Song</Text></Button>
            </div>
            <Spacer></Spacer>
            <div className="wrapper">
                <Input bordered placeholder="Search Song" width="400px" onChange={(x)=>{
                    SetSearch(x.target.value)
                }}></Input>
            </div>
            <Modal
            open={add_song}
            onClose={()=>{
                SetAddSong(false)
            }}
            >
            <Modal.Header><Text h2>Add Song</Text></Modal.Header>
            <Modal.Body>
                <Input placeholder="Song Name to save song as" bordered width="100%" id="name"></Input>
                <Input placeholder="Youtube or Instagram URL" bordered width="100%" id="url"></Input>
                <div className="wrapper">
                    {uploading_song ? "" : <Button color={""} onClick={()=>{
                        SetUploadingSong(true)
                        axios.get(data.api_url+"/upload?name="+encodeURIComponent(document.getElementById("name").value)+"&url="+encodeURIComponent(document.getElementById("url").value)).then((x)=>{
                            if (x.data) {
                                SetUploadingSong(false)
                                SetAddSong(false)
                                axios.get(data.api_url+"/songs").then((x)=>{
                                    setSongs(x.data)
                                })
                            } else {
                                SetUploadingSong(false)
                            }
                        })
                    }}><Text color="black">Add Song</Text></Button>}
                    {uploading_song ? <Loading></Loading> : ""}
                </div>
            </Modal.Body>
            </Modal>
            <Spacer></Spacer>
            <div className="wrapper">
                <div>
                    {songs.map((x)=>{
                        if (String(x).toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
                            return (
                                <>
                                {Music(x, currently_playing, SetCurrentlyPlaying)}
                                <Spacer></Spacer>
                                </>
                            )
                        }
                    })}
                </div>
            </div>
        </> 
    )
}