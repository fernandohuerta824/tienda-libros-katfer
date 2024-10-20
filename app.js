import express from  'express'
import path from 'path'
const app = express()

const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use('/public', express.static(path.join(process.cwd(), 'public')))

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, () => console.log(`Listening on port ${port}`))