import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

function Empdatabase() {
  const [images, setImages] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [content, setContent] = useState('');
  const [created, setCreated] = useState('');
  const [tag, setTag] = useState('');
  const [searchInput, setSearchInput] = useState(''); // State for search input
  const [filteredImages, setFilteredImages] = useState([]); // State for filtered results
 
  useEffect(() => {
    fetchUsers();
  }, []);
  
  useEffect(() => {
    axios.get('/api/images')
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  

  const fetchUsers = async () => {
  
    const response = await axios.get('/users');

    setImages(response.data);


  };

  const handleEdit = (userId) => {
    setEditingUserId(userId);
    const user = images.find((images) => images._id === userId);
    setContent(user.content);
    setTag(user.tag);
    setCreated(user.created)

  }; 

  const handleSave = async (userId) => {
    const updatedUser = { content };
    const response = await axios.put(`/users/${userId}`, updatedUser);
    console.log(response.data);
    setEditingUserId(null);
    fetchUsers();
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setContent('');
  };

  const handleDelete = async (userId) => {
    const response = await axios.delete(`/users/${userId}`);
    console.log(response.data);
    fetchUsers();
  };

// Event handler for search input change
const handleSearchInputChange = (e) => {
  const searchTerm = e.target.value;
  setSearchInput(searchTerm);

  // Filter images based on content or tag containing the search term
  const filteredResults = images.filter((image) => {
    const contentMatch = image.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const tagMatch = image.tag?.toLowerCase().includes(searchTerm.toLowerCase());
    return contentMatch || tagMatch;
  });

  setFilteredImages(filteredResults);
};


  // Event handler to clear the search filter
  const clearFilter = () => {
    setSearchInput('');
    setFilteredImages(images); // Reset to show all images
  };
  
  return ( 
    <div className='text-light' >

<div className="products_search_panel">
        <input
          type="text"
          placeholder="Search &#128269;"
          value={searchInput}
          className="products_search_bar"
          onChange={handleSearchInputChange}
        />
        <button onClick={clearFilter} className="products_search_button">
          Clear Search
        </button>
      </div>

      <h1 className='ademp'>Your Memories</h1>
      <section><NavLink to='/EmpRegister' className='btnone ademp2'>Add New Post</NavLink></section>

      <br/> <br/> <br/> <br/>
     
     <div className='cardsfcuk'>
          
          {(searchInput.length>0 ? filteredImages: images).map((image) => (
            
            <tr key={image._id}>
              
                                <div class="card">
                    <div class="card__img">
                    <img className='emp-pic' src={image.avatar} />
                    </div>
                    <div class="card__descr-wrapper">
                      <p class="card__title">
                      {editingUserId === image._id ? (
                  <input
                    className="input"
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                  />
                ) : (
                  image.tag
                )}
                    </p>
                    <p class="card__descr">
                              {editingUserId === image._id ? (
                            <input
                              className="input"
                              type="text"
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                            />
                          ) : (
                            image.content
                          )}
                    </p>
                    <div class="card__links">
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="svg">&lt;<path d="M562.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L405.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C189.5 251.2 196 330 246 380c56.5 56.5 148 56.5 204.5 0L562.8 267.7zM43.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C57 372 57 321 88.5 289.5L200.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C416.5 260.8 410 182 360 132c-56.5-56.5-148-56.5-204.5 0L43.2 244.3z"></path></svg>
                        {editingUserId === image._id ? (
                  <input
                    className="input"
                    type="text"
                    value={created}
                    onChange={(e) => setCreated(e.target.value)}
                  />
                ) : (
                  image.created
                )}
                      </div>
                    </div>
                    </div>
                  </div>

              
              
             
              
              <td>
                {editingUserId === image._id ? (
                  <>
                    <section><button className='btnone btnemp' onClick={() => handleSave(image._id)}>Save</button>
                    <button  className='btnthree btnemp' onClick={handleCancelEdit}>Cancel</button></section>
                  </>
                ) : (
                  <>
                   <section><button className='btnone btnemp' onClick={() => handleEdit(image._id)}>Edit</button>
                    <button className='btnthree btnemp'  onClick={() => handleDelete(image._id)}>Delete</button></section>
                  </>
                )}
              </td>
             
            </tr>
            
          ))}

</div>







     
      <section><NavLink to='/logout' className='btnone'>Logout</NavLink></section>
    </div>
  );
}

export default Empdatabase;