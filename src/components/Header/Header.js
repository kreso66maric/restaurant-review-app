import React from 'react';

import Logo from '../../img/logo.png';
import './Header.css';

const Header = () => {
    return (
        <div>
            <div className="Header">
                <img src={Logo} alt="Logo" />
            </div>
        </div>
    );
}

export default Header;