import React, {Component} from 'react'
import {Segment, Comment} from 'semantic-ui-react'
import MessagesHeader from './MessageHeader'
import MessageForm from "./MessageForm";
import firebase from "../../Firebase/Firebase";
import axios from 'axios'
import Message from "./Message";
import {connect} from "react-redux";
import {setKey, setStarChannel, setUserPosts, setCancelChannelStar} from "../../actions";
import Skeleton from "./Skeleton";
import '../App.css'



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
        isChannelStarred: false,
        usersCorrectKey: '',
        idOfStarredChannel: '',
        userCorrectData: '',
        avatar: '',
        name: '',
        uid: '',
        toggle: false
    }



    componentDidMount() {

        const {user, channel} = this.state
        if (channel && user) {
            this.firstListeners()
                .then(() => {
                    this.addListeners(channel.id) //подтягиваем данные из БД при первом заходе
                    this.addUserStarListener(channel.id, this.props.keyInf) //обрабатываем звезду
                })

        }

        setInterval(() => {
            if (channel && user) {
                this.firstListeners()
                    .then(() => {
                        this.addListeners(channel.id) //подтягиваем данные из БД при первом заходе
                        this.addUserStarListener(channel.id, this.props.keyInf) //обрабатываем звезду
                        // this.addUsersListeners() //получаем данные пользователей
                    })

            }
        },1000)
    }

    firstListeners = async () => { //делаем запрос к бд для получения данных

        await axios.get(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users.json`)
            .then(res => {
                const results = res.data || []

                if (results) {
                    const keysOfMessages = Object.keys(results) //получаем ключи объектов с сообщениями

                    const mess = keysOfMessages.map(res => results[res]) //перебираем данные для удобства, формируя массив данных из объекта с ключами


                    mess.map((el, i) => {
                        if (el.uid === this.state.user.uid) {
                            this.setState({
                                userCounter: i
                            })
                        }
                    })

                    const usersCorrectKey = keysOfMessages[this.state.userCounter]

                    this.props.setKey(usersCorrectKey)

                }
            })
    }

    addUserStarListener = async (channelId, userId) => {
        await axios.get(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/starred.json`)
            .then(result => {
                return result.data //получаем всю информацию из starred-каналов
            })
            .then(res => {
                if(res){
                    const channelIds = Object.keys(res) //берем все ключи
                    this.props.setStarChannel([res[channelIds[0]]]) //добавляем звездный канал в БД
                    const prevStarred = channelIds.includes(channelId) //проверяем, есть ли в текущем канале звездный
                    this.setState({
                        isChannelStarred: prevStarred
                    })
                }
            })
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

    handleStar = () => { //переключаем звезду

        this.setState({
            isChannelStarred: !this.state.isChannelStarred
        }, () => this.starChannel())

    }

    //put

    addUsersListeners = async (toggle) => { //делаем запрос к бд для получения данных

        await axios.get(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users.json`)
            .then(res => {
                const results = res.data || [] //получаем всю инфу о юзерах

                if(results){
                    const keysOfMessages = Object.keys(results) //получаем ключи объектов с сообщениями

                    const mess = keysOfMessages.map(res => results[res]) //перебираем данные для удобства, формируя массив данных из объекта с ключами


                    mess.map((el, i) => {
                        if(el.uid === this.state.user.uid){
                            this.setState({
                                userCounter: i //находим ключ с нужным пользователем
                            })
                        }
                    })

                    const usersCorrectKey = keysOfMessages[this.state.userCounter] //назодим ключя из БД


                    this.props.setKey(usersCorrectKey) //добавляем ключ в пропсы


                    if(usersCorrectKey){ //если ли ключ
                        this.setState({
                            userCorrectData: results[usersCorrectKey],
                            usersCorrectKey //id в firebase
                        })

                        if(this.state.userCorrectData){ //получили ли дату из БД
                            this.setState({
                                avatar: this.state.userCorrectData.avatar,
                                name: this.state.userCorrectData.name,
                                uid: this.state.userCorrectData.uid,
                            })

                            if(this.state.userCorrectData.colors){ //есть ли цвета
                                this.setState({
                                    colors: this.state.userCorrectData.colors
                                })
                            }

                            if(toggle){ //если ли starred
                                this.afterGettingURLTRUE(usersCorrectKey, [this.state.starred])
                            } else {
                                this.afterGettingURLFALSE(usersCorrectKey)

                            }
                        }
                    }
                }
            })

    }

    afterGettingURLTRUE = async (key) => { //если есть звезда в каналах

        //алгоритм позволяет вносить изменения в базу данных юзера, надо сохранить uid в новом поле

        const {avatar, name, uid, colors} = this.state

        await axios.put(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users/${key}.json`,{
            avatar,
            name,
            uid,
            colors,
            'starred': {
                [this.state.channel.id]: {
                    name: this.state.channel.name,
                    details: this.state.channel.details,
                    id: this.state.channel.id,
                    createdBy: {
                        name: this.state.channel.createdBy.name,
                        avatar: this.state.channel.createdBy.avatar
                    }
                }
            }

        }).then(() => {
            console.log('starred добавлено')
            if(this.state.usersCorrectKey){
                this.addUserStarListener(this.state.channel.id, this.state.usersCorrectKey)
            }
        })

        console.log(
            'colors added!'
        )

    }

    afterGettingURLFALSE = async (key) => { //если нет звезды в каналах

        //алгоритм позволяет вносить изменения в базу данных юзера, надо сохранить uid в новом поле

        const {avatar, name, uid, colors} = this.state

        await axios.put(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users/${key}.json`,{
            avatar,
            name,
            uid,
            colors

        }).then(() => {
            console.log('starred добавлено')
        })

    }

    //put

    starChannel = async () => { //канал со звездочкой
        if(this.state.isChannelStarred){ //добавляем звезду
            console.log('star')
           await this.addUsersListeners(true)
               .then(() => {
                   this.addUserStarListener(this.state.usersCorrectKey)
               })
        }
        else {
            await this.addUsersListeners(false)
                this.props.setCancelChannelStar()
                console.log('unstar') //убираем звезду
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


    countUserPosts = messages => { //получаем все почты и сортируем их для вывода в мета-панели справа

        let usersPosts = messages.reduce((acc, message) => {

            if(message.user.name in acc){
                acc[message.user.name].count += 1
            } else {
                acc[message.user.name] = {
                    avatar: message.user.id === this.state.user.uid ? this.props.currentUser.photoURL : message.user.avatar,
                    count: 1,
                    uid: message.user.id,
                    name: message.user.name
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

    displayMessages = messages => { //отображаем сообщения
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
        return channel && `${this.state.PrivateChannel ? '@' : '#'}${channel.name}` //выводим имя канала
    }


    displayMessagesSkeleton = loading => {
        return (
            loading ? (
                <React.Fragment>
                    {[...Array(10)].map((_, i) => (
                        <Skeleton
                            key={i}
                        />
                    ))}
                </React.Fragment>
            ) : null
        )
    }


    render(){

        const {messagesRef, channel, user, messages, progressBar, numUniqueUsers, searchTerm,
            searchResults, searchLoading, PrivateChannel, isChannelStarred, idOfStarredChannel, messagesLoading} = this.state

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
                    idOfStarredChannel={idOfStarredChannel}
                    reloadPageFromHeader={this.reloadPageFromHeader}
                />

                <Segment>
                    <Comment.Group className={progressBar ? 'messages__progress' : 'messages' }>
                        {this.displayMessagesSkeleton(messagesLoading)}
                        { searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages) }
                        <div id='id2' ref={node => this.messagesEnd = node} />
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


const mapStateToProps = state => {
    return {
        keyInf: state.key.key,
        currentUser: state.user.currentUser
    }
}


export default connect(mapStateToProps , {setUserPosts, setKey, setStarChannel, setCancelChannelStar})(Messages)