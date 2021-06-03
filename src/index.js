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
import {setUser} from "./actions";
import Spinner from "./components/Spinner";

const store = createStore(rootReducer, composeWithDevTools())


class Root extends React.Component {

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => { //проверка входа
            if(user){
                this.props.setUser(user)
                this.props.history.push('/') //редирект
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
        isLoading: state.user.isLoading
    }
}

const RootWithRouter = withRouter(
    connect(
        mapStateToProps,
        {setUser}
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

