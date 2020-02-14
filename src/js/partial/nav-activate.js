const navigatorLinksActivator = () => document.addEventListener("DOMContentLoaded", () => {
    const loc = window.location.pathname;
    const navList = document.getElementsByClassName("b-nav__item");

    for(let i = 0; i < navList.length; i++) {
        const attrHref = navList[i].getElementsByClassName("b-nav__link")[0].getAttribute("href");
        if(loc === attrHref) {
            navList[i].classList.add("active");
        } else {
            navList[i].classList.remove("active");
        }
    }
});

export default navigatorLinksActivator;
