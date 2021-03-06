import React, {Component} from 'react'
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment, PascalCase} from 'semantic-ui-react'
import { SliderPicker } from 'react-color'
import axios from "axios";
import {setColors, setUsersColors} from '../../actions'
import {connect} from "react-redux";

class ColorPenal extends Component{

    state = {
        modal: false,
        primary: '',
        secondary: '',
        user: this.props.currentUser,
        userCounter: '',
        userCorrectData: {},
        usersCorrectKey: '',
        usersColors: []
    }

    componentDidMount() {

        this.Listeners()//получаем ключ
            .then(() => this.addListeners(this.state.usersCorrectKey))//передаем ключ и получаем данные
            .then(() => this.props.setColors(this.props.usersColors ? this.props.usersColors[0].primary : 'black', this.props.usersColors ? this.props.usersColors[0].secondary : 'white'))
    }


    addListeners = async userId => {
        let usersColors = []

        await axios.get(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/colors.json`)
            .then(result => {
              return result.data
            })
            .then(res => {
                usersColors.unshift(res)
                this.setState({
                    usersColors
                })
                this.props.setUsersColors(usersColors)
                this.props.setColors(usersColors[0].primary, usersColors[0].secondary)
            })
    }

    openModal = () => this.setState({modal: true})

    closeModal = () => this.setState({modal: false})

    handleChangePrimary = color => this.setState({primary: color.hex})

    handleChangeSecondary = color => this.setState({secondary: color.hex})

    Listeners = async () => {

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
                    }
                }
            })
    }

    addUsersListeners = async (primary, secondary) => { //делаем запрос к бд для получения данных

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

                            if (this.state.userCorrectData && primary && secondary) {
                                this.setState({
                                    avatar: this.state.userCorrectData.avatar,
                                    name: this.state.userCorrectData.name,
                                    uid: this.state.userCorrectData.uid
                                })

                                if (this.state.userCorrectData.starred) {
                                    this.setState({
                                        starred: this.state.userCorrectData.starred
                                    })
                                }

                                this.afterGettingURL(usersCorrectKey, primary, secondary)
                            }
                        }
                    }
                }
            })
    }

    afterGettingURL = async (key, primary, secondary) => {

        //алгоритм позволяет вносить изменения в базу данных юзера, надо сохранить uid в новом поле

        const {avatar, name, uid} = this.state

        if (this.state.userCorrectData.starred) {
            const {starred} = this.state.userCorrectData

            await axios.put(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users/${key}.json`,{
                avatar,
                name,
                uid,
                'colors': {
                    primary,
                    secondary
                },
                starred

            }).then(() => {
                this.addListeners(this.state.usersCorrectKey)
            })

            this.closeModal()
            console.log(
                'colors added!'
            )
        } else {

        await axios.put(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users/${key}.json`, {
            avatar,
            name,
            uid,
            'colors': {
                primary,
                secondary
            }

        }).then(() => {
            this.addListeners(this.state.usersCorrectKey)
        })

        this.closeModal()
        console.log(
            'colors added!'
        )

    }

    }

    handleSaveColors = () => {
        if(this.state.primary && this.state.secondary){
            this.saveColors(this.state.primary, this.state.secondary)
            // this.props.setColors(this.state.primary, this.state.secondary)
        }
    }

    saveColors = (primary, secondary) => {
        this.addUsersListeners(primary, secondary)
    }

    displayUserColors = colors => {
        if(colors.length > 0){
           return colors.map((color, i )=> {
               return (
                   <React.Fragment key={i}>
                       <Divider />
                       <div className="color__container" onClick={() => {
                           this.props.setColors(color.primary, color.secondary)
                           console.log(222)
                       }}>
                           <div className="color__square" style={{background: color ? color.primary : 'black'}}>
                               <div className="color__overlay" style={{background: color ? color.secondary : 'white'}} />
                           </div>
                       </div>
                   </React.Fragment>
               )
               }
           )
        }
    }

    render(){

        const {modal, primary, secondary, usersColors} = this.state

        return(
            <Sidebar
            as='Menu'
            icon='labeled'
            inverted
            vertical
            visible
            width='very thin'
            >
                <Divider  />
                <Button
                icon='paint brush'
                size='medium'
                color='white'
                inverted
                onClick={this.openModal}
                />

                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Choose App Colors</Modal.Header>
                    <Modal.Content>

                        <Segment inverted>

                            <Label content='Primary Color' />
                            <SliderPicker color={primary} onChange={this.handleChangePrimary} />

                        </Segment>


                        <Segment inverted>

                            <Label content='Secondary Color' />
                            <SliderPicker color={secondary} onChange={this.handleChangeSecondary} />

                        </Segment>

                    </Modal.Content>
                        <Modal.Actions>
                            <Button color='green' inverted onClick={this.handleSaveColors}>
                                <Icon name='checkmark' /> Save Colors
                            </Button>

                            <Button color='red' inverted onClick={this.closeModal}>
                                <Icon name='remove' /> Cancel
                            </Button>
                        </Modal.Actions>
                </Modal>
            </Sidebar>
        )
    }
}

const mapStateToProps = state => {
    return {
        primary: state.colors.primary,
        secondary: state.colors.secondary,
        usersColors: state.colors.usersColors
    }
}

export default connect(mapStateToProps, {setColors, setUsersColors})(ColorPenal)