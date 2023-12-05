import './ChannelTop.css';


function ChannelTop({channel}){
    return (
        <div className='top'>
            <p><span className="hashmark">#</span>{channel}</p>
        </div>
    );
}

export default ChannelTop;