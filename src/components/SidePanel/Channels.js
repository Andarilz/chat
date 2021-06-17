import React, {Fragment, Component} from 'react'
import {Menu, Icon, Modal, Form, Input, Button} from 'semantic-ui-react'
import firebase from "../../Firebase/Firebase";
import axios from "axios";
import {setCurrentChannel} from "../../actions";
import {connect} from "react-redux";


class Channels extends Component{

    state = {
        user: this.props.currentUser,
        channels: [],
        modal: false,
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        firstLoad: true,
        activeChannel: ''
    }

    componentDidMount() {
        this.addListeners() //при первой загрузке обновляем значения из БД
    }

    addListeners = async () => { //запрашиваем данные по каналам из БД
        await axios.get('https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/channels.json')
            .then(inf => {
                return inf.data || []
            })
            .then(data => {

                // data - объект с объектами

               const keys = Object.keys(data) //массив ключей

                const channels = keys.map(key => { //перебираем массив для удобства
                    return data[key]
               })

                this.setState( {channels}, () => this.setFirstChannel())

                // this.setState( {channels}, () => this.setActiveChannel(this.state.channels[this.state.channels.length - 1]))


            })
    }

    setFirstChannel = () => { //автопрокрутка на первый канал

        const firstChannel = this.state.channels[0]

        if(this.state.firstLoad && this.state.channels.length > 0){
            this.props.setCurrentChannel(firstChannel) //добавляем в редакс первый канал для отображения егор названия
            this.setActiveChannel(firstChannel)
        }
        this.setState({firstLoad: false})

    }

    addChannel = async () => { //запрос к БД с добавлением канала
        const {channelDetails, channelName, user, channelsRef} = this.state

        // const key = v4()
        const key = channelsRef.push().key

        await axios.post('https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/channels.json', {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        })
            .then(() => {
                this.setState({channelName: '', channelDetails: ''})
                this.closeModal()
                this.addListeners()
            })
            .catch(e => {
                console.err(e)
            })

    }

    displayChannels = channels => (
        channels.length > 0 && channels.map(channel => ( //пробегаемся по массиву каналов для его вывода
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

    openModal  = () => this.setState({modal: true})

    closeModal = () => this.setState({modal: false})

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    changeChannel = channel => { // запускаем функцию установки активного канала с переданным значением канала
        this.setActiveChannel(channel)
        this.props.setCurrentChannel(channel) //добавляем канал в редакс при смене канала
    }

    setActiveChannel = channel => { //вставляем в стейт значение текущего канала, полученное после пробежки по всем значениям каналов, полученных из БЖ
        this.setState({ activeChannel: channel.id})
    }

    handleSubmit = event => {
        event.preventDefault()
        if(this.isFormValid(this.state)){
            console.log('Channel added')
            this.addChannel()
        }
    }

    isFormValid = ({ channelName, channelDetails  }) => channelName && channelDetails

    render(){

        const {channels, modal} = this.state

        return(

            <Fragment>

            <Menu.Menu className='menu'>
                <Menu.Item>
                    <span>
                        <Icon name='exchange' /> CHANNELS
                    </span> {' '}
                    ({ channels.length }) <Icon name='add' onClick={this.openModal} style={{cursor: 'pointer'}} />
                </Menu.Item>

                {this.displayChannels(channels)}


            </Menu.Menu>

            {/*// Add channel model*/}

        <Modal basic open={modal} onClose={this.closeModal}>

            <Modal.Header>Add a Channel</Modal.Header>
            <Modal.Content>

                <Form onSubmit={this.handleSubmit}>

                    <Form.Field>
                        <Input
                        fluid
                        label='Name of Channel'
                        name='channelName'
                        onChange={this.handleChange}

                        />
                    </Form.Field>

                    <Form.Field>
                        <Input
                            fluid
                            label='About the Channel'
                            name='channelDetails'
                            onChange={this.handleChange}

                        />
                    </Form.Field>
                </Form>

            </Modal.Content>

            <Modal.Actions>
                <Button color='green' inverted onClick={this.handleSubmit}>
                    <Icon name='checkmark' /> Add
                </Button>

                <Button color='red' inverted onClick={this.closeModal}>
                    <Icon name='remove' /> Cancel
                </Button>
            </Modal.Actions>

        </Modal>

            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        channel: state.channel
    }
}

const mapDispatchToProps = {
    setCurrentChannel //вставляем в стейт значния по каналам
}

export default connect(mapStateToProps, mapDispatchToProps)(Channels)
