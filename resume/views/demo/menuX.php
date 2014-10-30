

<script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>





<!DOCTYPE html>

<html>
<head>
<title>mbMenu</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script type="text/javascript" src="public/js/menu/inc/jquery.metadata.js"></script>
<script type="text/javascript" src="public/js/menu/inc/jquery.hoverIntent.js"></script>
<script type="text/javascript" src="public/js/menu/inc/mbMenu.js"></script>


<link rel="stylesheet" href="public/js/menu/css/menu_red.css" media="screen" />



<style type="text/css">

    body  a.style{
        color:#AF3002;
        font-family:sans-serif;
        font-size:13px;
        text-decoration:none;
    }

    .wrapper{
        font-family:Arial, Helvetica, sans-serif;
        margin-top:-10px;
        margin-left:-10px;
    }

    .wrapper h1{
        font-family:Arial, Helvetica, sans-serif;
        font-size:26px;
    }
    button{
        padding:4px;
        display:inline-block;
        cursor:pointer;
        font:12px/14px Arial, Helvetica, sans-serif;
        color:#666;
        border:1px solid #999;
        background-color:#eee;
        -moz-border-radius:10px;
        -webkit-border-radius:10px;
        -moz-box-shadow:#999 2px 0px 3px;
        -webkit-box-shadow:#999 2px 0px 3px;
        margin-bottom:4px;
    }
    button:hover{
        color:#aaa;
        background-color:#000;
    }
    :focus {
        outline: 0;
    }

    span.btn{
        padding:10px;
        display:inline-block;
        cursor:pointer;
        font:12px/14px Arial, Helvetica, sans-serif;
        color:#aaa;
        background-color:#eee;
        -moz-border-radius:10px;
        -webkit-border-radius:10px;
        -moz-box-shadow:#999 2px 0px 3px;
        -webkit-box-shadow:#999 2px 0px 3px;
    }
    span.btn:hover{
        background-color:#000;
    }

    .msgBox{
        position:absolute;
        width:250px;
        height:60px;
        background:black;
        color:#fff;
        -moz-box-shadow:#999 2px 0px 3px;
        -webkit-box-shadow:#999 2px 0px 3px;
        -moz-border-radius:10px;
        -webkit-border-radius:10px;
        padding:10px;
        padding-top:20px;
        top:10px;
        right:10px;
        font:20px/24px Arial, Helvetica, sans-serif;
    }

  .rootVoices td.rootVoice.custom.selected{
    background: red;
    padding:8px;
    color:#ffffff;
    cursor: pointer;
    font-size:14px;
    text-shadow:#660033 1px 1px 1px;
    -webkit-border-top-right-radius:8px;
    -webkit-border-top-left-radius:8px;
    -webkit-border-bottom-right-radius:0;
    -webkit-border-bottom-left-radius:0;
  }

</style>

<script type="text/javascript">

    /*
     * DEFAULT OPTIONS
     *
     options: {
     template:"yourMenuVoiceTemplate",--> the url that returns the menu voices via ajax. the data passed in the request is the "menu" attribute value as "menuId"
     additionalData:"",                             --> if you need additional data to pass to the ajax call
     menuSelector:".menuContainer",     --> the css class for the menu container
     menuWidth:150,                                     --> min menu width
     openOnRight:false,                             --> if the menu has to open on the right insted of bottom
     iconPath:"ico/",                                   --> the path for the icons on the left of the menu voice
     hasImages:true,                                    --> if the menuvoices have an icon (a space on the left is added for the icon)
     fadeInTime:100,                                    --> time in milliseconds to fade in the menu once you roll over the root voice
     fadeOutTime:200,                                   --> time in milliseconds to fade out the menu once you close the menu
     menuTop:0,                                             --> top space from the menu voice caller
     menuLeft:0,                                            --> left space from the menu voice caller
     submenuTop:0,                                      --> top space from the submenu voice caller
     submenuLeft:4,                                     --> left space from the submenu voice caller
     opacity:1,                                             --> opacity of the menu
     shadow:false,                                      --> if the menu has a shadow
     shadowColor:"black",                           --> the color of the shadow
     shadowOpacity:.2,                              --> the opacity of the shadow
     openOnClick:true,                              --> if the menu has to be opened by a click event (otherwise is opened by a hover event)
     closeOnMouseOut:false,                     --> if the menu has to be cloesed on mouse out
     closeAfter:500,                                    --> time in millisecond to whait befor closing menu once you mouse out
     minZindex:"auto",                              --> if set to "auto" the zIndex is automatically evaluate, otherwise it start from your settings ("auto" or int)
     hoverInted:0,                                      --> if you use jquery.hoverinted.js set this to time in milliseconds to delay the hover event (0= false)
     onContextualMenu:function(o,e){} --> a function invoked once you call a contextual menu; it pass o (the menu you clicked on) and e (the event)
     },
     */

    $(function(){
        $(".myMenu").buildMenu(
                {
                    template:"menuVoices.html",
                    additionalData:"pippo=1",
                    menuWidth:200,
                    openOnRight:false,
                    menuSelector: ".menuContainer",
                    iconPath:"ico/",
                    hasImages:true,
                    fadeInTime:100,
                    fadeOutTime:300,
                    adjustLeft:0,
                    minZindex:"auto",
                    adjustTop:0,
                    opacity:.95,
                    shadow:false,
                    shadowColor:"#ccc",
                    hoverIntent:0,
                    openOnClick:true,
                    closeOnMouseOut:true,
                    closeAfter:1000,
                    submenuHoverIntent:200
                });

        $(".vertMenu").buildMenu(
                {
                    template:"menuVoices.html",
                    menuWidth:170,
                    openOnRight:true,
                    menuSelector: ".menuContainer",
                    iconPath:"ico/",
                    hasImages:true,
                    fadeInTime:200,
                    fadeOutTime:200,
                    adjustLeft:0,
                    adjustTop:0,
                    opacity:.95,
                    openOnClick:false,
                    minZindex:200,
                    shadow:false,
                    hoverIntent:130,
                    submenuHoverIntent:130,
                    closeOnMouseOut:true
                });

        $(document).buildContextualMenu(
                {
                    template:"menuVoices.html",
                    menuWidth:200,
                    overflow:2,
                    menuSelector: ".menuContainer",
                    iconPath:"ico/",
                    hasImages:false,
                    fadeInTime:100,
                    fadeOutTime:100,
                    adjustLeft:0,
                    adjustTop:0,
                    opacity:.99,
                    closeOnMouseOut:false,
                    onContextualMenu:function(o,e){
                        testForContextMenu();
                    }, //params: o = the contextual menu,e = the event
                    shadow:false
                });

    });

    //this function get the id of the element that fires the context menu.
    function testForContextMenu(el){
        //if (!el) el= $.mbMenu.lastContextMenuEl;
        showMessage("the ID of the element is:   "+$(el).attr("id"));
    }

    function recallcMenu(el){
        if (!el) el= $.mbMenu.lastContextMenuEl;
        var cmenu=+$(el).attr("cmenu");
        $(cmenu).remove();
    }

    function loadFlash(){
        $.ajax({
            url:"testFlash/test.html",
            dataType:"html",
            success:function(html){
                $("#flashTest").html(html);
            }
        });
    }

    function showMessage(msg){
        var msgBox=$("<div>").addClass("msgBox");
        $("body").append(msgBox);
        msgBox.append(msg);
        setTimeout(function(){msgBox.fadeOut(500,function(){msgBox.remove();})},3000)
    }

</script>

</head>
<body bgcolor="#ffffff">
<div class="wrapper">   
    <table width="100%"  border="0" cellpadding="0" cellspacing="0" bgcolor="#EDEDED">
        <tr>            
            <td valign="bottom">

                <!-- start horizontal menu -->

                <table class="myMenu rootVoices" cellspacing='0' cellpadding='0' border='0'><tr>
                    <td id="firstVoice" class="rootVoice {menu: 'box_menu'}" >Connected Devices</td>
                    <td id="firstVoice_1" class="rootVoice {menu: 'menu_12'}" >ajax menu</td>
                    <td id="firstVoice_2" class="rootVoice {menu: 'menu_2'}" >Audio & Image</td>
                    <td id="firstVoice_3" class="rootVoice {menu: 'menu_2', disabled:true}" >menu disabled</td>
                    <td id="firstVoice_4" class="rootVoice {menu: 'menu_3'}" >menu 2</td>
                    <td id="firstVoice_5" class="rootVoice {menu: 'empty'}" onclick="showMessage('empty root menu')">empty menu</td>
                    <td>not a mb.menu voice</td>
                </tr></table>
            </td>
        </tr>
    </table>
    
    

    <!-- menues -->
    <div id="menu_1" class="mbmenu">
        <a data-type="title" >title menu_1.1</a> <!-- menuvoice title-->
        <a href="http://patapage.com" class="{img: 'ico_view.gif'}" >menu_1.1 (href with target "_self") </a> <!-- menuvoice with href-->
        <a class="{action: 'showMessage(\'menu_1.2\')'}" >menu_1.2</a> <!-- menuvoice with js action-->
        <a data-type="separator"> </a> <!-- menuvoice separator-->
        <a href="#" class="{action: 'showMessage(\'menu_1.3\')', disabled:true}">menu_1.3</a> <!-- menuvoice disabled-->
        <a class="{action: 'showMessage(\'menu_1.4\')', menu:'menu_1', img: '24-book-blue-check.png'}">menu_1.4</a><!-- menuvoice with js action, image and submenu-->
    </div>

    <div id="menu_2" class="mbmenu">
       <a onclick="openMemberPanel();" >Open Member Panel</a>
       <a onclick="openResume();" class="{img: 'icon_13.png'}">Open Resume</a>
        <a href="http://google.com" target="_blank">Member Panel 2</a>
  
    </div>

    <div id="menu_3" class="mbmenu" id="checkMenu">
        <a data-type="text">
            <form>
                <img src="images/browser.png" alt="img" style="position:absolute;margin-top:-20px; margin-left:-25px;margin-bottom:10px"/><br/>
                <input id="myInput" type="text" name="sss" value="you can have input inside" />
                <input type="button" name="xxx" value="submit" onclick="$.fn.removeMbMenu($.mbMenu.options.actualOpenedMenu,true);"/>
                <table>
                    <tr><td><input type="checkbox" checked value="aaa"/></td><td>checkbox 1</td></tr>
                    <tr><td><input type="checkbox" value="aaa"/></td><td>checkbox 1</td></tr>
                    <tr><td><input type="checkbox" value="aaa"/></td><td>checkbox 2</td></tr>
                    <tr><td><input type="checkbox" value="aaa"/></td><td>checkbox 3</td></tr>
                </table>
                <br>
                <br/>* form fields value are not preserved once you close the menu!
            </form>
        </a>
        <a data-type="separator"> </a>
        <a class="{action: 'showMessage(\'menu_3.1\')', img: 'iconDone.png'}">menu_3.1</a>
        <a id="aaa" class="{menu:'sub_menu_2'}"  >submenu</a>
        <a class="{action: 'showMessage(\'menu_3.4\')'}">menu_3.4 con testo veramente molto lungo menu_3.4 con testo veramente molto lungo</a>
    </div>

    <div id="sub_menu_1" class="mbmenu">
        <a class="{action: 'showMessage(\'sub_menu_1.1\')'}">sub_menu_1.1</a>
        <a data-type="separator"> </a>
        <a class="{menu:'menu_1'}">sub_menu_1.2</a>
        <a class="{action: 'showMessage(\'sub_menu_1.3\')', img: 'bgColor.gif'}">sub_menu_1.3</a>
        <a class="{action: 'showMessage(\'sub_menu_1.4\')',img: 'Applet.gif'}">sub_menu_1.4</a>
    </div>

    <div id="sub_menu_2" class="mbmenu">
        <a class="{action: 'showMessage(\'sub_menu_2.1\')', img: 'buttonfind.gif'}" target="_blank" >sub_menu_2.1</a>
        <a href="http://google.com" class="{img: 'buttonfind.gif'}" target="_self" >sub_menu_2.2 (href target _self)</a>
        <a class="{action: 'showMessage(\'sub_menu_2.3\')'}">sub_menu_2.3</a>
        <a data-type="separator"> </a>
        <a class="{action: 'showMessage(\'sub_menu_2.4\')'}">sub_menu_2.4</a>
        <a class="{action: 'showMessage(\'sub_menu_2.5\')'}" >sub_menu_2.5</a>
    </div>

    <div id="conext_menu_1" class="mbmenu">
        <a data-type="text" >
            <img src="images/browser.png" alt="img" style="position:absolute;margin-top:-20px; margin-left:-25px;margin-bottom:10px"/><br/>
            <br/>immagini che vuoi ed altro testo che ti pare Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi felis leo, consequat et, lacinia a, facilisis sit amet,<br/><br/>
        </a>
        <a data-type="separator"> </a>
        <a class="{action: 'testForContextMenu()',img: 'iconDone.png'}" >test: get opener ID</a>
        <a id="bbb" class="{menu:'sub_menu_2'}" >submenu</a>
        <a class="{action: 'showMessage(\'conext_menu_1.4\')'}" >conext_menu_1.4 con testo veramente molto lungo</a>
    </div>

    <div id="box_menu" class="mbmenu boxMenu">
        <table style="border:0;" >
            <tr>
                <td>
                    <div style="height:130px"><img src="images/darklisa (1).jpg" alt="patapage" width="150"></div>
                    <a href="http://patapage.com" target="_blank">Home</a>
                    <a href="http://patapage.com/demo/" target="_blank">Demo page</a>
                    <a href="http://patapage.com/applications/pataPage/site/aboutHelp.jsp" target="_blank">About Patapage</a>
                    <a href="http://patapage.com/applications/pataPage/site/access/login.jsp" target="_blank">Sign up</a>
                </td>
                <td>
                    <div style="height:130px;"><img src="http://bugsvoice.com/applications/bugsVoice/images/logo.png" alt="bugsvoice" width="250" style="padding-top:30px"></div>
                    <a href="http://bugsvoice.com" target="_blank">Home</a>
                    <a href="http://bugsvoice.com/applications/bugsVoice/site/details.jsp" target="_blank">Details</a>
                    <a href="http://bugsvoice.com/applications/bugsVoice/site/aboutHelp.jsp" target="_blank">About Bugs Voice</a>
                    <a href="http://bugsvoice.com/applications/bugsVoice/site/access/login.jsp" target="_blank">Sign up</a>
                </td>
                <td>
                    <div style="height:130px"><img src="http://devineu.eu/applications/webwork/site_devineu/media/baloonSmall.png" alt="bugsvoice" width="200"></div>
                    <a href="http://devineu.eu/home.page" target="_blank">Home</a>
                    <a href="http://devineu.eu/mission.page" target="_blank">Mission</a>
                    <a href="http://devineu.eu/interviewyourself.page" target="_blank">Interview yourself</a>
                    <a href="http://devineu.eu/getInterviewed.page" target="_blank">Get interviewed</a>
                    <a onclick="showMessage('close!!')">close on click</a>
                </td>
            </tr>
        </table>
    </div>
</div>
</body>
</html>

<?php
