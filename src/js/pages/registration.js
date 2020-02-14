import $ from "jquery";
import "jquery-validation";

$(document).ready(() => {
    const $form = $("#register-form");
    const $submitHandler = $form.find(".b-button[type='submit']");

    const validateConstrains = {
        rules: {
            Email: {
                required: true,
                email: true,
            },
            FirstName: {
                required: true,
            },
            Password: {
                required: true,
                minlength: 6,
            },
            Phone: {
                required: true,
            },
            LastName: {
                required: true,
            },
            CountryId: {
                required: true,
            },
        },
        messages: {
            Email: {
                required: "Please provide an email",
                email: "Must be valid email address",
            },
            Password: {
                required: "Please provide a password",
                minlength: "Password must be at least 6 characters long",
            },
            Phone: {
                required: "Please provide an phone number",
            },
            FirstName: {
                required: "Please provide an first name",
            },
            LastName: {
                required: "Please provide an last name",
            },
            CountryId: {
                required: "Please provide an country",
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
                url: "/post/register/",
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
