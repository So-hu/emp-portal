import {Component} from 'react';
import {logOut} from "../store/actions";
import store from '../store/store';


class LogoutPage extends Component {

  componentWillMount() {
    store.dispatch(
      logOut()
    )
    this.props.history.push('/')
  }

  render() {
  return null
  }
}

export default LogoutPage;