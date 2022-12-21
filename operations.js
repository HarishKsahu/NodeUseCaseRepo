var mysql = require('sync-mysql');
const ps=require("prompt-sync")
const prompt=ps();

var connection = new mysql({
  host:"localhost",
  user:"root",
  password:"",
  database : "root"
})

var query
var rpin,bal,credit,debit,custName,data,cardNo

function fetchRecord(cNo)
{
    cardNo=cNo
    query="Select * from Accounts where cardNo= "+cardNo;
    data=connection.query(query);
    if(data=='')
    {
        return 0;
    }
    else
    {
        data.forEach(function(rdata){
            rpin=rdata.pin;
            custName=rdata.custName;            
        })  
        return 1;      
    }
}

function welcome()
{
    console.count('Welcome '+custName+' to ATM interface...');
}

function verify(pin)
{
    if(pin==rpin)
    {
        return true;
    } 
    else
    {
        return false;
    }
}

function getBalance()
{
    query="Select balance from Accounts where cardNo= "+cardNo;
    data=connection.query(query); 
    data.forEach(function(rdata){
        bal=rdata.balance;            
    }) 
    return bal;
}

function debit(amt)
{
   if(amt<=getBalance())
   { 
   newBal=bal-amt;
   query="UPDATE Accounts SET balance = "+newBal+" WHERE cardNo= "+cardNo;
   connection.query(query); 
    return 1;  
   } 
   else
   {
     return 0;
   }
}

function credit(amt)
{    
   newBal=parseFloat(bal) + parseFloat(amt);
   query="UPDATE Accounts SET balance = "+newBal+" WHERE cardNo= "+cardNo;
   connection.query(query); 
   return 1;  
}

function changePin(newPin)
{    
    query="UPDATE Accounts SET pin = "+newPin+" WHERE cardNo= "+cardNo;
    connection.query(query);
    console.log("The PIN has been changed...")
}

module.exports={fetchRecord,verify,getBalance,debit,credit,changePin,welcome}
