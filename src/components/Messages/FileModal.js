import React, {Component} from 'react'
import {Modal, Input, Button, Icon} from 'semantic-ui-react'
import mime from 'mime-types'


class FileModal extends Component{

    state = {
        file: null,
        authorized: ['image/gif', 'image/png', 'image/jpeg'], //допустимые типы файлов
        linkFile: null
    }

    addFile = event => {
        const file = event.target.files[0]

        if(file){
            this.setState({file})
        }
    }

    sendFile = () => {
        const {file, linkFile} = this.state

        const {uploadFile, closeModal} = this.props


        if(file !== null){

            if(this.isAuthorized(file.name)){
                const metadata = { contentType: mime.lookup(file.name) }
                uploadFile(file, metadata) //грузим в Firebase Storage картинку
                closeModal()
                this.clearFile()
            }
        } else if(linkFile !== null){
                this.props.linkImage(linkFile)
                this.props.linkFinished(true)
                closeModal()
                this.clearFile()
        }
    }

    isAuthorized = filename => this.state.authorized.includes(mime.lookup(filename)) //проверяем типы файлов

    clearFile = () => this.setState({file: null, linkFile: null})

    addLinkFile = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    closeModalPanel = () => {
        this.props.closeModal()
        this.clearFile()
    }

    render(){
        const {modal, closeModal} = this.props

        return(
        <Modal basic open={modal} onClose={closeModal}>

            <Modal.Header>
                Select an image file
            </Modal.Header>

            <Modal.Content>

                <Input
                fluid
                label='file types .jpg, .png'
                name='file'
                type='file'
                onChange={this.addFile}
                disabled={!!this.state.linkFile}
                />

                <p>Or you can also</p>

                <Input
                type='text'
                label='Paste link'
                name='linkFile'
                onChange={this.addLinkFile}
                disabled={!!this.state.file}
                />

            </Modal.Content>

            <Modal.Actions>

                <Button onClick={this.sendFile} color='green' inverted><Icon name='checkmark'/> Send</Button>

                <Button color='red' inverted onClick={this.closeModalPanel}><Icon name='remove'/> Cancel</Button>

            </Modal.Actions>

        </Modal>

        )
    }
}


export default FileModal