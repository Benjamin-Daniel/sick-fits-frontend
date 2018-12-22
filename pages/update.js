import UpdateItem from '../components/UpdateItem';
import PleaseSignin from '../components/PleaseSignin';

const Sell = ({query}) => (
    <PleaseSignin>
        <UpdateItem id={query.id}/>
    </PleaseSignin>
)
export default Sell;