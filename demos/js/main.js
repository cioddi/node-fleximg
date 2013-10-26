Share = {
    twitter:function(url,text,title){
        var tweet = title + ' - ' + text + ' ' + url;
        var windowWidth = 600;
        var windowHeight = 400;
        var x = screen.width/2 - windowWidth/2;
        var y = screen.height/2 - windowHeight/2;

        window.open(
        "https://twitter.com/intent/tweet?text="+tweet,
        "Twitter",
        "width=600,height=400,resizable,scrollbars=no,status=1,left="+x+",top="+y
      );
    },
    xing: function(url){
        var windowWidth = 600;
        var windowHeight = 400;
        var x = screen.width/2 - windowWidth/2;
        var y = screen.height/2 - windowHeight/2;

        window.open(
        "https://www.xing.com/social_plugins/share?url="+url,
        "XING",
        "width=600,height=400,resizable,scrollbars=no,status=1,left="+x+",top="+y
      );
    },
    linkedin:function(url){
        var windowWidth = 600;
        var windowHeight = 400;
        var x = screen.width/2 - windowWidth/2;
        var y = screen.height/2 - windowHeight/2;

        window.open(
        "http://www.linkedin.com/shareArticle?mini=true&url="+url,
        "linkedin",
        "width=600,height=400,resizable,scrollbars=no,status=1,left="+x+",top="+y
      );
    },
    facebook:function(url,text,title){
        var windowWidth = 600;
        var windowHeight = 400;
        var x = screen.width/2 - windowWidth/2;
        var y = screen.height/2 - windowHeight/2;

        window.open(
        "https://www.facebook.com/sharer/sharer.php?u="+url,
        "facebook",
        "width=600,height=400,resizable,scrollbars=no,status=1,left="+x+",top="+y
      );
    },
    googleplus:function(url){
        var windowWidth = 600;
        var windowHeight = 400;
        var x = screen.width/2 - windowWidth/2;
        var y = screen.height/2 - windowHeight/2;

        window.open(
        "https://plus.google.com/share?url="+url,
        "google+",
        "width=600,height=400,resizable,scrollbars=no,status=1,left="+x+",top="+y
      );
    },
    pocket:function(url,text,title){
        var windowWidth = 600;
        var windowHeight = 400;
        var x = screen.width/2 - windowWidth/2;
        var y = screen.height/2 - windowHeight/2;

        window.open(
        "https://getpocket.com/save?url="+url+"&title="+title,
        "pocket",
        "width=600,height=400,resizable,scrollbars=no,status=1,left="+x+",top="+y
      );
    },
    reddit:function(url){
        var windowWidth = 600;
        var windowHeight = 400;
        var x = screen.width/2 - windowWidth/2;
        var y = screen.height/2 - windowHeight/2;

        window.open(
          "http://www.reddit.com/submit?url="+url,
          "reddit",
          "width=600,height=400,resizable,scrollbars=no,status=1,left="+x+",top="+y
        );
    }
};
var url = 'http://www.fleximg.com';
var title = 'fleximg.js - Responsive image loader';
var text = 'Automatically resizes image files to fit the desired display dimensions';
$('.smButton').each(function(idx,item){
    $(item).on('click',function(){
        Share[$(item).attr('data-smshare')](url,text,title);
    });
});

$('#downloadLink').on('click',function(){

        var windowWidth = 400;
        var windowHeight = 50;
    var x = screen.width/2 - windowWidth/2;
    var y = screen.height/2 - windowHeight/2;
    window.open(
      "/download.html",
      "download build",
      "width=400,height=50,resizable,scrollbars=no,status=1,left="+x+",top="+y
    );
});


