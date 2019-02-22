let drawerOpen = true;

function drawer() {    
    if (drawerOpen === true) {
        $(".list-group-item").attr("tabindex", "0");
        gameScreen.focus();
    } else {
        $(".list-group-item").attr("tabindex", "-1");
    }
}
