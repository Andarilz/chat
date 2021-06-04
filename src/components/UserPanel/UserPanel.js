import React, {Component} from 'react'
import { Grid, Header, Dropdown, Icon } from "semantic-ui-react";

export default class UserPanel extends Component{

    dropdownOptions = () => [
        {
            key: 'user',
            text: <span>Signed in as <strong>User</strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span>Change avatar</span>
        },
        {
            key: 'signout',
            text: <span>Sign Out</span>
        }
    ]


    render(){
        return(
            <Grid style={{
                background: '#4c3c4c'
            }}>
                <Grid.Column>
                    <Grid.Row style={{
                        padding: '1.2em',
                        margin: 0
                    }}>

                        {/*App Header*/}

                        <Header inverted floated='left' as='h2'>
                            <Icon name='code' />
                            <Header.Content>DevChat</Header.Content>
                        </Header>

                    </Grid.Row>


                    {/*User DropDown*/}

                    <Header as='h4' inverted style={{
                        padding: '0.2em'
                    }}
                    >
                        <Dropdown trigger={
                            <strong>User</strong>
                        } options={this.dropdownOptions()}>

                        </Dropdown>
                    </Header>
                </Grid.Column>
            </Grid>
        )
    }
}

