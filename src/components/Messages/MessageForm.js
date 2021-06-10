import React, {Component, createContext} from 'react'
import {Segment, Button, Input} from 'semantic-ui-react'
import firebase from '../../Firebase/Firebase'
import axios from 'axios'
import Messages from "./Messages";
import ColorPenal from "../ColorPental/ColorPental";

export const LoadingContext = createContext(false)


class MessageForm extends Component{

    state = {
        message: '',
        loading: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        errors: []
    }


    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    sendMessage = async () => {

        const {message, channel} = this.state

        if(message){
            //send message

            this.setState({loading: true})
            this.props.updateData()

                await axios.post(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/messages/${channel.id}.json`,{
                        timestamp: firebase.database.ServerValue.TIMESTAMP,
                        user: {
                            id: this.state.user.uid,
                            name: this.state.user.displayName,
                            avatar: this.state.user.photoURL,
                            errors: []
                        },
                        content: this.state.message
                })
                .then(() => {
                    this.setState({loading: false, errors: [], message: '', rerenderComp: false})
                    this.props.updateData()
                })
                .catch(e => {
                    console.error(e)
                    this.setState({errors: this.state.errors.concat(e), loading: false, rerenderComp: false})
                })
        } else {
            this.setState({
                errors: this.state.errors.concat({message: 'Add a message'})
            })
        }
    }


    render(){

        const {errors, message, loading} = this.state

        return(

            <React.Fragment>



            <Segment className='message__form'>

                <Input
                    value={message}
                    onChange={this.handleChange}
                    fluid
                    name='message'
                    style={{
                        marginBottom: '0.7em'
                    }}
                    label={<Button icon={'add'} />}
                    labelPosition='left'
                    className={
                        errors.some(error => error.message.includes('message')) ? 'error' : ''
                    }
                placeholder='Write your message'
                />

                <Button.Group icon widths='2'>
                    <Button
                        disabled={loading}
                        onClick={this.sendMessage}
                        color='orange'
                        content='Add Reply'
                        labelPosition='left'
                        icon='edit'
                    />

                    <Button
                    color='teal'
                    content='Upload Media'
                    labelPosition='right'
                    icon='cloud upload'


                    />

                </Button.Group>

            </Segment>

            </React.Fragment>
        )
    }
}

export default MessageForm