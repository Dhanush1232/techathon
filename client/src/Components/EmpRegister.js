import React,{useState} from 'react'
import {  NavLink, useNavigate} from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.css"
import pic from '../images/signup.png'
import swal from 'sweetalert';
import axios from 'axios';


const EmpRegister = () =>
{
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const [user,setUser] = useState({
        content:"",tag:"",
    });
    let name, value;  
    const handleInputs = (e) => {
        console.log(e);
        name = e.target.name;
        value = e.target.value;

        setUser({...user, [name]:value});
    }
    const PostData = async (e) => 
    {

        e.preventDefault();

        console.log(user._id);
       
        
         const formData = new FormData();
         formData.append('content', user.content);
         formData.append('tag', user.tag);
         formData.append('image', image);

         formData.append('userId', user._id);


         axios.post('/api/images', formData)
         .then((response) => {
            swal("Congratulations!", "sucess");
            console.log("Registration Successful");
            navigate("../Empdatabase");
            console.log(response);
          })
          .catch((error) => {
            swal("Invalid Registration!", "Fill Properly Or The Email You Have Entered is Already Registered!", "error");
            console.log(error);
          });

        //   const email = user.email;
        //   const name = user.name;
        //   const work = user.work;

        //   axios.post('/send-notification', { email , name , work })
        //   .then(response => console.log(response.data))
        //   .catch(error => console.log(error));
         
        
    }

    

   return(
    <>
    <div className='M signup1'>
     <div className='signup-a a'>
        <h2 className='align1 animated infinite fadeIn'></h2>
        
        <form method='POST'>
                            <div>
                                <label htmlFor='Content'>
                                <i class="zmdi zmdi-account materials-icons-name"></i>
                                </label>
                                <input type="text" name="content" autoComplete='off' value={user.name} onChange={handleInputs} placeholder='Memories'/>
                            </div>

                            <div>
                                <label htmlFor='Tag'>
                                <i class="zmdi zmdi-account materials-icons-name"></i>
                                </label>
                                <input type="text" name="tag" autoComplete='off' value={user.name} onChange={handleInputs} placeholder=' #tag #beach #temple'/>
                            </div>

                           
                            <div className='image-container'>
                                <label htmlFor='image'>
                                <i class="fa fa-picture-o image-icon" aria-hidden="true"></i>
                                </label>
                                <input type="file" className='imageinput' onChange={(e) => setImage(e.target.files[0])} />
                            </div>

                           

                            <div>
                                <input type="submit" class="signup-submit1 align-2" value="Add new Post" onClick={PostData} />                        
                            </div>
                            <div>
                            <section><NavLink to='/Empdatabase' className='btnone ademp2'>My memories</NavLink></section>
                            </div>
        </form>
        </div>
        <div className='signup-b b'>
            <img src={pic} alt="registration pic" className='img'/><br/>
        </div>
    </div>   
    </>
   )
}

export default EmpRegister