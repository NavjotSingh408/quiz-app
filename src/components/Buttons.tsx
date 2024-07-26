interface titleprop{
    text:string
    clickfn : React.MouseEventHandler<HTMLButtonElement>
}

const Buttons:React.FC<titleprop> = ({text,clickfn}) => {
  return (
    <button className=" button-6" onClick={clickfn}>{text}</button>
  )
}

export default Buttons