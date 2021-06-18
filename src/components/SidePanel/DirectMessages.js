import React, {Component} from 'react'
import {Menu, Icon} from 'semantic-ui-react'
import firebase from '../../Firebase/Firebase'
import axios from 'axios'
import {connect} from "react-redux";
import {setCurrentChannel, setPrivateChannel} from "../../actions";


class DirectMessages extends Component{

    state = {
        users: [],
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        connectedRef: firebase.database().ref('.info/connected'),
        presenceRef: firebase.database().ref('presence'),
        activeChannel: ''
    }

    componentDidMount() {
        if(this.state.user){
            this.addListeners(this.state.user.uid)
        }

    }

     addListeners = async currentUserUid => {
        let loadedUsers = []

         await axios.get(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users.json`)
             .then(res => {//получаем всех пользователей
                 const results = res.data || []

                 if (results) {
                     const keysOfUsers = Object.keys(results) //получаем ключи объектов с сообщениями
                     keysOfUsers.map(res => { //перебираем данные для удобства, формируя массив данных из объекта с ключами

                         if(results[res].uid !== currentUserUid){
                             let user = results[res]
                             user['status'] = 'offline'
                             // user['uid'] = currentUserUid

                             loadedUsers.push(user)

                             this.setState({
                                 users: loadedUsers,
                                 user: {...this.state.user, 'status': 'offline'}
                             })
                         } else {
                             this.presenceDeleteBD()
                             this.presenceBD(currentUserUid, true)
                             let user = results[res]
                             user['status'] = 'online'
                             // user['uid'] = currentUserUid

                             loadedUsers.push(user)

                             this.setState({
                                 users: loadedUsers,
                                 user: {...this.state.user, 'status': 'online'}
                             })
                         }
                     })
                 }

             })
        }

        presenceBD = async (currentId, bool) => {
            await axios.put(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/presence/${currentId}.json`,
                bool
            )
        }

         presenceDeleteBD = async () => {
             await axios.delete(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/presence.json`)
         }


     isUserOnline = user => user.status === 'online' //проверка на онлайн для добавления класса

     changeChannel = user => { //меняем канала при клике на имя в директе
         const channelId = this.getChannelId(user.uid)
         const channelData = {
             id: channelId,
             name: user.name,

         }
         this.props.setCurrentChannel(channelData) //меняем в редаксе тккущий канал на сформированный
         this.props.setPrivateChannel(true) //меняем маркет приватного канала для отображения хэдера более корректного у приватных и неприватных каналов
         this.setActivateChannel(user.uid) //стили активного канала приписываем
     }

     setActivateChannel = userId => {
        this.setState({
            activeChannel: userId
        })
     }

     getChannelId = userId => { //самое важное!!!
        // Мы берем текущий наш айти и айди нашего желаемого друга по переписке и меняем их местами,
         // в зависимости от того, за кого мы сейчас зашли.
         // В итоге, в пуш-хапросе у нас одна последовательность, а в гет-запросе - другая.
         // Во итогу 2 человека могут видеть лишь свои сообщения
         const currentUserId = this.state.user.uid
             return userId < currentUserId ?
                 `${userId}/${currentUserId}`:
                 `${currentUserId}/${userId}`
         }



     render(){

        const {users, activeChannel} = this.state

        return(

            <Menu.Menu className='menu'>
                <Menu.Item>
                    <span>
                        <Icon name='mail'/> DIRECT MESSAGES
                    </span> {' '}
                    ({users.length})
                </Menu.Item>
                {/*{Users to send Direct messages}*/}
                {users.map(user => (
                    <Menu.Item
                        key={user.uid}
                        active={user.uid === activeChannel}
                        onClick={() => this.changeChannel(user)}
                        style={{
                            opacity: 0.7,
                            fontStyle: 'italic',

                        }}
                    >

                        <Icon
                        name='circle'
                        color={this.isUserOnline(user) ? 'green' : 'red'}
                        />

                        @{user.name}

                    </Menu.Item>
                ))}
            </Menu.Menu>
        )
    }
}

export default connect(null, {setCurrentChannel, setPrivateChannel})(DirectMessages)