import React, {Component} from 'react'
import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import firebase from '../../Firebase/Firebase'

export default class Login extends Component{

    state = {
        email: '',
        password: '',
        errors: [],
        loading: false,
    }

    handleClick = event => { //занесение в стейт данныъ из полей
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p> ) //показ ошибки из стейта берущейся


    handleInputError = className => {
        return this.state.errors.some(error => error.message.toLowerCase().includes(className)) ? 'error' : '' //если условие слева происходит, добавляем класс ошибки
    }

    handleSubmit = event => { // проверка на валидацию, отмена стандартного поведения формы, загрузка данных в регистрацию фаербэйз
        event.preventDefault()
        if(this.isFormValid(this.state)){

            this.setState({errors: [], loading: true})

            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signInUser => {
                    console.log(signInUser)
                })
                .catch(e => {
                    console.log(e)
                    this.setState({
                        errors: this.state.errors.concat(e),
                        loading: false
                    })
                })
        }
    }

    isFormValid = ({email, password}) => email && password


    render(){
        const {password, email, errors, loading} = this.state
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
                        icon color='green'
                        textAlign='center'>
                        <Icon
                            name='code branch'
                            color='green' />
                        Login to DevChat
                    </Header>
                    <Form onSubmit={this.handleSubmit} size='large' >
                        <Segment stacked>

                            <Form.Input
                                fluid
                                icon='mail'
                                iconPosition='left'
                                placeholder='Email address'
                                type='email'
                                name='email'
                                onChange={this.handleClick}
                                value={email}
                                className={errors ?  this.handleInputError('email') : ''}
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
                                className={errors ? this.handleInputError('password') : ''}
                            />

                            <Button
                                color='green'
                                fluid
                                size='large'
                                disabled={loading}
                                className={loading ? 'loading' : ''}
                            >Submit</Button>
                        </Segment>
                    </Form>

                    {errors.length > 0 && ( //информация об ошибке
                        <Message error>
                            {this.displayErrors(errors)}
                        </Message>
                    )}

                    <Message> Dont have an account? <Link to='/register'>Register</Link></Message>

                </Grid.Column>
            </Grid>
        )
    }
}














