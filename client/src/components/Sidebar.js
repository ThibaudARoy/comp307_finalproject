import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar() {
    const [channels, setChannels] = useState({
        'final project': ['General', 'Random'],
        'frontend': ['React', 'JavaScript']
    });
    const [notifications, setNotifications] = useState({General: 3, Random: 0, React: 1, JavaScript: 0});
    const [open, setOpen] = useState({});

    const handleToggle = (group) => {
        setOpen(prevOpen => ({...prevOpen, [group]: !prevOpen[group]}));
    }

    return (
        <div className="sidebar">
            <h2>Channels</h2>
            {Object.entries(channels).map(([group, channels]) => (
                <div className="group" key={group}>
                    <h3 className="group-name" onClick={() => handleToggle(group)}>
                        <span className={`arrow ${open[group] ? 'open' : ''}`}>▶</span>
                        {group}
                    </h3>
                    {open[group] && (
                        <ul>
                            {channels.map(channel => (
                                <li className="channel" key={channel}>
                                    <a href={`/${channel}`} className={notifications[channel] > 0 ? 'unread' : 'read'}># {channel}</a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Sidebar;