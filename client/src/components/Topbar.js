import React from 'react';
import './Topbar.css';
import Button from 'react-bootstrap/Button';

function Topbar({boardName}) {
    return (
        <div className="topbar">
            <div>
                <Button variant="danger" className='switch-button'>←  Switch Board</Button>
            </div>
            <div className='search-bar'>
                <input type="search" placeholder={`Search ${boardName}...`} />
            </div>
        </div>
    );
}

export default Topbar;