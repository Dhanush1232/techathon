const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs')
const cookieParser = require("cookie-parser");
router.use(cookieParser());

// Middlewares
const authenticate = require("../middleware/authenticate");
const sendEmail = require("../middleware/sendEmail");
const upload = require('../middleware/upload');

//DB
require('../db/conn');

//Schema

const adminSchema = require('../model/adminSchema');
const emplyeeSchema = require('../model/employeeSchema');
const productSchema = require('../model/productSchema');
const orderSchema = require('../model/orderSchema');
const reviewSchema = require('../model/reviewSchema');

//cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});






//  ------------------------------- PAGES --------------------------------------------------------------

//Logout page
router.get("/logout", (req,res) => 
{
    console.log("User Logged Out");
    res.clearCookie('jwtoken', {path: '/'});
    res.status(200).send("User Logout");
});


router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "please fill the empty fields..." });
  }
  try {
    const userExist = await adminSchema.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "email already exist" });
    } else {
      const user = adminSchema({ name, email, password });

      await user.save();
      res.status(201).json({ message: "user registered successfully..." });
    }
  } catch (err) {
    console.log(err);
  }
});




// Admin Login Page
router.post('/adminsignin', async (req,res)=>{
    try
    {
        let token;
        const { email, password}=req.body;
 
        if(!email || !password){
         console.log("Please fill the data");
         return res.status(400).json({errror:"Please fill the data"})
        }
 
        const userLogin = await adminSchema.findOne({email:email}); 
       
        if(userLogin)
        {
           const isMatch = await bcrypt.compare(password, userLogin.password);
           token = await userLogin.generateAuthToken();
           res.cookie("jwtoken",token,{
             expires:new Date(Date.now()+ 25892000),
             httpOnly:true
           });
           if(!isMatch)
           {
             console.log("Invalid Credentials");
             return res.status(400).json({error:"Invalid Credentials"});
           }
           else
           {
             console.log("Admin SignIn Successful");
           res.json({message:"Admin SignIn Successful"});
           }
        }
        else
        {
         console.log("Email you have entered has not registered or incorrect");
         return res.status(400).json({error:"Email you have entered has not registered or incorrect"});
        }
     }  
     catch(err)
     {
        console.log(err);
     }
 })
 
// admin Registration Page
router.post('/adminregister', async(req,res)=>{
 
    const { email, password, cpassword} = req.body;
   
    if(!email || !password || !cpassword)
    {
        console.log("please fill the field properly");
        return res.status(422).json({error: "please fill the field properly"});
    }
    if(password != cpassword)
    {
        console.log("please confirm the same password");
        return res.status(422).json({error: "please confirm the same password"});
    }

    try{ 

        const userExist = await adminSchema.findOne({ email: email });
      
        if(userExist){
            console.log("Email already exists");
        return res.status(422).json({ error: "Email already exists"});
        }

        const user = new adminSchema({email, password, cpassword}); 

       const userRegister = await user.save();

        if(userRegister){
            console.log(user);
            console.log("user registered successfully");
            res.status(201).json({ message: "user registered successfully"});
        }
        else{
            console.log("failed to register");
            res.status(500).json({error: "failed to register"});
        }
    

    }
    catch(err){
        console.log(err);
    }
 
});

















// Employee Registration Page


router.post('/api/images', authenticate, upload.single('image'), async (req, res) => {

   const { content, tag} = req.body;

   const user = await adminSchema.findOne({_id:req.userID})

  if (!content || !tag) {
    console.log('Please fill the fields properly');
    return res.status(422).json({ error: 'Please fill the fields properly' });
  }

  const result = await cloudinary.uploader.upload(req.file.path);


  // Create a new post
  const post = {
    content,
    tag,
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: req.file.path,
    avatar: result.secure_url,
  };

  // Push the new post into the user's posts array
  user.posts.push(post);

  try {
    await user.save(); // Save the user with the new post
    console.log('Post created successfully');
    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Failed to create a post:', error);
    res.status(500).json({ error: 'Failed to create a post' });
  }

});


//to get all data with images
// router.get('/api/images', authenticate, aysnc(req, res) => {

//   const user=await userSchema.findOne({_id:req.userID});

//   try{

//   adminSchema.find()
//     .sort('-created')
//     .then((images) => {
//       res.json(images);
//     })
//     .catch((err) => {
//       res.status(500).json({ success: false, error: err.message });
//     });
  
      
// });


router.get('/api/images', authenticate, async (req, res) => {
  // Get the user ID from the authentication middleware

  try {
    // Find the user by their ID and retrieve their posts
    const user = await adminSchema.findOne({_id:req.userID});
    const userPosts = user ? user.posts : [];

    res.json(userPosts);
  } catch (error) {
    console.error('Error while fetching user images:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user images' });
  }
});


// Get an employee by ID (Dynamic page)
router.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await emplyeeSchema.findById(req.params.id);
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employee details' });
  }
});

// // Route to get all employees after registration
// router.get('/employees', async (req, res) => {
//   try {
//     const employees = await emplyeeSchema.find();
//     res.json(employees);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Employee Login Page

router.post('/employeesignin', async (req,res)=>{
    try
    {
        let token;
        const { email, password}=req.body;
 
        if(!email || !password){
         console.log("Please fill the data");
         return res.status(400).json({errror:"Please fill the data"})
        }
 
        const userLogin = await emplyeeSchema.findOne({email:email}); 
       
        if(userLogin)
        {
           const isMatch = await bcrypt.compare(password, userLogin.password);
           token = await userLogin.generateAuthToken();
           res.cookie("jwtoken",token,{
             expires:new Date(Date.now()+ 25892000),
             httpOnly:true
           });
           if(!isMatch)
           {
             console.log("Invalid Credentials");
             return res.status(400).json({error:"Invalid Credentials"});
           }
           else
           {
             console.log("Employee SignIn Successful");
           res.json({message:"Employee SignIn Successful"});
           }
        }
        else
        {
         console.log("Email you have entered has not registered or incorrect");
         return res.status(400).json({error:"Email you have entered has not registered or incorrect"});
        }
     }  
     catch(err)
     {
        console.log(err);
     }
 })
 
//to get data for employee
 router.get("/getData1",authenticate, (req,res) => 
 {
     res.send(req.rootUser);
 });

// handle GET request for all users
router.get('/users', (req, res) => {
  emplyeeSchema.find((err, users) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(users);
      }
    });
  });

// handle PUT request for editing a user
router.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    
    // find and update the user in the database
    emplyeeSchema.findByIdAndUpdate(userId, updatedUser, { new: true }, (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(`User ${user.name} updated successfully!`);
      }
    });
  });  

// handle DELETE request for deleting a user
router.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    
    // find and remove the user from the database
    emplyeeSchema.findByIdAndRemove(userId, (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(`User ${user.name} deleted successfully!`);
      }
    });
  });




  
  //sending gmail
  router.post('/send-notification', (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const work = req.body.work;
    const subject = 'WireHub-Job Appointment';
    const message = `
    Dear ${name},
    
    I am pleased to inform you that you have been selected for the position of ${work} at WireHub Company. We were impressed with your qualifications, experience, and enthusiasm for the role, and believe that you would be a great addition to our team.
    
    Your interview and application stood out among a competitive pool of candidates, and we are excited to offer you the job. Joining date will be revealed in upcoming mail.
    
    Once again, congratulations on your appointment to this exciting position at WireHub Company. We look forward to welcoming you to our team and working with you towards our mutual success.
    
    Best regards,
    
    Manager - WireHub
    Wirehub Company
    `;
  
    sendEmail(email, subject, message);
    res.send('Email sent');
  });
















//Add Product

router.post('/addproduct', upload.single('image'), async (req, res) => {

  const { name, model_id, type, category, description, price, discount, special_discount, quantity } = req.body;
 
  if(!name || !model_id || !type || !category || !description || !price || !discount || !special_discount || !quantity)
  {
      console.log("please fill the field properly");
      return res.status(422).json({error: "please fill the field properly"});
  }

  try{
      const userExist = await productSchema.findOne({ name: name });
    
      if(userExist){
          console.log("Product already exists");
          return res.status(422).json({ error: "Product already exists"});
      }
  }
  catch(err){
    console.log(err);
  }

  const result = await cloudinary.uploader.upload(req.file.path)

  const image = new productSchema({
    name: req.body.name,
    model_id: req.body.model_id,
    type: req.body.type,
    category: req.body.category,
    description: req.body.description,
    price: req.body.price,
    discount: req.body.discount,
    special_discount: req.body.special_discount,
    quantity: req.body.quantity,
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: req.file.path,
    avatar : result.secure_url
  });
   const userimage = await image.save()
    if(userimage){
      console.log(image);
          console.log("Product Added successfully");
             res.status(201).json({ message: "Product Added successfully"});
    }
    else{
      console.log("failed to add Product");
          res.status(500).json({error: "failed to add Product"});
    };
});

//to get all data with images
router.get('/product/images', (req, res) => {
  productSchema.find()
    .sort('-created')
    .then((images) => {
      res.json(images);
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message });
    });
});

// handle GET request for all Products
router.get('/products', (req, res) => {
  productSchema.find((err, users) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(users);
    }
  });
});

// handle PUT request for editing a Products
router.put('/products/:id', (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;
  
  // find and update the Products in the database
  productSchema.findByIdAndUpdate(userId, updatedUser, { new: true }, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(`User ${user.name} updated successfully!`);
    }
  });
});  

// handle DELETE request for deleting a Products
router.delete('/products/:id', (req, res) => {
  const userId = req.params.id;
  
// find and remove the Products from the database
  productSchema.findByIdAndRemove(userId, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(`User ${user.name} deleted successfully!`);
    }
  });
});






//accessing review schema
//to get all reviews with images
router.get('/review/images', (req, res) => {
  reviewSchema.find()
    .sort('-created')
    .then((images) => {
      res.json(images);
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message });
    });
});

// handle GET request for all Products
router.get('/reviews', (req, res) => {
  reviewSchema.find((err, users) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(users);
    }
  });
});

//accessing order schema
//to get all orders with images
router.get('/order/images', (req, res) => {
  orderSchema.find()
    .sort('-created')
    .then((images) => {
      res.json(images);
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message });
    });
});

// handle GET request for all Products
router.get('/orders', (req, res) => {
  orderSchema.find((err, users) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(users);
    }
  });
});



//Export to app.js
module.exports = router;