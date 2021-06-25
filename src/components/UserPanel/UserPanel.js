import React, {Component} from 'react'
import { Grid, Header, Dropdown, Icon, Image, Modal, Input, Button } from "semantic-ui-react";
import firebase from "../../Firebase/Firebase";


class UserPanel extends Component{

     state = {
         user: '',
         modal: false
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
            text: (<span onClick={this.openModal}>Change avatar</span>)
        },
        {
            key: 'signOut',
            text: (<span onClick={this.handleSignOut}>Sign Out</span>)
        }
    ]

    openModal = () => this.setState({modal: true})

    closeModal = () => this.setState({modal: false})

    handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log('done!'))
    }


    render(){

         const {user, modal} = this.state

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

                    {/*Change User Avatar Modal*/}

                    <Modal basic open={modal} onClose={this.closeModal}>
                        <Modal.Header>Change Avatar</Modal.Header>
                        <Modal.Content>

                            <Input
                            fluid
                            type='file'
                            label='New Avatar'
                            name='preview Image'
                            />

                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                    <Grid.Column className='ui center aligned grid'>
                                        {/*Image Preview*/}
                                    </Grid.Column>

                                    <Grid.Column>
                                       {/*Cropped Image Preview*/}
                                    </Grid.Column>

                                </Grid.Row>
                            </Grid>

                        </Modal.Content>


                        <Modal.Actions>
                            <Button color='green' inverted>

                                <Icon name='save' /> Change avatar

                            </Button>

                            <Button color='green' inverted>

                                <Icon name='image' /> Preview

                            </Button>

                            <Button color='red' inverted onClick={this.closeModal}>

                                <Icon name='remove' /> Cancel

                            </Button>
                        </Modal.Actions>

                    </Modal>
                </Grid.Column>
            </Grid>
        )
    }
}



export default UserPanel

