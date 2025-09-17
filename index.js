const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});



const users = [];
app.post('/api/users', (req, res) => {
  let username = req.body.username;
  if (!username) {
    return res.json({ error: 'Username is required' });
  }
  if (users.find(u => u.username === username)) {
    return res.json({ error: 'Username already taken' });
  }else{
  const newUser = { username: username , _id: (users.length + 1).toString() };
  users.push(newUser);
  res.json(newUser);
  }
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users/:_id/exercises', (req, res) => {
  let userId = req.params._id;
  let user = users.find(u => u._id === userId);
  if(!user){
    return res.json({ error: 'User not found'})
  }
  let description = req.body.description.toString();
  let duration = req.body.duration;
  let date = req.body.date ? new Date(req.body.date) : new Date();
  if (isNaN(date.getTime())) {
    return res.json({ error: 'Invalid date format' });
  }
  if (!description || !duration) {
    return res.json({ error: 'Description and duration are required' });
  }
  const exercise = {
    description: description.toString(),
    duration: parseInt(duration),
    date: date.toDateString(),
  };
  if (!user.log) {
    user.log = [];
  }
  user.log.push(exercise);
  console.log('/api/users/:_id/exercises', {
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date,
    _id: user._id,
  })

  res.json({
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date,
    _id: user._id,
  });
});

app.get('/api/users/:_id/logs', (req, res) => {
  let userId = req.params._id;
  let user = users.find(u => u._id === userId);
  if(!user){
    return res.json({ error: 'User not found'})
  }
  console.log('/api/users/:_id/logs', {
    username: user.username,
    count: user.log?.length,
    _id: user._id,
    log: user.log ? user.log : []
  })
  res.json({
    username: user.username,
    count: user.log?.length,
    _id: user._id,
    log: user.log ? user.log : []
  })

});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
