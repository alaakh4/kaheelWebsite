let login=async ()=>{
 const email=  $('#email').val()
 const password=  $('#password').val()
 const url=apiMainURI+'login';


  $.ajax({
   url:url,
   type:'POST',
   dataType: '',
   data:({email:email,password:password}),
   success:(res,textStatus,xhr)=>{
     localStorage.setItem('token',res.token)
     window.location='Article.table.html'
   },
   error:(error,textStatus,xhr)=>{
    console.log(error.responseText)
    if(error.responseText='email wrong' || 'pass wrong' ){
      return $('#error').empty().append('email or password wrong')
    }
}
    })
 
  }
// Forget Password
  let forgetPass=()=>{
     window.location='forgetPass.html'
  }
  
// Check The Email:
let resetPass=()=>{
  const email=$('#emailForResetPass').val()
  const url=apiMainURI+'forgetPass'
  $.ajax({
  url:url,
  type:'POST',
  dataType:'',
  data:({email:email}),
  success:(res,textStatus,xhr)=>{   
    console.log(res)
    console.log('---------')
    console.log(xhr)
  // window.location='MessUpdatePass.html'
  },
  error:(error,textStatus,xhr)=>{
    $('#emailDoesNotExists').empty().append('email does not exists')
   console.log(error)
}

})
}
