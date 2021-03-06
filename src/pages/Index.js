import React, { Component, Fragment } from 'react';
import io from 'socket.io-client';
import ThemeContext from '../context/ThemeContext';
import Page from './base/Page';
import './styles/Index.css';

class Index extends Component {

  theme = this.context.theme
  room = null;

  state = {
    joined: false,
    user: JSON.parse(localStorage.getItem('user')) || null,
    users: []
  }

  componentDidMount() {
    this.room = io.connect(`https://room.xdbin.com/room`)
    this.room.on('join result', user => {
      this.setState({ user, joined: true })
      localStorage.setItem('user', JSON.stringify(user))
    })
    this.room.on('leave result', () => {
      this.setState({ user: null, joined: false })
      localStorage.clear()
    })
    this.room.on('users', users => {
      console.log(users)
      this.setState({ users })
    })
    this.room.on('user in', user => {
      this.setState({ users: [...this.state.users, user] })
    })
    this.room.on('user out', socketId => {
      console.log(this.state.users, this.state.users.filter(u => u.id !== socketId))
      this.setState({ users: this.state.users.filter(u => u.id !== socketId) })
    })
  }

  componentWillUnmount() {
    if (this.room) {
      this.room.disconnect()
    }
  }

  joinRoom = () => {
    const nickName = this.nickName.value.trim();
    const doing = this.doing.value.trim();
    this.room.emit('join', { nickName, doing })
  }

  reJoin = () => {
    const { nickName, doing } = this.state.user;
    this.room.emit('join', { nickName, doing })
  }

  leaveRoom = () => {
    this.room.emit('leave')
  }

  clear = () => {
    this.setState({ user: null, joined: false })
    localStorage.clear()
  }

  render() {
    if (this.context.theme !== this.theme) {
      this.theme = this.context.theme
    }
    const { joined } = this.state;
    return (
      <div className="index-page">
        {/* <div>
          <iframe
            frameborder="no"
            border="0"
            marginwidth="0"
            marginheight="0"
            width={298}
            height={52}
            src="//music.163.com/outchain/player?type=0&id=6837021688&auto=0&height=32"
          />
        </div> */}
        {
          this.state.user ?
            <Fragment>
              {
                !joined && <span className="font">[?????????]&nbsp;</span>
              }
              <span>?????????{this.state.user.doing}</span>&nbsp;
              <button onClick={joined ? this.leaveRoom : this.reJoin}>{joined ? '??????' : '????????????'}</button>&nbsp;
              {
                !joined && <button onClick={this.clear}>??????</button>
              }
            </Fragment>
            : <Fragment>
              <input type="text" ref={nickName => { this.nickName = nickName }} placeholder="??????~" style={{ width: '80px' }} />&nbsp;
              <input type="text" ref={doing => { this.doing = doing }} placeholder="??????????????????~" />&nbsp;
              <button onClick={this.joinRoom}>??????</button>
            </Fragment>
        }
        <div style={{ marginTop: '25px' }}>
          {
            this.state.users.map(u => <div key={u.id}><span className="font">{u.nickName}</span>&nbsp;??????&nbsp;<span className="font">{u.doing}</span></div>)
          }
        </div>
      </div >
    );
  }
}

Index.contextType = ThemeContext

export default Page(Index);
