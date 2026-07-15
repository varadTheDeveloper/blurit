import "./RefreshBanner.css";

function RefreshBanner({

    count,

    visible,

    onRefresh

}){

    if(!visible){

        return null;

    }

    return(

        <button

            className="refresh-banner"

            onClick={onRefresh}

        >

            ▲ {count} new {count===1?"post":"posts"}

            <span>

                Click to refresh

            </span>

        </button>

    );

}

export default RefreshBanner;