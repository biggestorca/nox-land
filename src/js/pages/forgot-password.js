import $ from "jquery";
import "jquery-validation";

$(document).ready(() => {
    const $form = $("#forgot-password");
    const $submitHandler = $form.find(".b-button[type='submit']");

    const validateConstrains = {
        rules: {
            email: {
                required: true,
                email: true,
            }
        },
        messages: {
            email: {
                required: "Please provide an email",
                email: "Must be valid email address",
            }
        },
    };

    $form.validate({
        submitHandler(form, event) {

            $submitHandler.attr("disable", "disable");
            event.preventDefault();

            var errors = $('#errors ul');
            var success = $('#success');
            errors.hide();
            success.hide();

            $.ajax({
                url: '/post/forgot-password/',
                data: $(form).serializeArray(),
                type: 'POST',
                success: function (response) {
                    errors.empty();
                    if (response.result) {
                        success.show();
                    } else {
                        if (response.message.length) {
                            response.message.forEach(function (item) {
                                errors.append('<li>' + item + '</li>');
                            });

                            errors.show();
                        }
                        else {
                            errors.hide();
                        }
                    }
                }
            });
        },
        ...validateConstrains
    });
});