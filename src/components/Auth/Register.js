import React, {Component} from 'react'
import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import firebase from '../Firebase'

export default class Register extends Component{

    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: []
    }

    handleClick = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    isFormValid = () => {

        let errors = []

        let error

        if(this.isFormEmpty(this.state)){ //проверка на пустоту
            error = {message: 'Fill in all fields'}

            this.setState({errors: errors.concat(error)}) //если форма пустая, пишем об этом

            return false

        } else if (!this.isPasswordValid(this.state)){
            error = {message: 'Password is invalid'}

            this.setState({
                errors: errors.concat(error)
            })

            return false

        } else {
            return true
        }
    }

    displayErrors = errors => errors.map((error, i )=> <p key={i}>{error.message}</p>)

    isFormEmpty = ({username, password, email, passwordConfirmation}) => {
        return !username.length || !password.length || !email.length || !passwordConfirmation.length
    }

    isPasswordValid = ({password, passwordConfirmation}) => {
        if(password.length < 6 || passwordConfirmation.length < 6){
            return false
        } else if(password !== passwordConfirmation){
            return false
        } else {
           return true
        }
    }

    handleSubmit = event => {
        if(this.isFormValid()){
            event.preventDefault()
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(user => {
                    console.log(user)
                })
                .catch(e => console.error(e))
        }
    }


    render(){

        const {username, password, email, passwordConfirmation, errors} = this.state

        return(
            <Grid
                textAlign='center'
                verticalAlign='middle'
                className='app'
            >
                <Grid.Column
                    style={{ maxWidth: 450}}>
                    <Header
                        as='h2'
                        icon color='purple'
                        textAlign='center'>
                        <Icon
                            name='puzzle piece'
                            color='purple' />
                        Register for DevChat
                    </Header>
                    <Form onSubmit={this.handleSubmit} size='large' >
                        <Segment stacked>

                        <Form.Input
                            fluid
                            icon='user'
                            iconPosition='left'
                            placeholder='Username'
                            type='text'
                            name='username'
                            onChange={this.handleClick}
                            value={username}
                        />

                        <Form.Input
                            fluid
                            icon='mail'
                            iconPosition='left'
                            placeholder='Email address'
                            type='email'
                            name='email'
                            onChange={this.handleClick}
                            value={email}
                        />

                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            name='password'
                            onChange={this.handleClick}
                            value={password}
                        />

                        <Form.Input
                            fluid
                            icon='repeat'
                            iconPosition='left'
                            placeholder='Password Confirmation'
                            type='password'
                            name='passwordConfirmation'
                            onChange={this.handleClick}
                            value={passwordConfirmation}
                        />
                            <Button color='purple' fluid size='large'>Submit</Button>
                        </Segment>
                    </Form>

                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}

                    <Message>Already a user? <Link to='/login'> Login</Link></Message>

                </Grid.Column>
            </Grid>
        )
    }
}

















