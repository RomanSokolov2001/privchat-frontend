

const Label = ({label}: {label: string}) => {

    const labelStyle: any = {
        color: 'black',
        paddingLeft: '10px',
        paddingRight: '10px',
        paddingBottom: '5px',
        paddingTop: '5px',

    }

    return (
        <a style={labelStyle}>
            {label}
        </a>
    )
}

export default Label
