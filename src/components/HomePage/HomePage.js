import React, { Component } from 'react';

import MainPanel from '../MainPanel/MainPanel';
import Logo from '../../img/logo.png';
import './HomePage.css';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            homePage: true
        }
        this.startApp = this.startApp.bind(this)
    }

    startApp() {
        // Set home page to false and show main panel
        this.setState({
            homePage: false
        })
    }


    render() {
        return (
            <div>
                {this.state.homePage 
                ? 
                <div className="HomePage-container">
                    <h1 className="HomePage-title">Restaurant Review App</h1>
                    <img className="HomePage-logo" src={Logo} alt="Logo" />
                    <button className="HomePage-start-button" onClick={this.startApp}>Start</button>
                </div>
                : 
                <MainPanel />
                }
            </div>
        );
    }
}

export default HomePage;
