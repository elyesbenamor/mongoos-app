const asyncvalidator = require('async-validator')
const mongoose = require ('mongoose')
mongoose.connect('mongodb://localhost/mongo-exercises',{ useUnifiedTopology: true,useNewUrlParser: true  })
.then(()=> console.log('connected'))
.catch(err=> console.log('error', err))
//get all published backend courses , sort them by name and display name + auth
const CoursesShemas= mongoose.Schema({
    //if a course does not have a name it will not be saved
    name: {
        type: String, 
        required: true,
        minlenght : 5,
        maxlenght : 20
        //match : /patter/
    },
    category : {
        type : String,
        required : true,
        enum : ['web', 'mobile', 'network']
    },
    // a course must have at least one tag with custome validator
    /*tags:{
        type : Array,
        validate: {
            validator : function(v){
                return v && v.lenght >0;
                
            },
            message : 'err : check the tag : should have at least one tag ',
        }
        
    },
    */
   //custom validator with asyn way ( read file from database or set custom function to do something)
   tags:{
    
    type : Array,
    validate: {
        isAsync : true,
        validator : function(v,callback){
            setTimeout(()=> {
                //do some async work
            const result = v && v.lenght >0;
            callback(result);
            }, 4000);
            
        },
        
        message : 'err : check the tag : should have at least one tag ',
    }
    
},
    author:String,
    date: {type : Date, default: Date.now},
    //add price if the course is published using validator function
    isPublished: Boolean,
    price: {
        type : Number,
        required : function(){
            return this.isPublished
        },
        min: 20,
        max : 60
    }
    
});

const Course = mongoose.model('course',CoursesShemas);
async function Save(){
    const course = new Course({
        name : 'name',
        category : 'network',
        //tags: [],
        author : 'elyes',
        isPublished : true,
        price: 20
    });
    try{
        //const isValid = await course.validate();
        const save = await course.save();
        console.log(save);
    }catch(ex)
    {console.log(ex.message)}
    
}
async function GetCourses(){
    return await Course
    //const course = await Course
    /*.find({isPublished : true, tags : {
        $eq : 'backend'
    }})
    */
    .find({isPublished : true})
    .limit(10)
    //.sort({name:1})
    .sort({price: -1})
    .select({name: 1, author: 1 , price: 1})
}
//get courses more or eq to 15 or have the word by in their title
async function GetCourses2(){
    return await Course 
    .find({
        isPublished : true
    })
    .or([ {price : {

        $gte : 15
        }}])
    .or([{name : /.*by.*/i }])

    .sort({name: 1})
    //.select({name: 1 , author: 1})
}

//update course function
async function UpdateCourse(name){
    
    return await Course.findOneAndDelete({name: name})
    //console.log(course1);
}
async function run(){
    //const courses = await GetCourses();
    //const courses = await GetCourses2();
    const course = await UpdateCourse('Express.js Course');
    //const update = await UpdateCourse('5a68fdc3615eda645bc6bdec');
    console.log(course);
}
//run();

Save();