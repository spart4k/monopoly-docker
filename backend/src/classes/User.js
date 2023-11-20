const UserModel = require('../models/user_model.js');

module.exports = class User {

  getElemets = async (message) => {
    try{
      const result = await UserModel.find()
      return result
    } catch(err) {
      console.log(err)
    }
  }

  createDocument = async (message) => {
    try{
      const reactUser = new UserModel({
        name: message.name,
        surname: message.surname
      })
      const result = await reactUser.save()
      console.log('class')
      console.log(result)
      return result
    } catch(err) {
      console.log(err)
    }
  }

  removeElement = async (_id) => {
    try {
      console.log('remove')
      await UserModel.deleteOne({_id: _id})
      console.log('rem')
      console.log('test')
      return 200
    } catch(err) {
      return 400
    }
  }

  updateElement = async (_id, item) => {
    try {
      console.log('edit')
      await UserModel.updateOne({_id}, {
        $set: {
          name: item.name,
          surname: item.surname
        }
      })
      console.log('edit')
      const newElement = await UserModel.findOne({_id})
      console.log(newElement)
      return newElement
    } catch(err) {
      return 400
    }
  }
}