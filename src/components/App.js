import React from 'react'
import './App.css'
import { Grid } from "semantic-ui-react";
import ColorPenal from "./ColorPental/ColorPental";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPenal from "./MetaPenal/MetaPenal";

const App = (props) => (
    <Grid columns='equal' className='app' style={{
        background: '#eee'
    }}>
        <ColorPenal />
        <SidePanel />

        <Grid.Column style={{marginLeft: 320}}>
            <Messages />
        </Grid.Column>

        <Grid.Column width={4}>
            <MetaPenal />
        </Grid.Column>
    </Grid>
)

export default App
