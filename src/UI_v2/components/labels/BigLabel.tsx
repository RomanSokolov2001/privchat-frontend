

const BigLabel = ({label, color = 'black'}: {label: string, color?: string}) => {

    const labelStyle: any = {
        color: color,
        fontWeight: 'bold',
        fontSize: '35px',
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

export default BigLabel
