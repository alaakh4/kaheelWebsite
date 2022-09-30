if(!localStorage.getItem('token')){
    
    window.open('login.html','_self');  
  }
    const entityPrefill =  location.search == "?edit" ? JSON.parse(localStorage.getItem('Setting')) : null

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
        console.log(data)
        localStorage.setItem('Setting', JSON.stringify(data))
        window.location = "./Setting.form.html?edit"
    }

    function openDeleteModal (id) {
      console.log(id)
      $("#deletedId").val(id)
      // document.getElementById('deletedId').value = id
      $('#ex1').modal('toggle')
  }
    
    refershData = () => {
        $.getJSON(apiMainURI+'Setting', ({data}) => {
            if (!data.data.length) {
                viewModel.searchResult('empty')
                return
            }
            const cols = Object.keys(data.data[0]);
            console.log('data :: ', data)
            console.log('cols :: ', cols)
            viewModel.entityData(data.data)
            viewModel.searchResult(data.data)
            viewModel.filterList(cols)
        });
    }
    
    //for first time get all data
    refershData();
    
    async function Delete () {
      const id = $('#deletedId').val();
        await fetch(apiMainURI + 'Setting/' + id , {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
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
                console.log(err)
                window.location.reload();
            })
    }
    
    $("#mainForm").submit(async (event) => {
        event.preventDefault();
    
        const SettingName = $("#SettingName").val()
const SettingValue = $("#SettingValue").val()

        let opType = location.search == "?edit" ? 'edit' : 'add'
        let url = apiMainURI + (opType == 'edit' ? 'Setting' + '/' + Setting : 'Setting')
    
        await fetch(url, {
            method: opType == 'add' ? 'POST' : 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify({
SettingName,
SettingValue,
}
),
        })
            .then(response => response.json())
            .then(response => {
              if(response.success) {
                $('#msg').empty().append(response.message)
                document.querySelector('#msg').style.display = "block"
                setTimeout(() => window.location = './Setting.table.html', 300)
              }else {
                  console.log(response)
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

    function addValueToArray (index, value, name) {
      viewModel[name][index] = value
    }

    function removeMultivalue(name,index) {
        console.log(index)
        viewModel[name].splice(index, 1)
    }
    let logout=()=>{
        window.location='login.html'
        localStorage.removeItem('token')
    }

    ko.applyBindings(viewModel);