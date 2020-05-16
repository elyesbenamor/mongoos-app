'use strict';
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/playground',{ useUnifiedTopology: true,useNewUrlParser: true  })
.then(() => console.log('connect to mongodb'))
.catch(err=> console.log ('could not connect ',err))
const coursesShema= mongoose.Schema({
    name: String,
    author: String,
    tag: [String],
    date : {type: Date,default : Date.now }
});
//store data
//class : courses collection
const Course = mongoose.model('course', coursesShema);
//object : one document if we modify it and run the code it will create new doc
async function Save(){
    const course = new Course();
    const save = await course.save();
console.log(save);
}
//query a document
async function getCourses(){
   
        const get = await Course
        //author starts with elyes
        //.find({author : /^elyes/})
        //ends with amor : i for case sensitive
        //.find({author : /amor$/i})
        //containes elyes
        //.find({author: /.*elyes.*/})
        .find({name},{tag : {
            $eq : 'index.js'
        }})
        .limit(10)
        .select({name:1, tag : 1})
        //nb of docs
        //.count()
        console.log(get);
   
}

//Save()
getCourses();