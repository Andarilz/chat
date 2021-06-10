import React, {createContext} from 'react'
import './App.css'
import { Grid } from "semantic-ui-react";
import ColorPenal from "./ColorPental/ColorPental";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPenal from "./MetaPenal/MetaPenal";
import {connect} from "react-redux";


const App = ({ currentUser, currentChannel }) => (
    <Grid columns='equal' className='app' style={{
        background: '#eee'
    }}>
        <ColorPenal />
        <SidePanel
            currentUser={currentUser}
            key={currentUser && currentUser.uid}
        />

        <Grid.Column style={{marginLeft: 320}}>
            <Messages
                key={currentChannel && currentChannel.id}
                currentChannel={currentChannel}
                currentUser={currentUser}
            />
        </Grid.Column>

        <Grid.Column width={4}>
            <MetaPenal />
        </Grid.Column>
    </Grid>
)

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    currentChannel: state.channel.currentChannel
})

export default connect(mapStateToProps)(App)
