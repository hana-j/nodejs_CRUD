import React ,{useEffect,useState}from 'react'
import {Row, Col, List, Avatar} from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
function VideoDetailPage(props) {
    
    const videoId = props.match.params.videoId
    const variable = {videoId:videoId}

    const [VideoDatail, setVideoDatail] = useState([])

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response=>{
                if(response.data.success){
                    setVideoDatail(response.data.VideoDatail)
                }else{
                    alert('비디오 저오를 가져오기 실패했습니다.')
                }
            })
    }, [])
    if(VideoDatail.writer){
        return (
            <Row gutter={[16,16]}>
                <Col lg={18} xs={24}>
                     <div style={{width:'100%', padding:'3rem 4rem'}}>
                         <video style={{width:'100%'}} src={`http://localhost:5000/${VideoDatail.filePath}`} controls/>
                         <List.Item
                             actions={[<Subscribe userTo={VideoDatail.writer._id}/>]}
                             >
                                 <List.Item.Meta
                                     avatar={<Avatar src={VideoDatail.writer.image}/>}
                                     tittle={VideoDatail.writer.name}
                                     description={VideoDatail.description}
                                     />
                             </List.Item>
                             {/*Comments  */}   
                     </div>
     
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo/> {/**컴포넌트 */}
                </Col>
            </Row>
         )
    }else{
        return (
            <div>Loading</div>
        )
    }
    
}

export default VideoDetailPage
