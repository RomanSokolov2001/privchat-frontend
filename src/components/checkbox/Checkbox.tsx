import { useState } from "react"
import "./styles.css"

const Checkbox = ({state, setState}:{state: boolean, setState: () => void}) => {
    return (
        <div>
            <label className="container">
                <input type="checkbox" checked={state} onClick={setState} />
                <span className="checkmark"></span>
            </label>
        </div>

    )
}

export default Checkbox