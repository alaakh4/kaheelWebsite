if (!localStorage.getItem('token')) {

    window.open('login.html', '_self');
}
const entityPrefill = location.search == "?edit" ? JSON.parse(localStorage.getItem('Article')) : null
const viewModel = {
    entityData: ko.observableArray([]),
    searchResult: ko.observableArray([]),
    filterList: ko.observableArray([]),
    filterValue: ko.observable('All'),
    isDate: ko.observable(false),
    isNumber: ko.observable(false),
    entityPrefill,
    isAddingSub: ko.observable(true),
    ClassData: ko.observableArray([]),
    getClassName: ko.observableArray([]),
    getClassNameEdit: ko.observableArray([]),


};
let classes;
Class = async () => {
    await fetch(apiMainURI + 'Class', {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token')
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
    })
        .then((response) => response.json())
        .then((response) => {
            viewModel.ClassData(response.data.data)
            classes = response.data.data;
        })
        .catch(err => {
            console.log(err)
        })
}
refershData = async () => {
    await fetch(apiMainURI + 'Article', {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token')

        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
    })
        .then(response => response.json())
        .then(async response => {
            if (response.msg === 'please login again') {
                return window.location = 'login.html'
            }
            await Class()
            response.data.data.forEach(Article => {
                Article.ArtImg = "http://localhost:299/upload/" + Article._id + '.jpg'
            });
            if (!response.data.data.length) {
                return viewModel.searchResult('empty')
            }
            localStorage.setItem('biggestDate', response.data.data[0].ArticleDate)
            const cols = Object.keys(response.data.data[0]);
            console.log('data :: ', response)
            console.log('cols :: ', cols)
            viewModel.entityData(response.data.data)
            viewModel.searchResult(response.data.data)
            viewModel.filterList(cols)
        })
        .catch(err => {
            console.log(err)
        })
}
refershData();
let getClassName = (ClassId) => {
    for (var x = 0; x < classes.length; x++) {
        if (classes[x].ClassId == ClassId) {
            return classes[x].ClassName;
        }
    }
}
let passData = (data) => {
    // document.getElementById(ClassId).selected = 'selected';
    //console.log(document.getElementById("test1"))
    localStorage.setItem('ClassId', data.ClassId)
    localStorage.setItem('Article', JSON.stringify(data))
    window.location = "./Article.form.html?edit"
    console.log(data)
    /*for(var x=0;x<classes.length;x++){
           if(classes[x].ClassId==ClassId){
               localStorage.setItem('test5',classes[x].ClassId)
             let a= localStorage.setItem('test',classes[x].ClassName)
             await  viewModel.getClassNameEdit(classes[x].ClassName)
               
           }
       }*/
}
function openDeleteModal(id) {
    console.log(id)
    $("#deletedId").val(id)
    // document.getElementById('deletedId').value = id
    $('#ex1').modal('toggle')
}
async function Delete() {
    const id = $('#deletedId').val();
    await fetch(apiMainURI + 'Article/' + id, {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
    })
        .then(response => {
            if (response.status == 400) {
                alert('please login agin')
                return window.location = 'login.html'
            }
        })

        .then(response => {
            $("#ex1 #close").click()
            refershData()
        })
        .catch(async (err) => {
            console.log(err)
        })
}
$("#mainForm").submit(async (event) => {
    event.preventDefault();
    console.log($("#showImg").css("display"))
    const ClassId = $("#ClassName").val()
    const ArticleName = $("#ArticleName").val()
    const ArticleText = $("#ArticleText").val()
    const ArticleDate = $("#ArticleDate").val()
    const NoOfDisplay = Number($("#NoOfDisplay").val())
    const NoOfLikes = Number($("#NoOfLikes").val())
    const NoOfDislikes = Number($("#NoOfDislikes").val())
    const NoOfShares = Number($("#NoOfShares").val())
    const Article = $("#ArticleId").val()
    const ArticleDesc = $("#ArticleDesc").val()
    const video = $("#video").val()
    const Img = $("#imageFile").prop("files").length
    var MediaType
    if ($("#showImg").css("display") == 'block') MediaType = 'img'
    else if (video) MediaType = 'video'
    else MediaType = 'noMedia'
    const References = $("#ArticleReferences").val()
    let opType = location.search == "?edit" ? 'edit' : 'add'
    let url = apiMainURI + (opType == 'edit' ? 'Article' + '/' + Article : 'Article')
    await fetch(url, {
        method: opType == 'add' ? 'POST' : 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token')
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({
            ArticleName,
            ArticleText,
            ArticleDate,
            NoOfDisplay,
            NoOfLikes,
            NoOfDislikes,
            NoOfShares,
            ClassId,
            References,
            ArticleDesc,
            video,
            MediaType,
        }
        ),
    })
        //Add Img
        .then(response => response.json())
        .then(async (response) => {
            console.log(response)
            if (Img > 0) {
                //Get Img Name(Article ID)
                var ImgId
                if (opType == 'add') {
                    ImgId = response.data._id
                } else {
                    ImgId = Article
                }
                //Creat Img File
                let imgForm = new FormData();
                console.log("In Image Block")
                let file = $("#imageFile").prop("files")[0]
                imgForm.append("imageFile", file);

                // Send Img
                let imgURL = apiMainURI + "Article/" + 'addImg/' + ImgId
                await $.ajax({
                    url: imgURL,
                    type: 'PUT',
                    headers: {
                        "auth-token": localStorage.getItem('token')
                    }
                    ,

                    data: imgForm,
                    processData: false,
                    contentType: false,
                    success: async (res, textStatus, xhr) => {
                        document.querySelector('#msg').style.display = "block"
                        $('#msg').empty().append('تم الإضافة بنجاح')
                        setTimeout(() => window.location = './Article.table.html', 300)
                    },
                    error: (error, textStatus, xhr) => {
                        $('#msg').empty().append(error)
                        document.querySelector('#msg').style.display = "block"

                    }

                });
            } else {
                document.querySelector('#msg').style.display = "block"
                $('#msg').empty().append('تم الإضافة بنجاح')
                setTimeout(() => window.location = './Article.table.html', 300)
            }


        })
        .catch(err => {
            alert(err)
            console.log(err)
            $('#msg').empty().append(err.message)
            document.querySelector('#msg').style.display = "block"

        })
});
let getDefaultDate = () => {
    var event = new Date();
    let newEvent = (event.getFullYear() + "-" +
        (event.getMonth() + 1).toString().padStart(2, 0) + "-" +
        event.getDate().toString().padStart(2, 0) + "T" +
        event.getHours().toString().padStart(2, 0) + ":" +
        event.getMinutes().toString().padStart(2, 0));
    return newEvent

}
let showScheduling = () => {
    $("#Scheduling").toggle(300, 'swing')
}
let test = async () => {
    const hour = parseFloat($("#hourScheduling").val())
    let minuteElement = parseFloat($("#minuteScheduling").val())
    let minute = 0

    if (typeof minuteElement == "number" && minuteElement > 0) {
        minute = minuteElement
    }
    if (typeof hour != "number" || hour < 0) {
        return $("#emptyhour").empty().append('ادخل موعد النشر بالساعة')
    }

    let a = localStorage.getItem('biggestDate');
    var event = new Date();
    var time = a.split("T");
    var hoursAndMinutes = time[1].split(':');
    var hours = parseFloat(hoursAndMinutes[0]);
    var minutes = parseFloat(hoursAndMinutes[1])
    var getDate = time[0].split('-')
    var day = parseFloat(getDate[2])
    var month = parseFloat(getDate[1])
    var year = parseFloat(getDate[0])
    var realMonth = parseFloat(month - 1)
    event.setDate(day)
    event.setMonth(realMonth)
    event.setFullYear(year)
    event.setHours(hours + hour)
    event.setMinutes(minutes + minute)
    let newEvent = (event.getFullYear() + "-" +
        (event.getMonth() + 1).toString().padStart(2, 0) + "-" +
        event.getDate().toString().padStart(2, 0) + "T" +
        (event.getHours()).toString().padStart(2, 0) + ":" +
        event.getMinutes().toString().padStart(2, 0));
    $("#ArticleDate").val(newEvent)
}
async function callClass() {
    await fetch(apiMainURI + 'Class', {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token')
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
    })
        .then(response => response.json()
        )
        .then(response => {
            let dropSelectClass = $("#ClassName")
            for (var x = 0; x < response.data.data.length; x++) {
                let ClassName = response.data.data[x].ClassName
                let ClassId = response.data.data[x].ClassId
                if (localStorage.getItem('ClassId') != ClassId) {
                    $(dropSelectClass).append('<option id="test1" value="' + ClassId + '">' + ClassName + '</option>');
                } else {
                    $(dropSelectClass).append('<option id="test1" value="' + ClassId + '" selected>' + ClassName + '</option>');
                }

            }
            return
        })

}
function showImgEdit(id) {
    if ($("#MediaType").val() == 'img') {
        $("#uploadImgDiv").css('display', 'none')
        $('.file-upload-image').attr('src', 'http://localhost:299/upload/' + id + '.jpg');
        $('.file-upload-content').show();
    }
}
let showVideo = (video) => {
    let url = video.split('watch?v=')
    return 'https://www.youtube.com/embed/' + url[1]
}
function readURL(input) {
    if (input.files && input.files[0]) {

        var reader = new FileReader();

        reader.onload = function (e) {
            $('.image-upload-wrap').hide();

            $('.file-upload-image').attr('src', e.target.result);
            $('.file-upload-content').show();

            $('.image-title').html(input.files[0].name);
        };

        reader.readAsDataURL(input.files[0]);

    } else {
        removeUpload();
    }
}
function removeUpload() {
    if ($("#uploadImgDiv").css('display') == 'none') $("#uploadImgDiv").css('display', 'block')
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
}
$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});
function addMultivalue(name) {
    // TODO : this could be an object
    viewModel[name].push('')
}
function addValueToArray(index, value, name) {
    viewModel[name][index] = value
}
function removeMultivalue(name, index) {
    console.log(index)
    viewModel[name].splice(index, 1)
}
let logout = () => {
    window.location = 'login.html'
    localStorage.removeItem('token')
}

ko.applyBindings(viewModel)
