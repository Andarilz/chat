import React, {Component} from 'react'
import {Grid, Header, Dropdown, Icon, Image, Modal, Input, Button, Loader, Dimmer, Segment} from "semantic-ui-react";
import firebase from "../../Firebase/Firebase";
import AvatarEditor from 'react-avatar-editor';
import {connect} from "react-redux";
import axios from "axios";
import {setAvatar, setCurrentChannel, setUser, setUserPostsAvatar} from '../../actions';
import {v4} from 'uuid'


class UserPanel extends Component{

     state = {
         user: this.props.user,
         modal: false,
         modalName: false,
         previewImage: '',
         croppedImage: '',
         blob: '',
         metadata: {
             contentType: 'image/jpeg'
         },
         storageRef: firebase.storage().ref(),
         uploadedCropperImage: '',
         avatar: '',
         userName: '',
         loading: false
     }

     componentDidMount() {
         this.onStart()
     }

     onStart = () => {
         this.setState({user: this.props.currentUser, loading: true})
         this.getUserFetchData()//получаем ключ, раньше тут был листенерс
             .then(() => this.addListeners(this.state.usersCorrectKey))//передаем ключ и получаем данные
             .then(() => this.setState({loading: false}))
     }


    addListeners = async userId => {

        await axios.get(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json`)
            .then(result => {
                return result.data
            })
            .then(res => {

                if(res){
                    const inf = res.avatar

                    const name = res.name

                    this.setState({
                        avatar: inf || 'https://www.google.ru/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png',
                        name
                    })
                }

            })
            .then(() => {
                this.props.setUser({...this.props.user, photoURL: this.state.avatar, displayName: this.state.name})
                this.setState({
                    user: this.props.user
                })
            })
    }

     dropdownOptions = () => [
        {
            key: 'user',
            text: (<span>Signed in as <strong>{this.state.user && this.state.user.displayName}</strong></span>),
            disabled: true
        },
         // {
         //     key: 'name',
         //     text: (<span onClick={this.openModalName}>Change Username</span>)
         // },
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

    handleChange = event => {
         const file = event.target.files[0]
         const reader = new FileReader()

        if(file){
            reader.readAsDataURL(file)
            reader.addEventListener('load', () => {
                this.setState({
                    previewImage: reader.result
                })
            })
        }

    }

    handleCropImage = () => {
         if(this.avatarEditor){
             this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                 let imageURL = URL.createObjectURL(blob)
                 this.setState({
                     croppedImage: imageURL,
                     blob
                 })
             })
         }
    }

    uploadCroppedImage = () => {

         const {storageRef, user, blob, metadata} = this.state

        storageRef
            .child(`avatars/user-${user.uid}-${v4()}`)
            .put(blob, metadata)
            .then(snap => {
                snap.ref.getDownloadURL().then(URL => {
                    this.setState({
                        uploadedCropperImage: URL
                    }, () => this.changeAvatar())
                })
            })
    }

    changeAvatar = async () => {

        if (this.state.userCorrectData) {
            this.setState({
                avatar: this.state.userCorrectData.avatar,
                name: this.state.userCorrectData.name,
                uid: this.state.userCorrectData.uid,
                colors: this.state.userCorrectData.colors
            })

            if (this.state.userCorrectData.starred) {
                this.setState({
                    starred: this.state.userCorrectData.starred
                })
            }

        }

         this.getUserFetchData()
             .then(() => {
                 if (this.state.userCorrectData) {
                     this.setState({
                         avatar: this.state.userCorrectData.avatar,
                         name: this.state.userCorrectData.name,
                         uid: this.state.userCorrectData.uid,
                         colors: this.state.userCorrectData.colors
                     })

                     if (this.state.userCorrectData.starred) {
                         this.setState({
                             starred: this.state.userCorrectData.starred
                         })
                     }

                     this.afterGettingURL(this.state.usersCorrectKey)

                     this.setState({
                         user: {...this.state.user, photoURL: this.state.uploadedCropperImage}
                     }, () => {
                         this.props.setUser(this.state.user)

                     })

                 }

             })

    }

    getUserFetchData = async () => { //делаем запрос к бд для получения данных

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

                    if (usersCorrectKey) {
                        this.setState({
                            usersCorrectKey //id в firebase
                        })

                        if (usersCorrectKey) {
                            this.setState({
                                userCorrectData: results[usersCorrectKey],
                                usersCorrectKey //id в firebase
                            })

                        }
                    }
                }
            })
    }

    // changeAvatar = async () => { //делаем запрос к бд для получения данных
    //
    //     await axios.get(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users.json`)
    //         .then(res => {
    //             const results = res.data || []
    //
    //             if (results) {
    //                 const keysOfMessages = Object.keys(results) //получаем ключи объектов с сообщениями
    //
    //                 const mess = keysOfMessages.map(res => results[res]) //перебираем данные для удобства, формируя массив данных из объекта с ключами
    //
    //
    //                 mess.map((el, i) => {
    //                     if (el.uid === this.state.user.uid) {
    //                         this.setState({
    //                             userCounter: i
    //                         })
    //                     }
    //                 })
    //
    //                 const usersCorrectKey = keysOfMessages[this.state.userCounter]
    //
    //                 if (usersCorrectKey) {
    //                     this.setState({
    //                         usersCorrectKey //id в firebase
    //                     })
    //
    //                     if (usersCorrectKey) {
    //                         this.setState({
    //                             userCorrectData: results[usersCorrectKey],
    //                             usersCorrectKey //id в firebase
    //                         })
    //
    //                         if (this.state.userCorrectData) {
    //                             this.setState({
    //                                 avatar: this.state.userCorrectData.avatar,
    //                                 name: this.state.userCorrectData.name,
    //                                 uid: this.state.userCorrectData.uid,
    //                                 colors: this.state.userCorrectData.colors
    //                             })
    //
    //                             if (this.state.userCorrectData.starred) {
    //                                 this.setState({
    //                                     starred: this.state.userCorrectData.starred
    //                                 })
    //                             }
    //
    //                             this.afterGettingURL(usersCorrectKey)
    //                             this.setState({
    //                                 user: {...this.state.user, photoURL: this.state.uploadedCropperImage}
    //                             }, () => this.props.setUser(this.state.user))
    //                             // this.props.setAvatar(this.state.uploadedCropperImage)
    //
    //                         }
    //                     }
    //                 }
    //             }
    //         })
    // }

    afterGettingURL = async (key) => {

        //алгоритм позволяет вносить изменения в базу данных юзера, надо сохранить uid в новом поле

        const {name, uid, uploadedCropperImage, colors} = this.state

        if (this.state.userCorrectData.starred) {
            const {starred} = this.state.userCorrectData

            await axios.put(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users/${key}.json`,{
                avatar: uploadedCropperImage,
                name,
                uid,
                colors,
                starred
            })

            this.closeModal()
            console.log(
                'avatar changed!'
            )
        } else {

            await axios.put(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users/${key}.json`, {
                avatar: uploadedCropperImage,
                name,
                uid,
                colors
            })

            this.closeModal()
            console.log(
                'avatar changed!'
            )
        }
    }


    render(){

         const {user, modal, previewImage, croppedImage, loading} = this.state

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
                            <Header.Content>IsaChat</Header.Content>
                        </Header>

                    </Grid.Row>

                    {/*User DropDown*/}

                    <Header as='h4' inverted style={{
                        padding: '0.2em'
                    }}
                    >
                        <Dropdown trigger={
                            <span>


                                { loading ? <Segment style={{
                                    background: primaryColor
                                }}>
                                    <Loader  active />
                                </Segment> : <Image src={user && user.photoURL} spaced='right' avatar/>}
                                {user && user.displayName}
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
                            onChange={this.handleChange}
                            />

                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                    <Grid.Column className='ui center aligned grid'>
                                        {previewImage && (
                                            <AvatarEditor
                                                ref={node => this.avatarEditor = node}
                                                image={previewImage}
                                                width={120}
                                                height={120}
                                                border={50}
                                                scale={1.2}
                                            />
                                        )}
                                    </Grid.Column>

                                    <Grid.Column>
                                       {croppedImage && (
                                           <Image
                                               style={{margin: '3.5 em auto'}}
                                               width={100}
                                               height={100}
                                               src={croppedImage}
                                           />
                                       )}
                                    </Grid.Column>

                                </Grid.Row>
                            </Grid>

                        </Modal.Content>


                        <Modal.Actions>

                            {croppedImage && <Button color='green' inverted onClick={this.uploadCroppedImage}>

                                <Icon name='save'/> Change avatar

                            </Button>}

                            <Button color='green' inverted onClick={this.handleCropImage}>

                                <Icon name='image' /> Preview

                            </Button>

                            <Button color='red' inverted onClick={this.closeModal}>

                                <Icon name='remove' /> Cancel

                            </Button>
                        </Modal.Actions>

                    </Modal>

                    <Modal basic open={this.state.modalName} onClose={this.closeModalName}>

                        <Modal.Header>
                            Select a new Username
                        </Modal.Header>

                        <Modal.Content>

                            <Input
                                fluid
                                label='Username'
                                name='userName'
                                type='text'
                                onChange={this.addNewName}
                                // disabled={!!this.state.linkFile}
                            />

                        </Modal.Content>

                        <Modal.Actions>

                            <Button onClick={this.sendUsername} color='green' inverted><Icon name='checkmark'/> Send</Button>

                            <Button color='red' inverted onClick={this.closeModalName}><Icon name='remove'/> Cancel</Button>

                        </Modal.Actions>

                    </Modal>

                </Grid.Column>
            </Grid>
        )
    }
}


const mapStateToProps = state => {
    return {
        user: state.user.currentUser,
        currentChannel: state.channel.currentChannel
    }
}


export default connect(mapStateToProps, {setUser, setAvatar, setUserPostsAvatar, setCurrentChannel})(UserPanel)

