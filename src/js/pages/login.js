import $ from "jquery";
import "jquery-validation";

$(document).ready(() => {
    const $form = $("#login-from");
    const $submitHandler = $form.find(".b-button[type='submit']");

    const validateConstrains = {
        rules: {
            email: {
                required: true,
                email: true,
            },
            password: {
                required: true,
                minlength: 6,
            },
        },
        messages: {
            email: {
                required: "Please provide an email",
                email: "Must be valid email address",
            },
            password: {
                required: "Please provide a password",
                minlength: "Password must be at least 6 characters long",
            },
        },
    };

    $form.validate({
        submitHandler(form, event) {
            $submitHandler.attr("disable", "disable");
            event.preventDefault();

            const errors = $("#errors ul");
            const success = $("#success");
            errors.hide();
            success.hide();

            $.ajax({
                url: "/post/login/",
                data: $(form).serializeArray(),
                type: "POST",
                success: function(response) {
                    errors.empty();
                    if (response.result) {
                        success.show();
                        setTimeout(function() {
                            document.location.href = "/";
                        }, 2000);
                    } else {
                        if (response.message.length) {
                            response.message.forEach(function(item) {
                                errors.append(`<li>${item}</li>`);
                            });

                            errors.show();
                        } else {
                            errors.hide();
                        }
                    }
                },
            });
        },
        ...validateConstrains,
    });
});
