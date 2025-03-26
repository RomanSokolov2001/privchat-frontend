
const CustomIcon = ({
  icon,
  onClick = () => { },
  w = 30,
  h = 30,
}: {
  icon: string;
  onClick?: any;
  w?: number;
  h?: number;
}) => {
  return (
    <div className={`p-2 cursor-pointer w-[40px] h-[40px]`}>
      <img
        src={icon}
        width={w}
        height={h}
        onClick={onClick}
      />
    </div>

  );
};

export default CustomIcon
