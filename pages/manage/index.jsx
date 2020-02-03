import withApollo from '../../components/apollo';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

function Manage() {
    const { data, error } = useQuery(gql`{
        me {
            id
        }
    }`)
    if (data) {
        return (<p>Your user ID: {data.me.id}</p>)
    } else if (error) {
        return (<p>Error!</p>);
    } else {
        return (<p>Loading...</p>);
    }
}

export default withApollo(() => <Manage />);