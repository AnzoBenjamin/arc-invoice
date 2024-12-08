/* eslint-disable */
import { useState, useEffect} from 'react'
import Clients from './clients'
import AddClient from '@/components/clients/add-client'
import { getClientsByUser } from '@/lib/actions/client-actions'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux-types'
import { useLocation, useNavigate } from 'react-router-dom'
import NoData from '../svg-icons/no-data'
import Spinner from '../spinner/spinner'


const ClientList = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const [open, setOpen] = useState<boolean>(false)
    const [currentId, setCurrentId] = useState<string>('')
    const dispatch = useAppDispatch()
    const userProfile = localStorage.getItem('profile')
    const user = userProfile ? JSON.parse(userProfile): {}
    const {clients} = useAppSelector((state) => state.clients)
    const isLoading = useAppSelector(state => state.clients.isLoading)
    // const clients = []

    
    // useEffect(() => {
    // }, [currentId, dispatch]);
    
//     useEffect(() => {
//         dispatch(getClients(1));
//         // dispatch(getClientsByUser({userId : user?.result?._id}));
//         // dispatch(getClientsByUser({ search :user?.result?._id, tags: tags.join(',') }));
//     },[location]
// )

useEffect(() => {
    dispatch(getClientsByUser(user?.result?._id || user.result.googleId ));
    console.log(clients)
  },[location, dispatch])

  if(!user) {
    navigate('/auth')
  }

  
  if(isLoading) {
    return  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '20px'}}>
        <Spinner />
    </div>
  }

  if(clients.length === 0) {
    return  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '20px', margin: '80px'}}>
      <NoData />
    <p style={{padding: '40px', color: 'gray', textAlign: 'center'}}>No customers yet. Click the plus icon to add customer</p>
  
    </div>
  }

    return (
        <div>
            <AddClient 
                open={open} 
                setOpen={setOpen}
                currentId={currentId}
                setCurrentId={setCurrentId}
            />
            <Clients 
                open={open} 
                setOpen={setOpen}
                currentId={currentId}
                setCurrentId={setCurrentId}
                clients={clients}
            />
        </div>
    )
}

export default ClientList

