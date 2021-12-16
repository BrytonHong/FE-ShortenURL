const express = require('express')
const ShortUrl = require('be-shortenurl/models/short_url_schema')
const app = express()

app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))

app.get('/', async(req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', {shortUrls: shortUrls})
})

app.post('/shortenUrls', async(req,res)=>{
    if(req.body.fullUrl == null || req.body.fullUrl =='') {
        return res.sendStatus(404)
    }else{
        await ShortUrl.create({full: req.body.fullUrl})
        res.redirect('/')
    }
})

app.get('/:shortUrl', async(req,res)=>{
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl})

    if(shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 8080);