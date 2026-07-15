import { useEffect, useState } from "react";

export default function useToast() {

    const [toast,setToast]=useState(null);

    function show(message,type="success"){

        setToast({

            message,

            type

        });

    }

    useEffect(()=>{

        if(!toast) return;

        const timer=setTimeout(()=>{

            setToast(null);

        },3000);

        return()=>clearTimeout(timer);

    },[toast]);

    return{

        toast,

        show

    };

}