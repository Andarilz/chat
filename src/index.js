import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import {BrowserRouter as Router, Route, Switch, withRouter} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import 'semantic-ui-css/semantic.min.css';
import firebase from './Firebase/Firebase'

class Root extends React.Component {

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => { //проверка входа
            if(user){
                // this.props.history.push('/') //редирект
            }
        })
    }

    render(){
        return (
                <Switch>
                    <Route path='/' component={App} exact />
                    <Route path='/login' component={Login} />
                    <Route path='/register' component={Register} />
                </Switch>
        )
    }
}

const RootWithRouter = withRouter(Root)



ReactDOM.render(
    <Router>
        <RootWithRouter />
    </Router>
    ,
  document.getElementById('root')
);

