import Axios from 'axios'
import React ,{useEffect, useState} from 'react'
import { FaUserSecret } from 'react-icons/fa'

function Subscribe(props) {
    
    const [subscribeNumber, setsubscribeNumber] = useState(0);
    const [Subsrcibed, setSubscribed] = useState(false)
    useEffect(() => {
        let variable = {userTo:props.userTo}
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response =>{
                if(response.data.success){
                    setsubscribeNumber(response.data.subscribeNumber)
                }else{
                    alert('구독자 수 정보를 받아오지 못했습니다.')
                }
            })
            let subsrcibedVariable = {userTo:props.userTo, userForm : localStorage.getItem('userId')}
            Axios.post('/api/subscribe/subsribed', subsrcibedVariable )
                .then(response=>{
                    if(response.data.success){
                        setSubscribed(response.data.subscribed)
                    }else{
                        alert('정보를 받아오지 못했습니다.')
                    }
                })
    }, [])
    return (
        <div>
           <button
                style={{backgroundColor:`${Subscribe ?'#AAAAAA':'#CC0000'}`, borderRadius:'4px',
                color:'white', padding:'10px 16px',
                fontWeight:'500', fontSize:'1rem', textTransform:'uppercase'
            }}
            onClick
           >
             {subscribeNumber} {Subsrcibed ? 'Subscribed':'Subsribe'}
           </button>
        </div>
    )
}

export default Subscribe
