const viewModel = {
    getArticles: ko.observableArray([]),
    getClasses: ko.observableArray([])
}
var classes;
// get Classes
Class = async () => {
    await fetch(apiMainURI + 'Class/webSite', {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
    })
        .then((response) => response.json())
        .then((response) => {
            viewModel.getClasses(response.data.data)
            classes = response.data.data;
        })
        .catch(err => {
            console.log(err)
        })
}
// لإظهار المقالات
var article = [];
// من اجل الجدولة
var date = new Date()
var now = (date.getUTCFullYear() + "-" +
    (date.getUTCMonth() + 1).toString().padStart(2, 0) + "-" +
    date.getUTCDate().toString().padStart(2, 0) + "T" +
    (date.getUTCHours()+2).toString().padStart(2, 0) + ":" +
    date.getUTCMinutes().toString().padStart(2, 0));
// get normal Articles
refreshData = async () => {
    fetch(apiMainURI + 'Article/webSite/' + 0, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        /* headers: {
             'Content-Type': 'application/json',
         },*/
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
    })
        .then(response => response.json())
        .then(response => {

            response.ArticleWithWadja.forEach(Article => {
                if (now >= Article.ArticleDate) {
                    article.push(Article)
                } else if(Article.ClassId == 2){article.push(Article)}  
            });
            console.log(article)
            viewModel.getArticles(article.slice(0, 10))
        })
        .catch(err => {
            console.log(err)
        })

}
// get Articles of one Class
articlesOfClass = async (ClassId) => {
    await fetch(apiMainURI + 'Article/oneClass/' + ClassId + '/eq', {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
    })
        .then(response => response.json())
        .then(response => {
            response.data.data.forEach(Article => {
                if (now >= Article.ArticleDate) {
                    article.push(Article)
                }
            })
            console.log(response)
            console.log('data :: ', article)
            if (article.length <= 10) {
                $("#MoreFromArticles").css('display', 'none');
            }
            return viewModel.getArticles(article)
        })
        .catch(err => {
            console.log(err)
        })
}
//check if ClassId in url  
Check = async () => {
    const url = new URLSearchParams(window.location.search)
    var ClassNumber = url.get('Class')
    if (!ClassNumber) {
        await Class()
        await refreshData()
    } else {
        await Class()
        return articlesOfClass(ClassNumber)
    }
}
Check()

let checkData = (Links, Art, id, video,MediaType) => {
    // NOTE: When (video == 'NoMedia') then there is no video or photo so show nothing
    // NOTE: When (video == '' then) there is img so show img
    // NOTE: When (video == 'URL') then there is video so show video
    if (MediaType == 'video') {
        let url = video.split('watch?v=')
        $("<iframe width='100%' height='320px'"
            + "src='" + 'https://www.youtube.com/embed/' + url[1]
            + "' frameborder='0' allow='accelerometer; autoplay;"
            + "encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>")
            .insertAfter("#" + id)
    } else if (MediaType == 'img') {
        var url_image = imgURL + id + '.jpg';
            $("<img src='" + url_image + "' width='90%' style='margin:0 0 0 4.5%'"
               + "data-action='zoom' />").insertAfter("#" + id);
    } else { }
    // NOTE: Art = ArticleBody
    // NOTE: if !Art && !Links then hide them all
    // NOTE: if !Art && Links then hide Art and ReadMore Button
    // NOTE: btnText = ReadMore ; ref = Links of Article ; moreText = ArticleBody(text) ; dots = ...
    var btnText = document.getElementById(id + "ReadMore");
    var ref = document.getElementById(id + 'ref');
    var moreText = document.getElementById(id + "Read");
    var dots = document.getElementById(id + 'dots')
    // Hide Links
    document.getElementById(id + "linkList").style.display = "none"
    //check if ArticleText and Links does not exists
    if ((!Art || Art == "<span style='background-color:yellow;'></span>") && !Links) {
        btnText.style.display = "none";
        ref.style.display = "none"
        moreText.style.display = "none";
        dots.style.display = "none"
    };
    //check if ArticleText does not exists
    if ((!Art || Art == "<span style='background-color:yellow;'></span>") && Links) {
        btnText.style.display = "none";
        ref.style.display = "inline"
        moreText.style.display = "none";
        dots.style.display = "none"
    };
    $('[data-toggle="tooltip"]').tooltip()
}
// get Link as Array
let LinksArray = (Links) => {
    //cut Links to Array
    let LinkArray = Links.split(';')
    var ArrayLink = []
    //loop on this Links
    // NOTE: b = number of links like: (1- www.url.com ) to end
    for (var a = 0, b = 1; a < LinkArray.length; a++, b++) {
        // get the name which will show in website
        let pureName = LinkArray[a].split('/')
        //put the element in Array for one Article
        ArrayLink.push("<a style='display: block;' target='_blanck' href='" + LinkArray[a] + "'>" + b + '- ' + pureName[2] + "</a>")
        var onelink = ArrayLink.join('')
    }
    // return the Array
    return onelink
}

let ReadMore = (id, Art, Links) => {
    //NOTE: btnText = ReadMore ; ref = Links of Article ; moreText = ArticleBody(text) ; dots = ...
    var btnText = document.getElementById(id + "ReadMore");
    var ref = document.getElementById(id + 'ref');
    var moreText = document.getElementById(id + "Read");
    var dots = document.getElementById(id + 'dots')
    if (!Art && !Links) {
        btnText.style.display = "none";
        dots.style.display = "none";
    }
    else if (!Links && Art) {
        if (dots.style.display === "none") {
            dots.style.display = "inline";
            btnText.innerHTML = "اقرا المزيد";
            moreText.style.display = "none";
        } else {
            dots.style.display = "none";
            btnText.innerHTML = "اقرا القليل";
            moreText.style.display = "inline";
        }
    }
    else if (Links && !Art) {
        dots.style.display = "none";
        ref.style.display = "inline"
    }
    else {
        if (dots.style.display === "none") {
            dots.style.display = "inline";
            btnText.innerHTML = "اقرا المزيد";
            moreText.style.display = "none";
            ref.style.display = "none"
        } else {
            dots.style.display = "none";
            btnText.innerHTML = "اقرا القليل";
            moreText.style.display = "inline";
            ref.style.display = "inline"
        }
    }
}
// to show the class name for one article
let getClassName = (ClassId) => {
    for (var x = 0; x < classes.length; x++) {
        if (classes[x].ClassId == ClassId) {
            return classes[x].ClassName;
        }
    }
}

let showLinks = (id) => {
    $("#" + id + "linkList").toggle(700, 'swing')
}

var insideSearch = false
$("#searchForm").submit( async (e) => { 
    e.preventDefault();
});
// search in DataBase
let searchDB = async (searchQuery) => {
        if(!searchQuery) {
            insideSearch = false
            $(".highlight").removeClass("highlight")
            return viewModel.getArticles(article)
        };
        await fetch(apiMainURI + 'Article/test', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                 'Content-Type' : 'application/json',
             },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify({searchQuery})
        })
        .then(response => response.json())
        .then(async response => {
            articles = response.data
            articles.forEach(article => {
                if (article.ClassId != 1 || article.ClassId != 2) {
                    article.ArticleName = article.ArticleName.replace("<span class=highlight>", "");
                    article.ArticleName = article.ArticleName.replace("</span>", "");
                    article.ArticleText = article.ArticleText.replace("<span class=highlight>", "");
                    article.ArticleText = article.ArticleText.replace("</span>", "");
                    article.ArticleDesc = article.ArticleDesc.replace("<span class=highlight>", "");
                    article.ArticleDesc = article.ArticleDesc.replace("</span>", "");
                }
            });
            articles.forEach(article => {
                if (article.ClassId != 1 || article.ClassId != 2) {
                    article.ArticleName = article.ArticleName.replace(searchQuery, "<span class=highlight>" + searchQuery + "</span>".toString());
                    article.ArticleText = article.ArticleText.replace(searchQuery, "<span class=highlight>" + searchQuery + "</span>".toString());
                    article.ArticleDesc = article.ArticleDesc.replace(searchQuery, "<span class=highlight>" + searchQuery + "</span>".toString());
                }
            });
        insideSearch = true
        if ($("#MoreFromArticles").length > 0) $("#MoreFromArticles").css('display', 'none');
        else if ($("#MoreFromAPI").length > 0) $("#MoreFromAPI").css('display', 'none');
        viewModel.getArticles([])
        viewModel.getArticles(articles)
        })
}

var query
$(document).ready(function () {
    $(window).scroll(moreData);
    $("#search").keyup(function () {
        query = $("#search").val()
        var articlesSearch = article;
        if (!query) {
            if ($("#MoreFromAPI").css("display") == 'none')
                  $("#MoreFromAPI").css("display", "block") 
            insideSearch = false
            $(".highlight").removeClass("highlight")
            return viewModel.getArticles(article)
        }
        insideSearch = true
        articlesSearch.forEach(article => {
            if (article.ClassId != 1 && article.ClassId != 2) {
                article.ArticleName = article.ArticleName.replace("<span class=highlight>", "");
                article.ArticleName = article.ArticleName.replace("</span>", "");
                article.ArticleText = article.ArticleText.replace("<span class=highlight>", "");
                article.ArticleText = article.ArticleText.replace("</span>", "");
                article.ArticleDesc = article.ArticleDesc.replace("<span class=highlight>", "");
                article.ArticleDesc = article.ArticleDesc.replace("</span>", "");
            }
        });
        let filter = articlesSearch.filter(filter => {
            if (filter.ClassId != 1 && filter.ClassId != 2) {
                const regex = new RegExp(query, 'ig')
                return filter.ArticleName.match(regex) || filter.ArticleText.match(regex) || filter.ArticleDesc.match(regex)
            }
        });
        filter.forEach(article => {
            if (article.ClassId != 1 && article.ClassId != 2) {
                article.ArticleName = article.ArticleName.replace(query, "<span class=highlight>" + query + "</span>".toString());
                article.ArticleText = article.ArticleText.replace(query, "<span class=highlight>" + query + "</span>".toString());
                article.ArticleDesc = article.ArticleDesc.replace(query, "<span class=highlight>" + query + "</span>".toString());
            }
        });
        $("#MoreFromArticles").css('display', 'none');
        $("#MoreFromAPI").css('display','none')
        viewModel.getArticles([])
        viewModel.getArticles(filter)
    })
    $("#searchMobile").keyup(function () {
        query = $("#searchMobile").val()
        var articlesSearch = article;
        if (!query) {
            if ($("#MoreFromAPI").css("display") == 'none')
                  $("#MoreFromAPI").css("display", "block") 
            insideSearch = false
            $(".highlight").removeClass("highlight")
            return viewModel.getArticles(article)
        }
        insideSearch = true
        articlesSearch.forEach(article => {
            if (article.ClassId != 1 && article.ClassId != 2) {
                article.ArticleName = article.ArticleName.replace("<span class=highlight>", "");
                article.ArticleName = article.ArticleName.replace("</span>", "");
                article.ArticleText = article.ArticleText.replace("<span class=highlight>", "");
                article.ArticleText = article.ArticleText.replace("</span>", "");
                article.ArticleDesc = article.ArticleDesc.replace("<span class=highlight>", "");
                article.ArticleDesc = article.ArticleDesc.replace("</span>", "");
            }
        });
        let filter = articlesSearch.filter(filter => {
            if (filter.ClassId != 1 && filter.ClassId != 2) {
                const regex = new RegExp(query, 'ig')
                return filter.ArticleName.match(regex) || filter.ArticleText.match(regex) || filter.ArticleDesc.match(regex)
            }
        });
        filter.forEach(article => {
            if (article.ClassId != 1 && article.ClassId != 2) {
                article.ArticleName = article.ArticleName.replace(query, "<span class=highlight>" + query + "</span>".toString());
                article.ArticleText = article.ArticleText.replace(query, "<span class=highlight>" + query + "</span>".toString());
                article.ArticleDesc = article.ArticleDesc.replace(query, "<span class=highlight>" + query + "</span>".toString());
            }
        });
        $("#MoreFromArticles").css('display', 'none');
        $("#MoreFromAPI").css('display','none')
        viewModel.getArticles([])
        viewModel.getArticles(filter)
    })
})
var counter = 2
let moreData = async () => {
    // if insideSearch ==
    if (insideSearch == false) {
        var MoreFromArticles = $("#MoreFromArticles")
        if ($("#MoreFromArticles").css('display') == 'none') { 
            MoreFromArticles.css('display','block') }
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elemTop = $("#MoreFromArticles").offset().top;
        //var elemBottom = elemTop + $("#MoreFromArticles").height();
        if ((article.length - (counter * 10) > -10) && (article.length - (counter * 10) != 0)) {
            if ((docViewBottom > elemTop)) {
                setTimeout(() => {
                    viewModel.getArticles(article.slice(0, counter * 10))
                    counter++
                }, 50);
            }
        } else {
                $("#MoreFromArticles").css('display', 'none');
                $("#MoreFromAPI").css('display', 'block')
        };
    }
}
// to get url of one class
let classHref = (ClassId) => {
    var url = new URLSearchParams(window.location.search)
    var ClassNumber = url.get('Class')
    if (!ClassNumber) {
        return window.location + '?Class=' + ClassId
    }
    else {
        return
    }
}
let slider = () => {
    $(".regular").slick({
        dots: false,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: true,
    });
}
var countMore =1
let moreDataFromAPI = async () => {
    await fetch(apiMainURI + 'Article/webSite/' + countMore , {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        /* headers: {
             'Content-Type': 'application/json',
         },*/
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
    })
        .then(response => response.json())
        .then(response => {
            response.ArticleWithWadja.forEach(Article => {
                if (now >= Article.ArticleDate && Article.ClassId != 2) {
                    article.push(Article)
                }
            });
            viewModel.getArticles(article)
            console.log(article)
            countMore++
        })
        .catch(err => {
            console.log(err)
        })
}
ko.applyBindings(viewModel)