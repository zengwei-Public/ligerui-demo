include("/Scripts/plugins/tab/jquery-tab.css");
include("/Scripts/jquery-1.8.2.min.js");
include("/Scripts/plugins/tab/jquery.tab.js");
function init() {
    window['MyTabContainter'] = new TabView({
        containerId: 'tab_menu',
        pageid: 'page',
        cid: 'tab_po',
        position: "top"
    });
    window['MyTabContainter'].add({
        id: 'id_0',
        title: "桌面",
        url: "/Frame/Notice",
        //	url: "/Home/Welcome",
        isClosed: false
    });
    if (!window['SetPage']) {
        window['SetPage'] = function (id, title, url, isclosed) {
            window['MyTabContainter'].add({
                id: id,
                title: title,
                url: url,
                isClosed: isclosed
            });
            //alert(document.getElementById("page").innerHTML);
        };
    }
}