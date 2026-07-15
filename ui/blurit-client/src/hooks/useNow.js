import { useEffect, useState } from "react";

export default function useNow() {

    const [now, setNow] = useState(Date.now());

    useEffect(() => {

        const interval = setInterval(() => {

            setNow(Date.now());

        }, 60000);

        return () => clearInterval(interval);

    }, []);

    return now;

}