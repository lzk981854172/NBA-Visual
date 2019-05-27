/**
 * Create New React Component
 * 1. import React from 'react'
 * 2. class TopBar extends React.Component
 * 3. implement `render` function
 * 4. export component
 */

import React from 'react';
import logo from '../assets/images/logo.svg';
import { Icon } from 'antd';

export class TopBar extends React.Component {
    render() {
        return (
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <div>Around</div>
                {
                    this.props.isLoggedIn ?
                        <div className="logout">
                            <a onClick={this.props.handleLogout}>
                                <Icon type="logout" />{' '}Logout
                            </a>
                        </div>: null
                }
            </header>
        );
    }
}