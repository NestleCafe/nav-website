// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.last');
var x = localStorage.getItem('x'); //本地存储增加的站点

var xObject = JSON.parse(x);
var hashMap = xObject || [{
  logo: "G",
  logoType: 'text',
  url: "https://github.com/"
}, {
  logo: "G",
  logoType: "text",
  url: "https://www.google.com/"
}, {
  logo: "B",
  logoType: "text",
  url: "https://www.bilibili.com/"
}, {
  logo: "Z",
  logoType: "text",
  url: "https://www.zhihu.com/"
}]; // 1直接用现成url

/* const getDateStr = (DayCount) =>{ 
    const date = new Date();
    date.setDate(date.getDate()+DayCount);//获取DayCount天后的日期
    const y = date.getFullYear().toString(); 
    const m = (date.getMonth()+1)<10 ? "0"+(date.getMonth()+1).toString() : (date.getMonth()+1).toString();//获取当前月份的日期，不足10补0
    const d = date.getDate()<10 ? "0"+date.getDate().toString() : date.getDate().toString();//获取当前几号，不足10补0
    return y+m+d; 

    //获取日期对应的bing背景图
    for(let i=0,j=0;i<6;i++,j--){
        dateList[i] = getDateStr(j)
        bodyBackgroundUrl[i] = `https://tupian.sioe.cn/b/bing-home-image/pic/${dateList[i]}.jpg`
    }

    console.log(dateList)    
} */
// 2使用接口获取

function request() {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://jsonp.afeld.me/?url=https%3A%2F%2Fcn.bing.com%2FHPImageArchive.aspx%3Fformat%3Djs%26idx%3D0%26n%3D7', true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(JSON.parse(xhr.response));
      }
    };

    xhr.send();
  });
}

var bodyBackgroundUrl = [];
var picCopyright = [];
var copyrightLink = []; //调用request bing背景图

$(document).ready(function () {
  var media = window.matchMedia("(min-width:500px)");

  if (media.matches) {
    // 媒体查询
    var BASE_URL = 'http://s.cn.bing.net';
    request().then(function (res) {
      console.log('数据获取成功 ', res.images);

      for (var i = 0; i < res.images.length; i++) {
        bodyBackgroundUrl[i] = BASE_URL + res.images[i].url;
        picCopyright[i] = res.images[i].copyright;
        copyrightLink[i] = res.images[i].copyrightlink;
      }

      $('.copyright .url').attr('href', "".concat(copyrightLink[picIndex]));
      $('.copyright .url .text').text("".concat(picCopyright[picIndex]));
      $(document).trigger('onRequest');
    });
  } else {
    $('.globalFooter').remove();
    $('body').css("background-image", "url('https://api.dujin.org/bing/m.php')");
  }
});

var removePrefix = function removePrefix(url) {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, ''); //用正则表达式 删除 / 开头的内容
};

var render = function render() {
  $siteList.find('li:not(.last)').remove();
  hashMap.forEach(function (node, index) {
    var $li = $("\n        <li>\n            \n            <div class=\"site\">\n                <div class=\"logo\">".concat(removePrefix(node.url)[0].toUpperCase(), "</div>\n                <div class=\"link\">").concat(removePrefix(node.url), "</div>\n                <div class=\"close\">\n                    <svg class=\"icon\">\n                        <use xlink:href=\"#icon-quxiao\"></use>\n                    </svg>\n                </div>\n            </div>\n        \n        </li>")).insertBefore($lastLi);
    $li.on('click', function () {
      window.open(node.url);
    });
    $li.on('click', '.close', function (e) {
      e.stopPropagation(); //阻止冒泡

      hashMap.splice(index, 1);
      render();
    });
  });
};

render();
$('.addButton').on('click', function () {
  var url = window.prompt("请输入添加的网址");

  if (url.indexOf('http') !== 0) {
    url = 'https://' + url;
  }

  console.log(url);
  hashMap.push({
    logoType: "text",
    url: url
  });
  render();
});
$('.close').on('click', function () {
  console.log('close被点击');
});
/* 
$(document).on('keypress', (e)=>{
    const {key} = e
    for(let i=0; i<hashMap.length; i++){
        if(hashMap[i].logo.toLowerCase() === key){
            window.open(hashMap[i].url)
        }
    }
}) */
//禁用了键盘导航

$('#baidu').on('click', function () {
  if ($('#baidu').attr('class') === 'inactive') {
    $('#baidu').attr('class', 'active');
    $('#google').attr('class', 'inactive');
    $('.searchForm').attr('action', 'https://www.baidu.com/s').children('input').attr('name', 'wd');
  }
});
$('#google').on('click', function () {
  if ($('#google').attr('class') === 'inactive') {
    $('#google').attr('class', 'active');
    $('#baidu').attr('class', 'inactive');
    $('.searchForm').attr('action', 'https://www.google.com/search').children('input').attr('name', 'q');
  }
});
var picIndex = 0;

function renderButtonColor() {
  if (picIndex === 0) {
    $('.previous').css("opacity", "0.5");
    $('.next').css("opacity", "1");
  } else if (picIndex === 6) {
    $('.previous').css("opacity", "1");
    $('.next').css("opacity", "0.5");
  } else {
    $('.previous').css("opacity", "1");
    $('.next').css("opacity", "1");
  }
} //监听onRequest,获取url数据，获取后渲染


$(document).bind('onRequest', function () {
  //首次打开显示第一张图
  $('body').css("background-image", "url('".concat(bodyBackgroundUrl[picIndex], "')"));
  renderButtonColor(); //点击上一张图片

  $('.previous').on('click', function () {
    if (picIndex > 0) {
      picIndex--;
      renderButtonColor();
      $('body').css("background-image", "url('".concat(bodyBackgroundUrl[picIndex], "')"));
      $(document).trigger('picIndexChange');
    }
  }); //点击下一张图片

  $('.next').on('click', function () {
    if (picIndex < 6) {
      picIndex++;
      renderButtonColor();
      $('body').css("background-image", "url('".concat(bodyBackgroundUrl[picIndex], "')"));
      $(document).trigger('picIndexChange');
    }
  });
});
$(document).bind('picIndexChange', function () {
  $('.copyright .url').attr('href', "".concat(copyrightLink[picIndex]));
  $('.copyright .url .text').text("".concat(picCopyright[picIndex]));
}); //localStorage

window.onbeforeunload = function () {
  var string = JSON.stringify(hashMap);
  localStorage.setItem('x', string);
};
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.d41dda4e.js.map