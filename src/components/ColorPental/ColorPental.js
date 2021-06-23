import React, {Component} from 'react'
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment, PascalCase} from 'semantic-ui-react'
import { SliderPicker } from 'react-color'
import axios from "axios";
import {setColors} from '../../actions'
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

        if(this.state.usersCorrectKey){
            this.addListeners(this.state.usersCorrectKey)
        }
        if(this.state.primary && this.state.secondary){
            this.addUsersListeners(this.state.primary, this.state.secondary)
        }
    }

    addListeners = async userId => {
        let usersColors = []

        await axios.get(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/colors.json`)
            .then(result => {
              return result.data
            })
            .then(res => {
                usersColors.unshift(res)
                console.log(usersColors)
                this.setState({
                    usersColors
                })
                console.log(usersColors)
            })
    }

    openModal = () => this.setState({modal: true})

    closeModal = () => this.setState({modal: false})

    handleChangePrimary = color => this.setState({primary: color.hex})

    handleChangeSecondary = color => this.setState({secondary: color.hex})

    addUsersListeners = async (primary, secondary) => { //делаем запрос к бд для получения данных

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

                        if(this.state.userCorrectData && primary && secondary){
                            this.setState({
                                avatar: this.state.userCorrectData.avatar,
                                name: this.state.userCorrectData.name,
                                uid: this.state.userCorrectData.uid
                            })
                            this.afterGettingURL(usersCorrectKey, primary, secondary)
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

    handleSaveColors = () => {
        if(this.state.primary && this.state.secondary){
            this.saveColors(this.state.primary, this.state.secondary)
        }
    }

    saveColors = (primary, secondary) => {
        this.addUsersListeners(primary, secondary)
    }

    displayUserColors = colors => {
        if(colors.length){
           return colors.map((color, i )=> {

               return (
                   <React.Fragment key={i}>
                       <Divider />
                       <div className="color__container" onClick={() => this.props.setColors(color.primary, color.secondary)}>
                           <div className="color__square" style={{background: color.primary}}>
                               <div className="color__overlay" style={{background: color.secondary}}></div>
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
                icon='add'
                size='small'
                color='blue'
                onClick={this.openModal}
                />

                {this.displayUserColors(usersColors)}

                {/*Color Picker Modal*/}

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

export default connect(null, {setColors})(ColorPenal)