
// SEARCH FEATURE
document.querySelector('#search').addEventListener("keyup", e => filter(e.target.value));

function filter(value) {

    value = value.trim();
    const entityData = viewModel.entityData();
    const filterValue = viewModel.filterValue();
    const cols = viewModel.filterList();

    if (value.length < 1) {
        viewModel.searchResult(entityData)
        return;
    }

    if (filterValue.toLowerCase() == 'all') {
        const data = entityData.filter((data) => {
            for (let col of cols) {
                if (data[col].toString().includes(value) || data[col].toString() == (value)) {
                    return data
                }
            }
        })

        viewModel.searchResult(data)
    } else {
        const results = []

        for (let items of entityData) {
            const item = items[filterValue]
            if (item.toString() == (value) || item.toString().includes(value)) {
                results.push(items)
            }
        }

        if (results.length < 1) {
            viewModel.searchResult(entityData)
        } else {
            viewModel.searchResult(results)
        }
    }
}

function isDate(item) {
    return /([0-9)]{2})\-([0-9)]{2})\-([0-9)]{4})/g.test(item)
}

function filterByNumber() {
    let temp;
    let from = Number(document.querySelector('#fromNumber').value)
    let to = Number(document.querySelector('#toNumber').value)
    const entityData = viewModel.entityData()
    const filterValue = viewModel.filterValue();

    if (from > to) { // swap values
        temp = from
        from = to
        to = temp
    }
    console.log(typeof from, typeof to)

    if (viewModel.isNumber()) {
        const data = entityData.filter(items => Number(items[filterValue]) >= from && Number(items[filterValue]) <= to);
        viewModel.searchResult(data)
    }
}


function setValue(value) {
    if (value.length < 0) return;
    const currentValue = viewModel.filterValue()
    const entityData = viewModel.entityData()

    for (let obj of entityData) { // check if date
        if (!isNaN(obj[value])) {
            viewModel.isNumber(true)
        } else {
            viewModel.isNumber(false)
        }

        if (isDate(obj[value])) {
            viewModel.filterValue(value);
            viewModel.isDate(true)
            break;
        } else {
            viewModel.isDate(false)
        }
    }

    if (currentValue !== value && viewModel.entityData().length > 0) {
        const searchValue = document.querySelector('#search').value
        viewModel.filterValue(value);

        filter(searchValue)
    }


    viewModel.filterValue(value);
}

function filterByDate() {
    let temp;
    let from = Date.parse(moment(document.querySelector('#fromDate').value).format('MM-DD-YY'))
    let to = Date.parse(moment(document.querySelector('#toDate').value).format('MM-DD-YY'))
    const entityData = viewModel.entityData()
    const filterValue = viewModel.filterValue();

    if (from > to) { // swap values
        temp = from
        from = to
        to = temp
    }

    if (viewModel.isDate()) {
        const data = entityData.filter(items => Date.parse(items[filterValue]) >= from && Date.parse(items[filterValue]) <= to);
        viewModel.searchResult(data)
    }
}
