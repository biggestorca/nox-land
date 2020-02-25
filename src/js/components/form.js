import $ from "jquery";

export const initForm = () => {
    const $form = $("#request-form");
    const $formMessage = $("#request-form-message");

    $form.on("submit", function(e) {
        e.preventDefault();

        $formMessage.removeClass("d-none");        
        $form.parents(".form-wrapper").addClass("d-none");
    });
};
