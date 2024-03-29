const express = require("express")
const app = express()
const session = require("express-session")
const port = process.env.PORT || 8080

let tasks = [
    "listes de taches",
];


app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))
app.use(session({
    name: "todolist",
    secret: "todolist",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge : 3600 * 24 * 60 * 60,
        secure : false,
    }
}))
app.use(require('./middleware/flash'))


app.get('/', (req, res) =>{
    res.render('index', {tasks: tasks})
})

app.post('/add', (req, res) =>{
    const newTask = req.body.task;
    if (newTask === undefined || newTask === "") {
        req.flash('warning', "Please provide a task") 
        res.redirect("/");
    }else{
        tasks.push(newTask)
        req.flash('success', 'Task added successfully');
        res.redirect('/');
    }
    
})

app.post('/delete', (req,res)=>{
    let taskD=req.body.task;
    
    tasks.pop(taskD);
    req.flash("success", "Task deleted successfully");
    res.redirect('/');
});

app.listen(port, () => {
    console.log("Server Started")
})