const op=require('./operations')
const express=require('express')
var bodyParser=require('body-parser'); // to parse the urlencoded/json format data recieved from user into object format
var app=new express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json({extended:true}))

app.set('view engine','ejs');

app.get('/',(req,res)=>{
   res.render('index')
})


var cardNo,pin;
app.post('/menu',(req,res)=>{
   cardNo=req.body.cardNo;
   pin=req.body.PIN; 
   
   if(op.fetchRecord(cardNo)==1)
   {
   if(op.verify(pin)==1)
   {
      res.render('menu');
   }
   else
   {
      res.send('Wrong PIN!!!');
   }
  }
  else{
   res.send('Invalid card number');
  } 

})


app.get('/enquiry',(req,res)=>{
   msg='Your current balance is Rs. '+op.getBalance();
   res.send(String(msg));
})

app.get('/debit',(req,res)=>{
   res.render('debit');
})

var amt;
app.post('/debit',(req,res)=>{
   amt=req.body.debitAmt;
   if(op.debit(amt)==1)
   {
      msg='The transaction is successful!!!    Your current balance is Rs. '+op.getBalance();
      res.send(String(msg));
   }
   else{
      res.send('Insufficient balance!!!');
   }

})

app.get('/credit',(req,res)=>{
   res.render('credit');
})

app.post('/credit',(req,res)=>{
   amt=req.body.creditAmt;
   if(amt<=0)
   {
      res.send('Please enter some valid amount...');
   }
   else if(op.credit(amt)==1)
   {
      msg='The transaction is successful!!!    Your current balance is Rs. '+op.getBalance();
      res.send(String(msg));
   }
   else{
      res.send('Sorry, We couldn\'t process your transaction!!!');
   }
})

app.get('/changePIN',(req,res)=>{
   res.render('currentPIN');
})

app.post('/changePIN',(req,res)=>{
   pin=req.body.PIN;
   if(op.verify(pin)==true)
   {
      res.render('newPIN');
      nPIN1=req.body.nPIN1;
      nPIN2=req.body.nPIN2;
      if(nPIN1==nPIN2)
      {
         op.changePin(nPIN1);
      }
      else
      {
         res.send('New PIN and confirmed new PIN did not match!!!');
      }
   }
   else
   {
      res.send('Wrong PIN!!!');
   }
})

app.listen(3000,()=>{
   console.log('Server listening on 3000');
}) 