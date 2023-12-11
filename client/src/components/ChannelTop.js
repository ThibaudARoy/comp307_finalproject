import './ChannelTop.css';
import hamburger from "../assets/hamburger.png"
import arrow from "../assets/arrow_back.png"


function ChannelTop({channel, onToggleSidebar, isSidebarVisible}){
    return (
        <div className={`top ${isSidebarVisible ? "" : "collapsed"}`}>
            <button className="toggle-sidebar-btn" onClick={onToggleSidebar}>
                <img className="collapseIcon" src={isSidebarVisible?  hamburger: hamburger}></img>
            </button>
            <p><span className="hashmark">#</span>{channel}</p>
        </div>
    );
}

export default ChannelTop;