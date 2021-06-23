import React, {Component} from 'react'
import {Segment, Comment} from 'semantic-ui-react'
import MessagesHeader from './MessageHeader'
import MessageForm from "./MessageForm";
import firebase from "../../Firebase/Firebase";
import axios from 'axios'
import Message from "./Message";
import {connect} from "react-redux";
import {setUserPosts} from "../../actions";


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
        PrivateChannel: this.props.isPrivateChannel,
        isChannelStarred: false
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

    handleStar = () => {
        this.setState({
            isChannelStarred: !this.state.isChannelStarred
        }, () => this.starChannel())
    }

    //put

    addUsersListeners = async (starred) => { //делаем запрос к бд для получения данных

        await axios.get(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users.json`)
            .then(res => {
                const results = res.data || []

                if(results){
                    const keysOfMessages = Object.keys(results) //получаем ключи объектов с сообщениями

                    const mess = keysOfMessages.map(res => results[res]) //перебираем данные для удобства, формируя массив данных из объекта с ключами


                    mess.map((el, i) => {
                        if(el.uid === this.state.user.uid){
                            this.setState({
                                userCounter: i
                            })
                        }
                    })

                    const usersCorrectKey = keysOfMessages[this.state.userCounter]

                    if(usersCorrectKey){
                        this.setState({
                            userCorrectData: results[usersCorrectKey],
                            usersCorrectKey //id в firebase
                        })

                        if(this.state.userCorrectData && starred){
                            this.setState({
                                avatar: this.state.userCorrectData.avatar,
                                name: this.state.userCorrectData.name,
                                uid: this.state.userCorrectData.uid,
                            })

                            if(this.state.userCorrectData.color){
                                this.setState({
                                    color: this.state.userCorrectData.color
                                })
                            }
                            this.afterGettingURL(usersCorrectKey, starred)
                        }
                    }
                }
            })

    }

    afterGettingURL = async (key, primary, secondary) => {

        //алгоритм позволяет вносить изменения в базу данных юзера, надо сохранить uid в новом поле

        const {avatar, name, uid} = this.state

        await axios.put(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users/${key}.json`,{
            avatar,
            name,
            uid,
            'colors': {
                primary,
                secondary
            }

        }).then(() => {
            this.addListeners(this.state.usersCorrectKey)
            console.log(1)
        })

        this.closeModal()
        console.log(
            'colors added!'
        )

    }

    //put

    starChannel = async () => {
        if(this.state.isChannelStarred){
            console.log('star')



        }

        else {
                console.log('unstar')


        }
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
                        messagesLoading: false,
                    })


                    this.countUniqUsers(mess)
                    this.countUserPosts(mess)
                }else{
                    this.setState({
                        messages: '',
                        messagesLoading: false
                    })
                }
            })
    }




    countUserPosts = messages => {

        let usersPosts = messages.reduce((acc, message) => {

            if(message.user.name in acc){
                acc[message.user.name].count += 1
            } else {
                acc[message.user.name] = {
                    avatar: message.user.avatar,
                    count: 1
                }
            }

            return acc


        }, {})

        this.props.setUserPosts(usersPosts)
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

        const {messagesRef, channel, user, messages, progressBar, numUniqueUsers, searchTerm,
            searchResults, searchLoading, PrivateChannel, isChannelStarred} = this.state

        return(
            <React.Fragment>

                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                    isPrivateChannel={PrivateChannel}
                    handleStar={this.handleStar}
                    isChannelStarred={isChannelStarred}
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



export default connect(null, {setUserPosts})(Messages)