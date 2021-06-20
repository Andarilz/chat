import React, {Component} from 'react'
import { Header, Segment, Input, Icon } from 'semantic-ui-react'


class MessagesHeader extends Component{
    render(){

        const {channelName, numUniqueUsers, handleSearchChange, searchLoading, isPrivateChannel,
            handleStar, isChannelStarred} = this.props


        return(
            <Segment clearing className='CustomMessage'>

                {/*Channel Title*/}

                <Header fluid='true' as='h2' floated='left' style={{marginBottom: 0}}>

                    <span>

                        {channelName ? channelName : 'Channel'}

                        {!isPrivateChannel && (
                            <Icon
                                // onClick={handleStar}
                                // name={isChannelStarred ? 'star' : 'star outline'}
                                // color={isChannelStarred ? 'yellow' : 'black'}
                                name={'star outline'}
                                color={'yellow'}
                            />
                            )}

                    </span>

                    {!isPrivateChannel && <Header.Subheader>{numUniqueUsers ? numUniqueUsers : 'Users'}</Header.Subheader>}

                </Header>


                {/*Channel Search Input*/}


                <Header floated='right'>
                    <Input
                        loading={searchLoading}
                        onChange={handleSearchChange}
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