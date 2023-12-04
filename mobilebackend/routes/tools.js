const express = require('express');

const { Tool } = require('../models/tool');
const { Category } = require('../models/category');

const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) =>{
    console.log(req.query)
    let filter = {};
    if(req.query.categories)
    {
         filter = {category: req.query.categories.split(',')}
    }

    const toolList = await Tool.find(filter).populate('category');

    if(!toolList) {
        res.status(500).json({success: false})
    } 
    res.send(toolList);
})

router.get(`/:id`, async (req, res) =>{
    const tool = await Tool.findById(req.params.id).populate('category');

    if(!tool) {
        res.status(500).json({success: false})
    } 
    res.send(tool);
})

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let tool = new Tool({
        name: req.body.name,
        description: req.body.description,
        image: `${basePath}${fileName}`, 
        brand: req.body.brand,
        type: req.body.type,
        category: req.body.category,
        countInStock: req.body.countInStock,
        isFeatured: req.body.isFeatured
    });

    tool = await tool.save();

    if (!tool) return res.status(500).send('The tool cannot be created');

    res.send(tool);
});

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    console.log(req.body);
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Tool Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const tool = await Tool.findById(req.params.id);
    if (!tool) return res.status(400).send('Invalid Tool!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = tool.image;
    }

    const updatedTool = await Tool.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            image: imagepath,
            brand: req.body.brand,
            type: req.body.type,
            category: req.body.category,
            countInStock: req.body.countInStock,
            isFeatured: req.body.isFeatured
        },
        { new: true }
    );

    if (!updatedTool) return res.status(500).send('the Tool cannot be updated!');

    res.send(updatedTool);
});

router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Tool Id');
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
        files.map((file) => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }

    const tool = await Tool.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths
        },
        { new: true }
    );
        
    if (!tool) return res.status(500).send('the gallery cannot be updated!');

    res.send(tool);
});

router.delete('/:id', (req, res)=>{
    Tool.findByIdAndRemove(req.params.id).then(tool =>{
        if(tool) {
            return res.status(200).json({success: true, message: 'the tool is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "tool not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`, async (req, res) =>{
    const toolCount = await Tool.countDocuments((count) => count)

    if(!toolCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        toolCount: toolCount
    });
})

router.get(`/get/featured/:count`, async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    const tools = await Tool.find({isFeatured: true}).limit(+count);

    if(!tools) {
        res.status(500).json({success: false})
    } 
    res.send(tools);
})


module.exports=router;
