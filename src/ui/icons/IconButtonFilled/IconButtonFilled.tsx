import "./IconButtonFilled.css";

const IconButtonFilled = ({
                              imgSrc,
                              onClick = () => {},
                              size = 30,
                          }: {
    imgSrc: string;
    onClick?: any;
    size?: number;
}) => {
    return (
        <div className="icon-button-filled-container" onClick={onClick}>
            <img src={imgSrc} width={size} height={size} className="icon-button-filled" />
        </div>
    );
};

export default IconButtonFilled;
