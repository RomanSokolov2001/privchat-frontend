import {FormEvent, useState} from "react";
import OutlinedButton from "./buttons/OutlinedButton";

const DropdownMenu = () => {
    const [isOpen, setOpen] = useState(false);
    const vars = ['lol', 'lol2', 'lol3', 'lol4']

    return (
        <div className='relative flex items-center justify-center'>
            <OutlinedButton text={"Click me"} onClick={()=>{setOpen(!isOpen)}}/>
            <div>
                {vars[0]}
            </div>
            {isOpen && <div className={'absolute'}>
                {vars.map((item: any) => {
                    return (
                        <div>
                            <a>{item}</a>
                        </div>
                    )
                })}
            </div>}
        </div>
    )
}

export default DropdownMenu;
