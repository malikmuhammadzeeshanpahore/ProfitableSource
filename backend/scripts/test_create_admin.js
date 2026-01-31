const { sequelize, models } = require('../models')
const bcrypt = require('bcrypt')
;(async ()=>{
  try{
    await sequelize.sync()
    const hashed = await bcrypt.hash('@dm!n',10)
    const admin = await models.User.create({ id:'admin', name:'Admin', email:'admin', password: hashed, role:'admin', wallet:0, isActive:true, inviteCode:'ADMIN' })
    console.log('Admin created', admin.id)
  }catch(e){
    console.error('Create admin failed:', e && e.stack || e)
  }finally{ process.exit(0) }
})()
