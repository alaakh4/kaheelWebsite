if (!localStorage.getItem('token')) {

    window.open('login.html', '_self');
}

const entityPrefill = location.search == "?edit" ? JSON.parse(localStorage.getItem('Class')) : null
const viewModel = {
    entityData: ko.observableArray([]),
    searchResult: ko.observableArray([]),
    filterList: ko.observableArray([]),
    filterValue: ko.observable('All'),
    isDate: ko.observable(false),
    isNumber: ko.observable(false),
    entityPrefill,
    isAddingSub: ko.observable(true),


};




function passData(data) {
    localStorage.setItem('Class', JSON.stringify(data))
    window.location = "./Class.form.html?edit"
}

function openDeleteModal(id, ClassId) {
    if (ClassId == 1 || ClassId == 2) {
        alert("لا يمكن حذف هذا القسم")
        return $("#ex1 #close").click()
    }
    console.log(id)
    $("#deletedId").val(id)
    // document.getElementById('deletedId').value = id
    $('#ex1').modal('toggle')
}
var nextId = ko.observable();
refershData = async () => {
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
        .then(response => response.json())
        .then(response => {
            if (response.msg === 'please login again') {
                return window.location = 'login.html'
            }
            nextId(parseInt(response.data.data[response.data.data.length - 1].ClassId) + 1)
            if (!response.data.data.length) {
                return viewModel.searchResult('empty')
            }
            const cols = Object.keys(response.data.data[0]);
            console.log('data :: ', response)
            console.log('cols :: ', cols)
            viewModel.entityData(response.data.data)
            viewModel.searchResult(response.data.data)
            viewModel.filterList(cols)
        })
        .catch(err => {
            console.log(err)

        });
}

//for first time get all data
refershData();

async function Delete() {
    const id = $('#deletedId').val();
    await fetch(apiMainURI + 'Class/' + id, {
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

        .then(response => response.json())
        .then(response => {
            $("#ex1 #close").click()
            refershData()

        })
        .catch(err => {
            alert('error!!')
            window.location.reload()

        })
}

$("#mainForm").submit(async (event) => {
    event.preventDefault();

    const Class = $("#EditClass").val()
    const ClassId = Number($("#ClassId").val())
    const ClassName = $("#ClassName").val()

    let opType = location.search == "?edit" ? 'edit' : 'add'
    let url = apiMainURI + (opType == 'edit' ? 'Class' + '/' + Class : 'Class')
    console.log(opType)
    await fetch(url, {
        method: opType == 'add' ? 'POST' : 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({
            ClassId,
            ClassName,
        }
        ),
    })
        .then(response => response.json())
        .then(async (response) => {
            //Get Img Name(Article ID)
            var ImgId = ClassId
            //Creat Img File
            let imgForm = new FormData();
            if ($("#ClassPhoto").prop("files").length > 0) {
                console.log("In Image Block")
                let file = $("#ClassPhoto").prop("files")[0]
                imgForm.append("imageFile", file);

                // Send Img
                let imgURL = apiMainURI + "Class/" + 'addImg/' + ImgId
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
                        setTimeout(() => window.location = './Class.table.html', 300)

                    },
                    error: (error, textStatus, xhr) => {
                        $('#msg').empty().append(error)
                        document.querySelector('#msg').style.display = "block"

                    }

                });
            }


        })
        .catch(err => {
            console.log(err)
            $('#msg').empty().append(err.message.message)
            document.querySelector('#msg').style.display = "block"
        })

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

ko.applyBindings(viewModel);