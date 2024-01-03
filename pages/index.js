import Head from "next/head";
import { Text, Link, Navbar, Spacer, Divider, Button, Card, Modal, Input, Loading} from "@nextui-org/react";
import { useEffect, useState } from "react";
import axios from "axios"
import data from "../props/data.json"

function Group(name, index, setGroups) {
    return (
        <>
        <Card css={{p:"$5", bgBlur:"$backgroundAlpha", border:"1px solid white", width:"400px"}} isHoverable isPressable>
            <Card.Header style={{width:"100%"}}>
                <div style={{width:"50%"}}>
                    <Text className="vertical">{name}</Text>
                </div>
                <div style={{width:"50%"}}>
                    {index!=-1 ? <Button color={""} auto css={{margin:"5px", padding: "", float:"right"}} onClick={()=>{
                        axios.get(data.api_url+"/group_action?group="+name+"&action=minus").then(()=>{
                            axios.get(data.api_url+"/groups").then((x)=>{
                                setGroups(x.data)
                            })
                        })
                    }}><Text color="black">-</Text></Button> : ""}
                    {index!=0 ? <Button color={""} auto css={{margin:"5px", padding: "", float:"right"}} onClick={()=>{
                        axios.get(data.api_url+"/group_action?group="+name+"&action=plus").then(()=>{
                            axios.get(data.api_url+"/groups").then((x)=>{
                                setGroups(x.data)
                            })
                        })
                    }}><Text color="black">+</Text></Button> : ""}
                </div>
            </Card.Header>
            <Button color={""} onClick={()=>{
                window.location="/group?group="+name
            }}>
                <Text color="black">Click to view more details</Text>
            </Button>
        </Card>
        </>
    )
}

export default function Home() {
    const [add_group_visibility, SetModalVisibility]=useState(false)
    const [adding_group, setAddingGroup]=useState(false)
    const [groups, setGroups]=useState([])
    const [first, setFirst]=useState(true)
    if (first) {
        axios.get(data.api_url+"/groups").then((x)=>{
            setGroups(x.data)
        })
        setFirst(false)
    }
    return (
        <>
            <Head>
                <title></title>
            </Head>

            <Navbar isBordered isCompact variant="sticky" css={{bgBlur: "#000000"}}>
                <Navbar.Brand>
                    <Link href="/"><Text h3>Shaadi</Text></Link>
                </Navbar.Brand>
                <Navbar.Content activeColor="secondary">
                <Navbar.Item><Button auto bordered color=""><Link color="text" href="/songs">Songs</Link></Button></Navbar.Item>
                </Navbar.Content>
            </Navbar>

            <Text h2 className="wrapper">Groups</Text>
            <Text className="wrapper">Current Playing:</Text>
            <Spacer></Spacer>
            <div className="wrapper">
                <Button color={""} onClick={()=>{
                    SetModalVisibility(true)
                }}><Text color="black">Add Group</Text></Button>
            </div>
            <Spacer y={2}></Spacer>
            <div className="wrapper">
                <div>
                {groups.map((x, index)=>{
                    if (index+1==groups.length) {
                        index=-1
                    }
                    return (
                        <>
                        {Group(x, index, setGroups)}
                        <Spacer></Spacer>
                        </>
                    )
                })}
                </div>
            </div>
            <Modal
            open={add_group_visibility}
            onClose={()=>{
                SetModalVisibility(false)
            }}
            >
                <Modal.Header>
                    <Text h2>Add Group</Text>
                </Modal.Header>
                <Modal.Body>
                    <Input bordered color="" placeholder="Group Name" id="group"></Input>
                    <div className="wrapper">
                        {adding_group ? <Loading></Loading> : 
                        <Button color={""} onClick={()=>{
                            setAddingGroup(true)
                            axios.get(data.api_url+"/add_group?group="+document.getElementById("group").value).then((x)=>{
                                setAddingGroup(false)
                                SetModalVisibility(false)
                                axios.get(data.api_url+"/groups").then((x)=>{
                                    setGroups(x.data)
                                })
                            })
                        }}><Text color="black">Submit</Text></Button>}
                    </div>
                </Modal.Body>
            </Modal>
        </> 
    )
}