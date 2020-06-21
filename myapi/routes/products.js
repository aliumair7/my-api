var express = require('express');
var {Product,validate}=require('../models/product')
var multer=require('multer');
const app = require('../app');
var auth=require('../middlewares/auth')
var isadmin=require("../middlewares/isadmin")
var validater=require('../middlewares/validate');
const { findById } = require('../models/user');

var router = express.Router();


router.use(express.static('public'));


var storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+ '.jpg')
    }
})

var upload = multer({ storage: storage });


/* GET users listing. */
router.get('/',auth,isadmin,async function(req, res) {
    console.log(req.user)
  let products=await Product.find()
  res.send(products)
});

router.post('/',validater,upload.single('photo'), async function(req, res) {
    
    var products=new Product()
    products.name=req.body.name;
    products.price=req.body.price;
    products.details=req.body.details;
    products.photo=req.file.path
    console.log(req.filename)
     await products.save()

    res.send(products)
  });

  router.delete('/:id',async function(req, res) {
    let products=await Product.findByIdAndDelete(req.params.id)
    res.send(products)
  });
  
  

  router.put('/:id',upload.single('photo'),async function(req, res) {
    let products=await Product.findById(req.params.id)
    products.name=req.body.name;
    products.price=req.body.price;
    products.details=req.body.details;
    products.photo=req.file.path;

    await products.save()

    
    res.send(products)
  });

router.get('/cart/:id',async function(req,res){
    let products=await Product.findById(req.params.id)

    let cart=[]
    if(req.cookies.cart) cart=req.cookies.cart;
    cart.push(products)
    res.cookie("cart",cart)

    carts=req.cookies;

    res.send(carts)


})





module.exports = router;
