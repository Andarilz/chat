import React, {Component} from 'react'
import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import firebase from '../../Firebase/Firebase'
import md5 from 'md5'
import axios from 'axios'

export default class Register extends Component{

    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
    }

    handleClick = event => { //занесение в стейт данныъ из полей
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
    } //проверка на валидацию по паролям и заполнению полей

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p> ) //показ ошибки из стейта берущейся

    isFormEmpty = ({username, password, email, passwordConfirmation}) => { //проверка на заполненность
        return !username.length || !password.length || !email.length || !passwordConfirmation.length
    }

    isPasswordValid = ({password, passwordConfirmation}) => { //проверка на правильность пароля и его длинну
        if(password.length < 6 || passwordConfirmation.length < 6){
            return false
        } else if(password !== passwordConfirmation){
            return false
        } else {
           return true
        }
    }

    handleInputError = className => {
       return this.state.errors.some(error => error.message.toLowerCase().includes(className)) ? 'error' : '' //если условие слева происходит, добавляем класс ошибки
    }

    saveUser = async createdUser => {
        //работает
         await axios.post(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users.json`, {
             name: createdUser.user.displayName,
             avatar: createdUser.user.photoURL,
             uid: createdUser.user.uid,
             colors: {
                 primary: '#eee',
                 secondary: "#4c3c4c"
             }
        })

    }

    handleSubmit = event => { // проверка на валидацию, отмена стандартного поведения формы, загрузка данных в регистрацию фаербэйз
        event.preventDefault()
        if(this.isFormValid()){

            this.setState({errors: [], loading: true})

            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log(createdUser)
                    createdUser.user.updateProfile({
                        displayName: this.state.username,
                        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    })
                        .then(() => {
                            this.saveUser(createdUser)
                                .then(() => {
                                console.log('user saved')
                            })
                                .catch(e => console.error(e))
                        })
                        .catch((e) => {
                            console.log(e)
                            this.setState({
                                errors: this.state.errors.concat(e),
                                loading: false
                            })
                        })
                })
                .catch(e => {
                    console.error(e)
                    this.setState({errors: this.state.errors.concat(e), loading: false})
                })

        }
    }

    render(){

        const {username, password, email, passwordConfirmation, errors, loading} = this.state

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

                        <Form.Input
                            fluid
                            icon='repeat'
                            iconPosition='left'
                            placeholder='Password Confirmation'
                            type='password'
                            name='passwordConfirmation'
                            onChange={this.handleClick}
                            value={passwordConfirmation}
                            className={errors ? this.handleInputError('password') : ''}
                        />
                            <Button
                                color='purple'
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

                    <Message>Already a user? <Link to='/login'> Login</Link></Message>

                </Grid.Column>
            </Grid>
        )
    }
}














// import React, {Component} from 'react'
// import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react'
// import {Link} from 'react-router-dom'
// import firebase from '../Firebase'
//
// export default class Register extends Component{
//
//     state = {
//         username: '',
//         email: '',
//         password: '',
//         passwordConfirmation: '',
//         errors: []
//     }
//
//     handleClick = event => {
//         this.setState({
//             [event.target.name]: event.target.value
//         })
//     }
//
//     isFormValid = () => {
//
//         let errors = []
//
//         let error
//
//         if(this.isFormEmpty(this.state)){ //проверка на пустоту
//             error = {message: 'Fill in all fields'}
//
//             this.setState({errors: errors.concat(error)}) //если форма пустая, пишем об этом
//
//             return false
//
//         } else if (!this.isPasswordValid(this.state)){
//             error = {message: 'Password is invalid'}
//
//             this.setState({
//                 errors: errors.concat(error)
//             })
//
//             return false
//
//         } else {
//             return true
//         }
//     }
//
//     displayErrors = errors => errors.map((error, i )=> <p key={i}>{error.message}</p>)
//
//     isFormEmpty = ({username, password, email, passwordConfirmation}) => {
//         return !username.length || !password.length || !email.length || !passwordConfirmation.length
//     }
//
//     isPasswordValid = ({password, passwordConfirmation}) => {
//         if(password.length < 6 || passwordConfirmation.length < 6){
//             return false
//         } else if(password !== passwordConfirmation){
//             return false
//         } else {
//             return true
//         }
//     }
//
//     handleSubmit = event => {
//         if(this.isFormValid()){
//             event.preventDefault()
//             firebase
//                 .auth()
//                 .createUserWithEmailAndPassword(this.state.email, this.state.password)
//                 .then(user => {
//                     console.log(user)
//                 })
//                 .catch(e => console.error(e))
//         }
//     }
//
//
//     render(){
//
//         const {username, password, email, passwordConfirmation, errors} = this.state
//
//         return(
//             <Grid
//                 textAlign='center'
//                 verticalAlign='middle'
//                 className='app'
//             >
//                 <Grid.Column
//                     style={{ maxWidth: 450}}>
//                     <Header
//                         as='h2'
//                         icon color='purple'
//                         textAlign='center'>
//                         <Icon
//                             name='puzzle piece'
//                             color='purple' />
//                         Register for DevChat
//                     </Header>
//                     <Form onSubmit={this.handleSubmit} size='large' >
//                         <Segment stacked>
//
//                             <Form.Input
//                                 fluid
//                                 icon='user'
//                                 iconPosition='left'
//                                 placeholder='Username'
//                                 type='text'
//                                 name='username'
//                                 onChange={this.handleClick}
//                                 value={username}
//                             />
//
//                             <Form.Input
//                                 fluid
//                                 icon='mail'
//                                 iconPosition='left'
//                                 placeholder='Email address'
//                                 type='email'
//                                 name='email'
//                                 onChange={this.handleClick}
//                                 value={email}
//                             />
//
//                             <Form.Input
//                                 fluid
//                                 icon='lock'
//                                 iconPosition='left'
//                                 placeholder='Password'
//                                 type='password'
//                                 name='password'
//                                 onChange={this.handleClick}
//                                 value={password}
//                             />
//
//                             <Form.Input
//                                 fluid
//                                 icon='repeat'
//                                 iconPosition='left'
//                                 placeholder='Password Confirmation'
//                                 type='password'
//                                 name='passwordConfirmation'
//                                 onChange={this.handleClick}
//                                 value={passwordConfirmation}
//                             />
//                             <Button color='purple' fluid size='large'>Submit</Button>
//                         </Segment>
//                     </Form>
//
//                     {errors.length > 0 && (
//                         <Message error>
//                             <h3>Error</h3>
//                             {this.displayErrors(errors)}
//                         </Message>
//                     )}
//
//                     <Message>Already a user? <Link to='/login'> Login</Link></Message>
//
//                 </Grid.Column>
//             </Grid>
//         )
//     }
// }












