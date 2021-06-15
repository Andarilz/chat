import React, {Component} from 'react'
import { Header, Segment, Input, Icon } from 'semantic-ui-react'


class MessagesHeader extends Component{
    render(){

        const {channelName, numUniqueUsers} = this.props

        return(
            <Segment clearing className='CustomMessage'>

                {/*Channel Title*/}

                <Header fluid='true' as='h2' floated='left' style={{marginBottom: 0}}>

                    <span>

                        {channelName ? channelName : 'Channel'}

                    <Icon name='star outline' color='black' />
                    </span>

                    <Header.Subheader>{numUniqueUsers ? numUniqueUsers : 'Users'}</Header.Subheader>

                </Header>


                {/*Channel Search Input*/}


                <Header floated='right'>
                    <Input
                    size='mini'
                    icon='search'
                    name='searchTern'
                    placeholder='Search Messages'
                    />
                </Header>

            </Segment>
        )
    }
}

export default MessagesHeader