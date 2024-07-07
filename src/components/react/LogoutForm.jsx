import Axios from 'axios';
export const LogoutForm = () => { 
    const onSumbitHandler = (event) => {
        event.preventDefault();
        Axios.post('/api/logout.json', {
        }).then((response) => {
            if (response.status === 200) {
                alert('Logout success');
                window.location.href = '/login';
            } else { 
                alert(response.data.message || 'Logout failed');
            }
        }).catch((error) => {
            alert(error.message || 'Logout failed');
        });
    }
    return (
        <form onSubmit={onSumbitHandler}>
        <button type="submit" >Logout</button>
        </form>
    );
}