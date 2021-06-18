import React from 'react'
import './App.css'
import { Grid } from "semantic-ui-react";
import ColorPenal from "./ColorPental/ColorPental";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPenal from "./MetaPenal/MetaPenal";
import {connect} from "react-redux";


const App = ({ currentUser, currentChannel, isPrivateChannel }) => (
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
                currentChannel={currentChannel} //передаем канал
                currentUser={currentUser} // передаем пользователя
                isPrivateChannel={isPrivateChannel}
            />
        </Grid.Column>

        <Grid.Column width={4}>
            <MetaPenal />
        </Grid.Column>
    </Grid>
)

const mapStateToProps = state => ({
    currentUser: state.user.currentUser, //получаем из редакса значение пользователя после реги
    currentChannel: state.channel.currentChannel, //получаем из редакса значение канала, передаваемое при смене канала из Channels
    isPrivateChannel: state.channel.isPrivateChannel
})

export default connect(mapStateToProps)(App)
