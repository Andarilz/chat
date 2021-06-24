import React, {Component, Fragment} from 'react'
import {Icon, Menu} from "semantic-ui-react";
import {connect} from "react-redux";
import {setPrivateChannel, setCurrentChannel, setKey} from "../../actions";
import axios from "axios";

class Starred extends Component{

    state = {
        starredChannels: this.props.channel,
        activeChannel: '',
        user: this.props.currentUser,
        key: '',
        starred: {}
    }

    componentDidMount() {
        if(this.props.channel){
            this.setState({
                starredChannel: [this.props.channel]
            })
        }
            this.addListener()
    }

    addListener = async () => { //делаем запрос к бд для получения данных

        //можно удалить весь блок, то же самое мы делали в цветах

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


                    this.setState({
                        key: usersCorrectKey
                    })

                    this.props.setKey(usersCorrectKey)

                    this.addLastListener(usersCorrectKey)
                }
            })
    }

    addLastListener = async (key) => {
        await axios.get(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users/${key}/starred.json`)
            .then(res => {
                return res.data
            })
            .then(result => {
                if(result){
                    const inf = Object.keys(result) || {}
                    const getThisInf = result[inf[0]]
                    const final = [getThisInf] || []
                    this.setState({
                        starredChannels: final
                    })
                }
            })
    }


    setActiveChannel = channel => { //вставляем в стейт значение текущего канала, полученное после пробежки по всем значениям каналов, полученных из БЖ
        this.setState({ activeChannel: channel.id})
    }

    changeChannel = channel => { // запускаем функцию установки активного канала с переданным значением канала
        this.setActiveChannel(channel)
        this.props.setPrivateChannel(false)
        this.props.setCurrentChannel(channel) //добавляем канал в редакс при смене канала
        this.setState({
            channel //при смене канала активируем нотификации,
        })
        this.addListener()
    }

    displayChannels = starredChannels => (
        starredChannels && starredChannels.map(channel => ( //пробегаемся по массиву каналов для его вывода
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)} //вставляем значение канала и передаем его в функцию смены канала
                name={channel.name}
                style={{
                    opacity: 0.7
                }}
                active={channel.id === this.state.activeChannel}
            >
                #{channel.name}
            </Menu.Item>
        ))
    )

    render(){

        return(
            <Menu.Menu className='menu'>
                <Menu.Item>
                    <span>
                        <Icon name='star' /> STARRED
                    </span> {' '}
                </Menu.Item>

                {this.displayChannels(this.props.channel)}


            </Menu.Menu>
        )
    }
}

const mapStateToProps = state => {
    return {
        key: state.key.key,
        channel: state.channel.starChannel
    }
}


export default connect(mapStateToProps, {setCurrentChannel, setPrivateChannel, setKey})(Starred)