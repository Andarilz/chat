import React from 'react'
import './App.css'
import { Grid, Segment } from "semantic-ui-react";
import ColorPenal from "./ColorPental/ColorPental";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPenal from "./MetaPenal/MetaPenal";
import {connect} from "react-redux";


const App = ({ currentUser, currentChannel, isPrivateChannel, primary, secondary }) => {

    return (
        <Grid columns='equal' className='app' style={{
            background: secondary
        }}>

            <ColorPenal currentUser={currentUser} />

            <SidePanel
                currentUser={currentUser}
                key={currentUser && currentUser.uid}
                primaryColor={primary}
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
                <MetaPenal
                    isPrivateChannel={isPrivateChannel}
                    key={currentChannel && currentChannel.id}
                    currentChannel={currentChannel}
                />
            </Grid.Column>
        </Grid>
    )
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser, //получаем из редакса значение пользователя после реги
    currentChannel: state.channel.currentChannel, //получаем из редакса значение канала, передаваемое при смене канала из Channels
    isPrivateChannel: state.channel.isPrivateChannel,
    primary: state.colors.primary,
    secondary: state.colors.secondary
})

export default connect(mapStateToProps)(App)
