import React from 'react'
import {Loader, Dimmer} from "semantic-ui-react";

const Spinner = (props) => (

    <Dimmer active>

        <Loader size='huge' content='Preparing chat...' />

    </Dimmer>

)

export default Spinner
