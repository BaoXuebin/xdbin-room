import React, { Component, Fragment } from 'react';
import io from 'socket.io-client';

import Page from './base/Page';
import ThemeContext from '../context/ThemeContext';

import './styles/Index.css'

class Index extends Component {

  theme = this.context.theme
  room = null;

  state = {
    joined: false,
    user: JSON.parse(localStorage.getItem('user')) || null,
    users: []
  }

  componentDidMount() {
    this.room = io.connect('http://localhost:3000/room')
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
        {
          this.state.user ?
            <Fragment>
              {
                !joined && <span className="font">[未连接]&nbsp;</span>
              }
              <span>我正在{this.state.user.doing}</span>&nbsp;
              <button onClick={joined ? this.leaveRoom : this.reJoin}>{joined ? '离开' : '重新加入'}</button>&nbsp;
              {
                !joined && <button onClick={this.clear}>清除</button>
              }
            </Fragment>
            : <Fragment>
              <input type="text" ref={nickName => { this.nickName = nickName }} placeholder="昵称~" style={{ width: '80px' }} />&nbsp;
              <input type="text" ref={doing => { this.doing = doing }} placeholder="正在做的事情~" />&nbsp;
              <button onClick={this.joinRoom}>加入</button>
            </Fragment>
        }
        <div style={{ marginTop: '25px' }}>
          {
            this.state.users.map(u => <div key={u.id}><span className="font">{u.nickName}</span>&nbsp;正在&nbsp;<span className="font">{u.doing}</span></div>)
          }
        </div>
      </div>
    );
  }
}

Index.contextType = ThemeContext

export default Page(Index);
