import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import Config from '../../config/Config';
import ThemeContext from '../../context/ThemeContext';
import './styles/PageWrapper.css';

class PageWrapper extends Component {
  render() {
    let { theme } = this.context;
    return (
      <div className={`${theme}-theme`}>
        <div className="wrapper">
          <header>
            <nav className="navbar">
              <div className="container">
                <div className="navbar-header header-logo" to="/">
                  {/* <img src={LogoImage} width="16" height="16" /> */}
                  {Config.title}
                </div>
                <div className="menu navbar-right">
                  <Link to="/">主页</Link>
                  <Link to="/about">关于</Link>
                  <ThemeToggle />
                </div>
              </div>
            </nav>
          </header>
          <div className="main">
            <div className="main-wrap">
              {this.props.children}
            </div>
          </div>
          <footer className="footer">
            <div className="copyright">
              © 2021&nbsp;&nbsp;
              <a href="https://github.com/BaoXuebin/xdbin-room">Github</a>&nbsp;|&nbsp;
              <a href="https://xdbin.com">主页</a>
            </div>
          </footer>
        </div>
      </div>
    )
  }
}

PageWrapper.contextType = ThemeContext;

export default PageWrapper;