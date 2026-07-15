import {useEffect} from "react";

export default function usePolling(

    callback,

    delay

){

    useEffect(()=>{

        const timer=setInterval(

            callback,

            delay

        );

        return()=>clearInterval(timer);

    },[callback,delay]);

}