import $ from "jquery";

const initLogoutHandler = () => {
    $("#sign-out").on("click", () => {
        $.ajax({});
    });
};

export default initLogoutHandler;
