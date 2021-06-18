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
        presenceRef: firebase.database().ref('presence')
    }

    componentDidMount() {
        if(this.state.user){
            this.addListeners(this.state.user.uid)
        }

    }

     addListeners = async currentUserUid => {
        let loadedUsers = []

         await axios.get(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users.json`)
             .then(res => {
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



         // this.state.usersRef.on('child_added', snap => {
         //     if(currentUserUid !== snap.key){
         //         let user = snap.val()
         //
         //         user['uid'] = snap.key
         //
         //         user['status'] = 'offline'
         //
         //         loadedUsers.push(user)
         //
         //         this.setState({
         //             users: loadedUsers
         //         })
         //     }
         // })






     //     this.state.connectedRef.on('value', snap => { //проверяем их статус
     //         if(snap.val() === true){
     //             const ref = this.state.presenceRef.child(currentUserUid)
     //             console.log(ref, 'ref')
     //                 ref.set(true)
     //                 ref.onDisconnect().remove(err => {
     //                     if(err !== null){
     //                         console.error(err)
     //                     }
     //             })
     //         }
     //     })
     //
     //     this.state.presenceRef.on('child_added', snap => {
     //         if(currentUserUid !== snap.key){
     //             //add status to user
     //             this.addStatusToUser(snap.key) //передаем статус
     //         }
     //     })
     //
     //     this.state.presenceRef.on('child_removed', snap => {
     //         if(currentUserUid !== snap.key){
     //             //add status to user
     //             this.addStatusToUser(snap.key, false) //передаем статус
     //         }
     //     })
     // }
     //
     //
     //
     //
     // addStatusToUser = (userId, connected = true) => { //добавляем статус для будущей проверки и добавления класса
     //    const updatedUsers = this.state.users.reduce((acc, user) => {
     //        if(user.uid === userId){
     //            user['status'] = `${connected ? 'online' : 'offline'}`
     //        }
     //        return acc.concat(user)
     //    }, [])
     //
     //     this.setState({
     //         user: updatedUsers
     //     })
     // }
     //
     isUserOnline = user => user.status === 'online' //проверка на онлайн для добавления класса

     changeChannel = user => {
         const channelId = this.getChannelId(user.uid)
         const channelData = {
             id: channelId,
             name: user.name,

         }
         this.props.setCurrentChannel(channelData)
         this.props.setPrivateChannel(true)
     }

     getChannelId = userId => {
         const currentUserId = this.state.user.uid
         //     return userId < currentUserId ?
         //         `${userId}/${currentUserId}`:
         //         `${currentUserId}/${userId}`
         // }

         return `${userId}/${currentUserId}/Mirzoev`

     }


     render(){

        const {users} = this.state

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