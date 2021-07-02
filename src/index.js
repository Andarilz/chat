import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import {BrowserRouter as Router, Route, Switch, withRouter} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import 'semantic-ui-css/semantic.min.css';
import firebase from './Firebase/Firebase';
import {createStore} from "redux";
import {Provider, connect} from "react-redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './reducers';
import {clearUser, setUser} from "./actions";
import Spinner from "./components/Spinner";
import axios from "axios";

const store = createStore(rootReducer, composeWithDevTools())


class Root extends React.Component {

    state = {
        user: {}
    }

    componentDidMount() {

         firebase.auth().onAuthStateChanged(user => { //проверка входа
            if(user){ //был вход
                this.props.setUser(user)
                setTimeout(() => {
                    // this.props.history.push('/') //редирект при регистрации
                },1000)
            }

            else {
                this.props.history.push('/login') //редирект без регистрации
                this.props.clearUser()
            }
        })
    }

    render(){
        return this.props.isLoading ? <Spinner /> : (
                <Switch>
                    <Route path='/' component={App} exact />
                    <Route path='/login' component={Login} />
                    <Route path='/register' component={Register} />
                </Switch>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.user.isLoading,
        currentUser: state.user.currentUser,
        avatar: state.avatar.avatar
    }
}

const RootWithRouter = withRouter(
    connect(
        mapStateToProps,
        {setUser, clearUser} //передаем пользователя в редакс
        )(Root)
)




ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootWithRouter />
        </Router>
    </Provider>
    ,
  document.getElementById('root')
);

