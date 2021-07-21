import React, {Component} from 'react'
import {Segment, Button, Input} from 'semantic-ui-react'
import firebase from '../../Firebase/Firebase'
import axios from 'axios'
import FileModal from './FileModal'
import {v4} from 'uuid'
import ProgressBar from "./ProgresBar";
import {connect} from "react-redux";
import {counterUp, counterZero} from "../../actions";
import {Picker, emojiIndex} from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css'


class MessageForm extends Component{

    state = {
        message: '',
        loading: false,
        channel: this.props.currentChannel,//из редакса
        user: this.props.currentUser, //из редакса
        errors: [],
        modal: false,
        uploadState: '',
        uploadTask: null,
        storageRef: firebase.storage().ref(),
        percentUploaded: 0,
        link: true,
        emojiPicker: false
    }

    componentWillUnmount() {
        if(this.state.uploadTask !== null){
            this.state.uploadTask.cancel()
            this.setState({
                uploadTask: null
            })
        }
    }

    openModal  = () => this.setState({modal: true}) //модальное окно

    closeModal = () => this.setState({modal: false}) //модальное окно

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value}) //внесение значений из инпута
    }

    enterClick = async (event) => { //чтоб по энтеру отсылать смс

        const {message, channel, user} = this.state

        if(event.keyCode === 13 && this.state.message){
            this.sendMessage()
        }
    }

    createMessage = (fileURL = null, linkImage= null) => { //формируем объект для отправки на сервер

        console.log('mess', typeof linkImage === 'string')

        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.props.user.uid,
                name: this.props.user.displayName,
                avatar: this.props.user.photoURL,
                errors: []
            },
        }

        if(typeof linkImage === 'string' && linkImage.trim().length){ //создаем поле image со ссылкой, если она есть
            message['image'] = linkImage
            console.log(linkImage)
        }
        else if(typeof fileURL === 'string' && fileURL.trim().length){ //либо создаем поле image со ссылкой на файл, загруженный на БД Firebase
            message['image'] = fileURL
            console.log(fileURL, 'url')
        }
        else if(this.state.message.trim().length) {
            console.log(this.state.message, 'данные')
            message['content'] = this.state.message // создаем поле content для отображения текста
        }

        console.log(message, 'что отсылаем')

        return message
    }

    sendMessage = async (linkImage = null) => { //отсылаем текстовое сообщение

        const {message, channel, link, user} = this.state

        if(message.trim().length || typeof linkImage === 'string'){ // проверяем на пробелы и на пустоту
            //send message

            console.log('перед БД',linkImage)

            this.setState({loading: true})
            this.props.updateData() //обновляем список сообщений после отсылки сообщения

            const creatingURL = this.props.isPrivateChannel
                ? `https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/private/${channel.id}.json`
                : `https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/messages/${channel.id}.json`


                await axios.post(creatingURL, this.createMessage(null, linkImage))

                .then(() => { //записываем в БД ссылку, вытащенную из Storage
                    this.setState({loading: false, errors: [], message: '', rerenderComp: false}) //чистим стейт
                    this.props.updateData() //активируем колл-бэк, чтобы он в компоненте Messages сделал запрос на сервер снова и обновил список сообщений, хот-релоад
                    this.props.counterUp()
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

    getPath = () => {
        if(this.props.isPrivateChannel){
            return `chat/private-${this.state.channel.id}`
        } else {
            return `chat/public`
        }
    }

    uploadFile = (file, metadata) => { //функция-коллбэк, передаваемая в модальное окно, которая грузит картинку в storage firebase
        const pathToUpload = this.state.channel.id
        // const filePath = `chat/public/${v4()}.jpg` //имя для Storage прописываем
        const filePath = `${this.getPath()}/${v4()}.jpg`

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata) //формируем более удорбную переменную для активации в колл-бэке метода загрузки
        },
            () => {
                    this.state.uploadTask.on('state_changed', snap => { //загружаем картинку в Storage
                    const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100) //процент загрузки выводим
                        this.props.isProgressBarVisible(percentUploaded) //передаем процент загрузки
                        this.setState({percentUploaded})
            }, err => {
                console.error(err)

                this.setState({
                    error: this.state.errors.concat(err),
                    uploadTask: null,
                    uploadState: 'error'
                })

            }, () => {
                this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => { //получаем из Storage Firebase ссылку с картинкой
                    this.sendFileMessage(downloadURL, pathToUpload) //передаем дальше ссылку для отправки в БД Firebase через post-запрос
                })
                    .catch(err => this.setState({
                        error: this.state.errors.concat(err),
                        uploadTask: null,
                        uploadState: 'error'
                    }))
            })

        })
    }

    LinkImage = async linkURL => {
        await this.sendMessage(linkURL) //передаем ссылку в sendMessage
        console.log(typeof linkURL === 'string','url')
    }

    linkFinished = bool => { //меняем статус ссылки, чтобы нас пропустил в sendMessage проверяльщик на пробелы и на пустоту
        this.setState({
            link: bool
        })
    }

    sendFileMessage = async (fileURl, pathToUpload) => { //формируем объект для отправки картинки в БД

        this.setState({loading: true})

        this.props.updateData() //обновляем список сообщений после отсылки сообщения

        await axios.post(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/messages/${pathToUpload}.json`, this.createMessage(fileURl))
            .then(() => { //отсылаем картинку в БД
                console.log(5)
                this.setState({loading: false, errors: [], message: '', rerenderComp: false, uploadState: 'done'})//чистим стейт
                this.props.updateData()//активируем коллбэк в компоненте Messages для будущего get-запроса к БД и обновления списка сообщений
                this.props.counterUp()
                console.log(this.props.counter, 'counter')
            })
            .catch(e => {
                console.error(e)
                this.setState({errors: this.state.errors.concat(e), loading: false, rerenderComp: false})
            })

    }

    handleTogglePicker = (event) => { //переключение эмодзи
        this.setState({
            emojiPicker: !this.state.emojiPicker
        })
    }

    handleSelectEmoji = emoji => { //отображение смайлов
        const oldMessage = this.state.message
        const newMessage = this.colonToUnicode(` ${oldMessage} ${emoji.colons} `)

        this.setState({
            message: newMessage,
            emojiPicker: false
        })

        setTimeout(() => {
            this.messageInputRef.focus()
        }, 0)
    }

    colonToUnicode = message => { //регулярка для смайлов
        return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
            x = x.replace(/:/g, "");
            let emoji = emojiIndex.emojis[x];
            if (typeof emoji !== "undefined") {
                let unicode = emoji.native;
                if (typeof unicode !== "undefined") {
                    return unicode;
                }
            }
            x = ":" + x + ":";
            return x;
        });
    };


    render(){
        const {errors, message, loading, modal, uploadState, percentUploaded, emojiPicker} = this.state


        return(
            <React.Fragment>

            <Segment className='message__form'>

                {emojiPicker && (
                    <Picker
                    set='apple'
                    className='emoji_picker'
                    title='Pick your emoji'
                    emoji='point_up'
                    onSelect={this.handleSelectEmoji}
                    />
                )}

                <Input
                    value={message}
                    onChange={this.handleChange}
                    onKeyDown={this.enterClick}
                    fluid
                    name='message'
                    ref={node => this.messageInputRef = node} //ставим фокус на инпут после выбора смайлов
                    style={{
                        marginBottom: '0.7em'
                    }}
                    label={
                        <Button
                            icon={emojiPicker ? 'close' : 'add'}
                            onClick={this.handleTogglePicker}
                            content={emojiPicker && 'Close'}
                        />
                    } labelPosition='left'
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
                        disabled={uploadState === 'uploading'}
                    />

                </Button.Group>

                <FileModal
                    modal={modal} //отслеживание открытия и закрытия модального окна
                    closeModal={this.closeModal} //при закрытии меняется стейт на закрытие
                    uploadFile = {this.uploadFile} //событие загрузки
                    linkImage={this.LinkImage}
                    linkFinished={this.linkFinished}
                />

                <ProgressBar
                    uploadState={uploadState}
                    percentUploaded={percentUploaded}
                />

            </Segment>

            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        counter: state.counter,
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps, {counterUp, counterZero})(MessageForm)