import React, {Fragment, Component} from 'react'
import {Menu, Icon, Modal, Form, Input, Button} from 'semantic-ui-react'
import firebase from "../../Firebase/Firebase";
import axios from "axios";
import {setCurrentChannel} from "../../actions";
import {connect} from "react-redux";


class Channels extends Component{

    state = {
        user: this.props.currentUser,
        channels: [],
        modal: false,
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels')
    }

    componentDidMount() {
        this.addListeners()
    }

    addListeners = async () => {
        let loadChannels = []
        await axios.get('https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/channels.json')
            .then(inf => {
                console.log(inf.data, '1')
                return inf.data
            })
            .then(data => {

                // data - объект с объектами

               const keys = Object.keys(data) //массив ключей

                const channels = keys.map(key => {
                    return data[key]
               })

                this.setState( {channels} )

                console.log(channels, 'Channels')

            })
    }

    addChannel = async () => {
        const {channelDetails, channelName, user, channelsRef} = this.state

        const key = channelsRef.push().key

        console.log('key', key)

        await axios.post('https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/channels.json', {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        })
            .then(() => {
                this.setState({channelName: '', channelDetails: ''})
                this.closeModal()
                console.log('channels added')
            })
            .catch(e => {
                console.err(e)
            })

    }

    displayChannels = channels => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
            key={channel.id}
            onClick={() => this.changeChannel(channel)}
            name={channel.name}
            style={{
                opacity: 0.7
            }}
            >
                #{channel.name}
            </Menu.Item>
        ))
    )
    openModal  = () => this.setState({modal: true})

    closeModal = () => this.setState({modal: false})

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    changeChannel = channel => {
        this.props.setCurrentChannel(channel)
    }

    handleSubmit = event => {
        event.preventDefault()
        if(this.isFormValid(this.state)){
            console.log('Channel added')
            this.addChannel()
        }
    }

    isFormValid = ({ channelName, channelDetails  }) => channelName && channelDetails

    render(){

        const {channels, modal} = this.state

        return(

            <Fragment>

            <Menu.Menu style={{ paddingBottom: '2em' }}>
                <Menu.Item>
                    <span>
                        <Icon name='exchange' /> CHANNELS
                    </span> {' '}
                    ({ channels.length }) <Icon name='add' onClick={this.openModal} style={{cursor: 'pointer'}} />
                </Menu.Item>

                {this.displayChannels(channels)}

            </Menu.Menu>

            {/*// Add channel model*/}

        <Modal basic open={modal} onClose={this.closeModal}>

            <Modal.Header>Add a Channel</Modal.Header>
            <Modal.Content>

                <Form onSubmit={this.handleSubmit}>

                    <Form.Field>
                        <Input
                        fluid
                        label='Name of Channel'
                        name='channelName'
                        onChange={this.handleChange}

                        />
                    </Form.Field>

                    <Form.Field>
                        <Input
                            fluid
                            label='About the Channel'
                            name='channelDetails'
                            onChange={this.handleChange}

                        />
                    </Form.Field>
                </Form>

            </Modal.Content>

            <Modal.Actions>
                <Button color='green' inverted onClick={this.handleSubmit}>
                    <Icon name='checkmark' /> Add
                </Button>

                <Button color='red' inverted onClick={this.closeModal}>
                    <Icon name='remove' /> Cancel
                </Button>
            </Modal.Actions>

        </Modal>

            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        channel: state.channel
    }
}

const mapDispatchToProps = {
    setCurrentChannel
}

export default connect(mapStateToProps, mapDispatchToProps)(Channels)
