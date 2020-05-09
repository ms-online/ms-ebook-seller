// 引入模块
const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

// 初始化app
const app = express();

// handlebars 中间件
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// bodyparser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(`${__dirname}/public`));


// index路由
app.get('/', (req, res)=> {
    res.render('index'),{
        stripePublishableKey:keys.stripePublicableKey
    }
})

// charge 路由
app.post('/charge', (req,res) => {
    // console.log(req.body);
    // res.send('test');
const amount =2500;
    stripe.customers.create({
        // 创建用户存储用户信息
        email:req.body.stripeEmail,
        source:req.body.stripeToken
    }).then(customer => stripe.charges.create({
        // 创建用户支付
        amount,
        description:'Web Development Ebook',
        currency:'usd',
        customer:customer.id
    })).then(charge => res.render('success'));
})

// 定义端口号
const port = process.env.PORT || 4000;

// 监听端口
app.listen(port, ()=> console.log(`服务器已经在${port}端口号运行...`));