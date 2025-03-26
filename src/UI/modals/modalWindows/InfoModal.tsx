import React, {useEffect, useState} from "react";

const InfoModal = ({ isVisible }: { isVisible: boolean }) => {
    const [animationClass, setAnimationClass] = useState('')
    // async function runAnimation() {
    //     setState(true)
    //     await sleep(4000)
    //     setState(false)
    //
    //     function sleep(time: number | undefined) {
    //         return new Promise((resolve) => setTimeout(resolve, time));
    //     }
    // }
    useEffect(() => {
        if (isVisible) {
            setAnimationClass('modal-show')
        } else {
            setAnimationClass('modal-hide')
        }
    }, [isVisible]);

    const ArrowUp = () => {
        const styles = {
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: '10px solid rgba(212, 213, 214, 0.8)',
        };

        return <div style={styles} className="absolute top-[-9px] left-[10px]" />;
    };

    return (
        <>
            <div
                className={`p-4 max-w-[200px] absolute rounded-md shadow-xl modal ${animationClass}`}
                style={{
                    backgroundColor: 'rgba(212, 213, 214, 0.8)'
                }}
            >
                <ArrowUp />
                <p className="font-roboto font-normal">Here is the information about the application. Use end-to-end encryption without registration.</p>
            </div>
        </>

    );
};
