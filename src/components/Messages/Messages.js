import React, {Component} from 'react'
import {Segment, Comment} from 'semantic-ui-react'
import MessagesHeader from './MessageHeader'
import MessageForm from "./MessageForm";
import firebase from "../../Firebase/Firebase";
import axios from 'axios'
import Message from "./Message";

class Messages extends Component{

    state = {
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        messagesLoading: true,
        shouldLoading: false
    }

    componentDidMount() {
        const {user, channel} = this.state
        if(channel && user){
            this.addListeners(channel.id)
        }
    }

    updateData = () => { //обновление списка сообщений
        const {user, channel} = this.state

        if(channel && user){
            this.addListeners(channel.id)
        }
    }


    addListeners = channelId => {
        this.addMessageListeners(channelId)
    }

    addMessageListeners = async channelId => {
        await axios.get(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/messages/${channelId}.json`)
            .then(res => {
                const results = res.data || []
                if(results){
                    const keysOfMessages = Object.keys(results)
                    const mess = keysOfMessages.map(res => results[res])
                    this.setState({
                        messages: mess,
                        messagesLoading: false
                    })
                }else{
                    this.setState({
                        messages: '',
                        messagesLoading: false
                    })
                }
            })
    }

    displayMessages = messages => {
       return messages.length > 0 && messages.map(message => (
                <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
                />
            )
        )
    }


    render(){

        const {messagesRef, channel, user, messages} = this.state

        return(
            <React.Fragment>

                <MessagesHeader />

                <Segment>
                    <Comment.Group className='messages'>
                        {this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    updateData={this.updateData}
                />

            </React.Fragment>
        )
    }
}

export default Messages