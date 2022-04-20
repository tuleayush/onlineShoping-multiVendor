const mongoose = require('mongoose');
const {database:{uri}} = require('./environment');

mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log(`MongoDB Connected`)
}).catch((err)=>{
    console.log(err.message)
});

mongoose.connection.on('connected',()=>{
    console.log('Mongoose connected to db')
});

mongoose.connection.on('error',(err)=>{
    console.log(err.message)
});

mongoose.connection.on('disconnected',()=>{
    console.log('Mongoose connnection is disconnected.');
});

process.on('SIGINT',async()=>{
    await mongoose.connection.close()
    process.exit(0);
});
