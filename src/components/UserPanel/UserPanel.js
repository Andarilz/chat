import React, {Component} from 'react'
import { Grid, Header, Dropdown, Icon, Image } from "semantic-ui-react";
import firebase from "../../Firebase/Firebase";


class UserPanel extends Component{

     state = {
         user: ''
     }

     componentDidMount() {
         this.setState({user: this.props.currentUser})
     }

     dropdownOptions = () => [
        {
            key: 'user',
            text: (<span>Signed in as <strong>{this.state.user.displayName}</strong></span>),
            disabled: true
        },
        {
            key: 'avatar',
            text: (<span>Change avatar</span>)
        },
        {
            key: 'signOut',
            text: (<span onClick={this.handleSignOut}>Sign Out</span>)
        }
    ]

    handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log('done!'))
    }


    render(){

         const {user} = this.state

        const {primaryColor} = this.props

        return(
            <Grid style={{
                background: primaryColor
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
                            <span>
                                <Image src={user.photoURL} spaced='right' avatar />
                                {user.displayName}
                            </span>
                        } options={this.dropdownOptions()}>

                        </Dropdown>
                    </Header>
                </Grid.Column>
            </Grid>
        )
    }
}



export default UserPanel

