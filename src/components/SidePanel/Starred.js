import React, {Component, Fragment} from 'react'
import {Icon, Menu} from "semantic-ui-react";
import {connect} from "react-redux";
import {setPrivateChannel, setCurrentChannel} from "../../actions";

class Starred extends Component{

    state = {
        starredChannels: [],
        activeChannel: ''
    }

    setActiveChannel = channel => { //вставляем в стейт значение текущего канала, полученное после пробежки по всем значениям каналов, полученных из БЖ
        this.setState({ activeChannel: channel.id})
    }

    changeChannel = channel => { // запускаем функцию установки активного канала с переданным значением канала
        this.setActiveChannel(channel)
        this.props.setPrivateChannel(false)
        this.setState({
            channel //при смене канала активируем нотификации,
        })

    }

    displayChannels = starredChannels => (
        starredChannels.length > 0 && starredChannels.map(channel => ( //пробегаемся по массиву каналов для его вывода
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

        const {starredChannels} = this.state


        return(
            <Menu.Menu className='menu'>
                <Menu.Item>
                    <span>
                        <Icon name='star' /> STARRED
                    </span> {' '}
                    ({ starredChannels.length })
                </Menu.Item>

                {this.displayChannels(starredChannels)}


            </Menu.Menu>
        )
    }
}


export default connect(null, {setCurrentChannel, setPrivateChannel})(Starred)