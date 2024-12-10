import './styles.css'

const HamburgerMenu = ({onClick}:{onClick:()=>void}) => {
    return (
        <>
            <input id="burger-checkbox" type="checkbox" onClick={onClick}/>
            <label className="burger" htmlFor="burger-checkbox">
                <span></span>
                <span></span>
                <span></span>
            </label>
        </>
    )
}

export default HamburgerMenu