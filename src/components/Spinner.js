import {Puff} from 'react-loader-spinner'

export const Spinner = () => (
  <div className="d-flex justify-content-center ">
    <Puff 
        color='#cc6600'
        height={100}
        width={100}
    />
  </div>
)

export default Spinner