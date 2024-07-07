const Contact = require('../Model/Contact');

// create a contact
exports.createContact = async(req, res) => {
    const data = new Contact({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        userId: req.body.userId
        })
    try{
        const searchContact = await Contact.findOne({ name: data.name, email: data.email, phone: data.phone, userId: data.userId })
        if(searchContact) res.json('Contact already exists')
        else{
            const createContact = await data.save()
            res.json(createContact)
        }
    }
    catch(err){
        res.json(err)
    }
}

//get contact lists of user with skip, sort, limit
exports.getContactList = async(req, res) => {
    const userId = req.body.userId
    const sort = req.body.sort || 1
    const sortBy = req.body.sortBy || 'createdAt'
    const skip = req.body.skip || 0
    const limit = req.body.limit || 10
    try{
        const getContactList = await Contact.find({userId: userId}).limit(limit).sort({[sortBy]: parseInt(sort)}).skip(skip)
        res.json(getContactList)
    }
    catch(err){
        res.json(err)
    }
}

//update contact 
exports.updateContact = async(req, res) => {
    try{
        const updateContact = await Contact.updateOne(
            { _id: req.params.postId},
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    address: req.body.address
                }
            }
        )
        res.json(updateContact)
    }
    catch(err){
        res.json(err)
    }
}

//delete a contact
exports.deleteContact = async(req, res) => {
    try{
        const deleteContact = await Contact.deleteOne({ _id: req.params.postId})
        res.json(deleteContact)
    }
    catch(err){
        res.json(err)
    }
}