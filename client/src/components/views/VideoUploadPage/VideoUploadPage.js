import React,{useState} from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import {useSelector} from 'react-redux';


const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [ 
    {value:0, label:"Private"},
    {value:1, label:"Public"}
]
const CategoryOptions =[
    {value:0, label:"Film & Animation"},
    {value:1, label:"Autos & Vehicles"},
    {value:2, label:"Music"},
    {value:3, label:"Pets & Animals"}
]



function VideoUploadPage(props) {
    const user = useSelector(state => state.user);
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Animation")   //기본값 "Film & Animation"
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    {/**click했을때 이벤트를 발생시켜 입력을 할수 있게해줌  */}
    const onTitleChange = (event) =>{
        setVideoTitle(event.currentTarget.value)
    }
    const onDescriptionChange = (event)=>{
        setDescription(event.currentTarget.value)
    }
    const onPrivateChange = (e)=>{
        setPrivate(e.currentTarget.value)
    }
    const onCategoryChange = (e) =>{
        setCategory(e.currentTarget.value)
    }
    //비디오 파일 업로드
    const onDrop = (files)=>{
        let formData = new FormData;
        const config = {
            header: {'content-type' : 'multipart/form-data'}
        }
        formData.append("file",files[0])
        
        Axios.post('/api/video/uploadfiles',formData, config)
            .then(response=>{     
                if(response.data.success){   //true 서버에서 파일경로랑 파일이름 보내줌 
                    console.log(response.data)

                    let variable = {
                        url:response.data.url,
                        fileName: response.data.fileName
                    }

                    setFilePath(response.data.url)

                    //섬네일
                    Axios.post('/api/video/thumbnail', variable)
                    .then(response =>{
                        if(response.data.success){
                            console.log(response.data)
                            setDuration(response.data.fileDuration)
                            setThumbnailPath(response.data.url)
                        }else{
                            alert('썸네일 생성에 실패했습니다.')
                        }
                    })


                    
                }else{     //서버에서 업로드 실패로 false반환하면 실행
                    alert('비디오 업로드를 실패했습니다.')
                }
            })
    }

  
    //비디오 정보 업로드
    const onSubmit = (e)=>{
        e.preventDefault();
        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath
        }
        Axios.post('/api/video/uploadVideo', variables)
           .then(response=>{
               if(response.data.success){
                message.success('성공적으로 업로드를 했습니다.')
                setTimeout(()=>{
                    props.history.push('/')
                },3000)
                
               }else{
                   alert('비디오 업로드에 실패 했습니다.')
               }
           })
    }
    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2} > Upload Video</Title>
            </div>
            <Form onSubmit={onSubmit}>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        {/**드랍다운 */}
                        <Dropzone
                        onDrop={onDrop}
                        multiple={false} /**한개만 */
                        maxSize={10000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />

                            </div>
                        )}
                    </Dropzone>
                        {/**썸네일이 있을 때만 보여준다.{ThumbnailPath && } 이거 사용해서 ㅇㅇ */} 
                        {ThumbnailPath && 
                             <div>
                                <img src={`http://localhost:5000/${ThumbnailPath}`}alt="thumbnail"/>
                            </div>
                        }
                       
                    </div>
                   <br/>
                   <br/>
                   <label>Title</label>
                   <Input
                        onChange={onTitleChange}
                        value={VideoTitle}
                    />
                    <br/>
                   <br/>
                   <label>Description</label>
                   <TextArea
                        onChange={onDescriptionChange}
                        value={Description}
                    />
                     <br/>
                   <br/>
                   <select onChange={onPrivateChange}>
                       {/**위에 옵션들을 정의해두고 map으로 하나씩 주기 */}
                       {PrivateOptions.map((item, index)=>(
                            <option key={index} value={item.value}>{item.label}</option>
                      ))}
                       
                   </select>
                   <br/>
                   <br/>
                   <select onChange={onCategoryChange}>
                      {CategoryOptions.map((item, index)=>(
                            <option key={index} value={item.value}>{item.label}</option>
                      ))}
                        
                   </select>
                   <br/>
                   <br/>
                <Button type={'primary'} size='large' onClick={onSubmit}>Submit</Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage
