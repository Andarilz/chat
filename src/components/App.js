import React, {createContext} from 'react'
import './App.css'
import { Grid } from "semantic-ui-react";
import ColorPenal from "./ColorPental/ColorPental";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPenal from "./MetaPenal/MetaPenal";
import {connect} from "react-redux";


const App = ({currentUser}) => (
    <Grid columns='equal' className='app' style={{
        background: '#eee'
    }}>
        <ColorPenal />
        <SidePanel currentUser={currentUser} />

        <Grid.Column style={{marginLeft: 320}}>
            <Messages />
        </Grid.Column>

        <Grid.Column width={4}>
            <MetaPenal />
        </Grid.Column>
    </Grid>
)

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(App)
