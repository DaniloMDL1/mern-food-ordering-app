import { Spinner } from "./ui/spinner"

type Props = {
    size?: string,
    color?: string
}

const LoadingSpinner = ({ size, color }: Props) => {
    return <Spinner className={`${color ? color : "text-white"} ${size ? size : "size-6"}`}/>
}
export default LoadingSpinner