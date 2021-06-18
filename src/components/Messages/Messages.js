import React, {Component} from 'react'
import {Segment, Comment} from 'semantic-ui-react'
import MessagesHeader from './MessageHeader'
import MessageForm from "./MessageForm";
import firebase from "../../Firebase/Firebase";
import axios from 'axios'
import Message from "./Message";

class Messages extends Component{

    state = {
        messagesRef: firebase.database().ref('messages'), //по идее можно удалить, только надо из пропсов убрать
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        messagesLoading: true,
        shouldLoading: false,
        progressBar: false,
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: [],
        PrivateChannel: this.props.isPrivateChannel
    }

    componentDidMount() {
        const {user, channel} = this.state
        if(channel && user){
            this.addListeners(channel.id) //подтягиваем данные из БД при первом заходе
        }
    }

    updateData = () => { //колл0бэк обновление списка сообщений, передается через пропсы
        const {user, channel} = this.state

        if(channel && user){
            this.addListeners(channel.id)
        }
    }

    handleSearchChange = event => { //при вводе данных в строку поиска
        this.setState({
            searchTerm: event.target.value.trim(), //вносим искомое значение без пробелов в стейт
            searchLoading: true
        }, () => this.handleSearchMessages()) //запускаем метод поиска
    }

    handleSearchMessages = () => { //активация строки поиска

        const channelMessages = [...this.state.messages] //получаем из стейта (а ранее - из БД) все сообщения
        const regex = new RegExp(this.state.searchTerm, 'gi') //настраиваем глобальный поиск
        const searchResults = channelMessages.reduce((acc, message) => { //пишем метод поиска совпадений
            if(message.content && message.content.match(regex) || message.user.name.match(regex)){ //если в поле есть совпадение сообщения или имени
                acc.push(message) //копим совпадения
            }
            return acc
        }, [])

        this.setState({
            searchResults,
        })


        setTimeout(() => {
            this.setState({
                searchLoading: false
            })
        }, 500)

    }

    addListeners = channelId => {
        this.addMessageListeners(channelId) //в дид маунте активируется
    }


    addMessageListeners = async channelId => { //делаем запрос к бд для получения данных

        const creatingURL = this.props.isPrivateChannel
            ? `https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/private/${channelId}.json`
            : `https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/messages/${channelId}.json`


        await axios.get(creatingURL)
            .then(res => {
                const results = res.data || []

                if(results){
                    const keysOfMessages = Object.keys(results) //получаем ключи объектов с сообщениями
                    const mess = keysOfMessages.map(res => results[res]) //перебираем данные для удобства, формируя массив данных из объекта с ключами
                    this.setState({
                        messages: mess,
                        messagesLoading: false
                    })

                    this.countUniqUsers(mess)
                }else{
                    this.setState({
                        messages: '',
                        messagesLoading: false
                    })
                }
            })
    }

    countUniqUsers = messages => { //считаем уникальных пользлователей
        const uniqueUsers = messages.reduce((acc, message) => {
            if(!acc.includes(message.user.name)){
                acc.push(message.user.name)
            }

            return acc;
        }, [])

        const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0 //добавляем s после users

        const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`

        this.setState({
            numUniqueUsers
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

    isProgressBarVisible = percent => { // заполнение полоски загрузки
        if(percent > 0){
            this.setState({
                progressBar: true
            })
        }
    }

    displayChannelName = channel => {
        return channel && `${this.state.PrivateChannel ? '@' : '#'}${channel.name}`
    }

    render(){

        const {messagesRef, channel, user, messages, progressBar, numUniqueUsers, searchTerm, searchResults, searchLoading, PrivateChannel} = this.state

        return(
            <React.Fragment>

                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                    isPrivateChannel={PrivateChannel}
                />

                <Segment>
                    <Comment.Group className={progressBar ? 'messages__progress' : 'messages' }>
                        { searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages) }
                    </Comment.Group>
                </Segment>

                <MessageForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    updateData={this.updateData}
                    isProgressBarVisible={this.isProgressBarVisible}
                    isPrivateChannel={PrivateChannel}
                />

            </React.Fragment>
        )
    }
}

export default Messages