import { useEffect, useState } from "react";

export const useTime = () => {
    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(Date.now());
        }, 500);

        return () => clearInterval(intervalId);
    }, []);

    return time;
};
