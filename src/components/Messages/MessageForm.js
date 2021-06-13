import React, {Component} from 'react'
import {Segment, Button, Input} from 'semantic-ui-react'
import firebase from '../../Firebase/Firebase'
import axios from 'axios'
import FileModal from './FileModal'
import {v4} from 'uuid'


class MessageForm extends Component{

    state = {
        message: '',
        loading: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        errors: [],
        modal: false,
        uploadState: '',
        uploadTask: null,
        storageRef: firebase.storage().ref(),
        percentUploaded: 0
    }

    openModal  = () => this.setState({modal: true}) //модальное окно

    closeModal = () => this.setState({modal: false}) //модальное окно

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value}) //внесение значений из инпута
    }

    enterClick = event => { //чтоб по энтеру отсылать смс
        if(event.keyCode == 13 && this.state.message){
            this.sendMessage()
        }
    }

    createMessage = (fileURL = null) => { //формируем объект для отправки на сервер
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL,
                errors: []
            },
        }

        if(fileURL !== null){
            message['image'] = fileURL
        } else {
            message['content'] = this.state.message
        }

        return message
    }

    sendMessage = async () => { //отсылаем текстовое сообщение

        const {message, channel} = this.state

        if(message.trim().length){ // проверяем на пробелы
            //send message

            this.setState({loading: true})
            this.props.updateData() //обновляем список сообщений после отсылки сообщения

                await axios.post(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/messages/${channel.id}.json`, this.createMessage())
                .then(() => { //отсылаем на сервер get-запрос
                    this.setState({loading: false, errors: [], message: '', rerenderComp: false}) //чистим стейт
                    this.props.updateData() //активируем колл-бэк, чтобы он в компоненте Messages сделал запрос на сервер снова и обновил список сообщений, хот-релоад
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

    uploadFile = (file, metadata) => { //манипуляции для storage firebase, половина тут мне не ясна и так
        const pathToUpload = this.state.channel.id
        const ref = this.props.messagesRef
        const filePath = `chat/public/${v4()}.jpg`

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        },
            () => {
                this.state.uploadTask.on('state_changed', snap => { //ставим ограничение по размеру картинки
                    const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
                    this.setState({percentUploaded})
            }, err => {
                console.error(err)

                this.setState({
                    error: this.state.errors.concat(err),
                    uploadTask: null,
                    uploadState: 'error'
                })

            }, () => {
                this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => { //передаем в объект отсылки изображения, ссылку и место вставки в БД
                    this.sendFileMessage(downloadURL, ref, pathToUpload)
                })
                    .catch(err => this.setState({
                        error: this.state.errors.concat(err),
                        uploadTask: null,
                        uploadState: 'error'
                    }))
            })

        })
    }

    sendFileMessage = async (fileURl, ref, pathToUpload) => { //формируем объект для отправки картинки в БД

        this.setState({loading: true})
        this.props.updateData() //обновляем список сообщений после отсылки сообщения

        await axios.post(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/messages/${pathToUpload}.json`, this.createMessage(fileURl))
            .then(() => { //отсылаем картинку в БД
                this.setState({loading: false, errors: [], message: '', rerenderComp: false, uploadState: 'done'})//чистим стейт
                this.props.updateData()//активируем коллбэк в компоненте Messages для повторного get-запроса к БД и обновления списка сообщений
            })
            .catch(e => {
                console.error(e)
                this.setState({errors: this.state.errors.concat(e), loading: false, rerenderComp: false})
            })

    }

    render(){
        const {errors, message, loading, modal} = this.state
        return(
            <React.Fragment>

            <Segment className='message__form'>

                <Input
                    value={message}
                    onChange={this.handleChange}
                    onKeyDown={this.enterClick}
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
                        onClick={this.openModal} //по клику запускается изменение стейта на открытие
                    />

                    <FileModal
                        modal={modal} //отслеживание открытия и закрытия модального окна
                        closeModal={this.closeModal} //при закрытии меняется стейт на закрытие
                        uploadFile = {this.uploadFile}
                    />

                </Button.Group>

            </Segment>

            </React.Fragment>
        )
    }
}

export default MessageForm