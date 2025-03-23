import "./IconButton.css";

const IconButton = ({
                              imgSrc,
                              onClick = () => {},
                              size = 30,
                          }: {
    imgSrc: string;
    onClick?: any;
    size?: number;
}) => {
    return (
        <div className="icon-button-container" onClick={onClick}>
            <img src={imgSrc} width={size} height={size} className="icon-button" />
        </div>
    );
};

export default IconButton;
