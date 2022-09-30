//Check The Url:
var urlParams = new URLSearchParams(window.location.search);
let token=urlParams.get('id')
console.log(urlParams.get('id')); // "edit"
let url1=apiMainURI+'checkUrl/'+token

$.ajax({
    url:url1,
    type:'POST',
    dataType:'',
    data:({}),
    success:(res,textStatus,xhr)=>{   
        console.log(res)
        console.log('---------')
        console.log(xhr)
       
      },
      error:(error,textStatus,xhr)=>{
      let errorUrl= error.responseJSON.message
      if(errorUrl=='Invalid URL') return window.location='forgetPass.html'
   }

})


let updatePass=()=>{
  const newPassword=$('#newPassword').val()
  const newPasswordRepeated=$('#newPasswordRepeated').val()
  if(newPassword!==newPasswordRepeated) return $('#passWrong').empty().append('your Password is wrong')
  let url=apiMainURI+'ResetPass/'+token
  $.ajax({
  url:url,
  type:'POST',
  dataType:'',
  data:({newPassword:newPassword}),
  success:(res,textStatus,xhr)=>{   
    console.log(res)
    console.log('---------')
    console.log(xhr)
    $('#resetMessage').empty().append('done')
   
  },
  error:(error,textStatus,xhr)=>{
   console.log(error)
}

})
}