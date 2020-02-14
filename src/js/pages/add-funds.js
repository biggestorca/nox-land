import $ from "jquery";
import "jquery-validation";
import StepsManager from "../components/steps";

$(document).ready(() => {
    const stepsNode = $(".b-steps");
    const steps = new StepsManager(stepsNode);

    const errorsFrmCompanyData = $('#errors ul');

    $(".b-steps__next:not(.b-steps__next--submit)").on("click",
        (event) => {
            event.preventDefault();

            const nextStep = $(event.target).attr("data-next-step");
            const currentFormSuccessful = true;

            if (currentFormSuccessful && typeof +nextStep === "number") {
                steps.activeStep.setCompleted();
                steps.activateStep(steps.steps[+nextStep], currentFormSuccessful);
            }
        });

    $(".b-steps__next.b-steps__next--submit.to-step2").on("click",
        (event) => {
            event.preventDefault();
            errorsFrmCompanyData.hide();
            $("#add-funds-company-details").submit();
        });

    $(".b-steps__next.b-steps__next--submit.to-step3").on("click",
        (event) => {
            event.preventDefault();
            errorsFrmCompanyData.hide();
            $("#add-funds-money").submit();
        });

    $(".b-steps__prev").on("click",
        (event) => {
            event.preventDefault();

            const prevStep = $(event.target).attr("data-prev-step");

            if (typeof +prevStep === "number") {
                steps.activateStep(steps.steps[+prevStep], true);
            }
        });

    const validateConstrainsCompanyData = {
        rules: {
            CompanyName: {
                required: true
            },
            CountryId: {
                required: true
            },
            TaxNumber: {
                required: true
            },
            Street1: {
                required: true
            },
            City: {
                required: true
            },
            ZipCode: {
                required: true
            }
        },
        messages: {
            CompanyName: {
                required: "Please provide an company name"
            },
            CountryId: {
                required: "Please provide an country"
            },
            TaxNumber: {
                required: "Please provide an tax number"
            },
            Street1: {
                required: "Please provide an street"
            },
            City: {
                required: "Please provide an city"
            },
            ZipCode: {
                required: "Please provide an zip code"
            }
        },
    };
    const $formCompanyData = $("#add-funds-company-details");
    $formCompanyData.validate({
        submitHandler(form, eventF) {

            eventF.preventDefault();
            $.ajax({
                url: '/post/savecompanydata/',
                data: $(form).serializeArray(),
                type: 'POST',
                success: function (response) {
                    errorsFrmCompanyData.empty();
                    if (response.result) {
                        $('.invoice-summary').html(response.invoice);

                        steps.activeStep.setCompleted();
                        steps.activateStep(steps.steps[2], true);
                    } else {
                        if (response.message.length) {
                            response.message.forEach(function (item) {
                                errorsFrmCompanyData.append('<li>' + item + '</li>');
                            });

                            errorsFrmCompanyData.show();
                        } else {
                            errorsFrmCompanyData.hide();
                        }
                    }
                }
            });
        },
        ...validateConstrainsCompanyData
    });

    const validateConstrainsAddFunds = {
        rules: {
            AmountToAdd: {
                required: true,
                min: 10
            }
        },
        messages: {
            AmountToAdd: {
                required: "Please provide an sum",
                min: "Set sum from 10EUR"
            }
        },
    };
    const $formAddFunds = $("#add-funds-money");
    $formAddFunds.validate({
        submitHandler(form, eventM) {
            eventM.preventDefault();

            var amount = $('#amount-to-add').val();

            $('.amount-summary').text(parseFloat(amount).toFixed(2) + ' EUR');
            $('.totalamount-summary').text(parseFloat(amount).toFixed(2) + ' EUR');
            
            steps.activeStep.setCompleted();
            steps.activateStep(steps.steps[3], true);
        },
        ...
        validateConstrainsAddFunds
    });
});
