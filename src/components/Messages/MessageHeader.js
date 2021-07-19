import React from 'react'
import { Header, Segment, Input, Icon } from 'semantic-ui-react'
import {connect} from "react-redux";


const MessagesHeader = props => {

        const {channelName, numUniqueUsers, handleSearchChange, searchLoading, isPrivateChannel,
            handleStar, isChannelStarred} = props


        return(
            <Segment clearing className='CustomMessage'>

                {/*Channel Title*/}

                <Header fluid='true' as='h2' floated='left' style={{marginBottom: 0}}>

                    <span>

                        {channelName ? channelName : 'Channel'}

                        {!isPrivateChannel && (
                            <Icon
                                onClick={handleStar}
                                name={isChannelStarred ? 'star' : 'star outline'}
                                color={isChannelStarred ? 'yellow' : 'black'}
                            />
                            )
                        }

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

const mapStateToProps = state => {
    return {
        channel: state.channel
    }
}

export default connect(mapStateToProps)(MessagesHeader)