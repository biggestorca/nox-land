import $ from "jquery";
import "select2";
import "magnific-popup";
import "air-datepicker";
import "jquery-validation";

import TabsManager from "../components/tabs";
import StepsManager from "../components/steps";
import TooltipManager from "../components/tooltip";
import initModal from "../components/modal";
import closeMfpButton, { closeButton } from "../helpers/close-svg";
import textareaCounter from "../helpers/textareaCounter";

// Vendor
import { timepicker } from "../vendor/timepicki";

/**
 * Create tab header markup
 * @param { number } wizardsCount - number of created wizards
 * @return { HTMLElement } - header markup for tab item
 * */
const createTabsHeaderItem = wizardsCount => {
    const headerItem = document.createElement("li");

    headerItem.classList.add("b-tabs__header-item");
    headerItem.innerHTML = `Batch ${wizardsCount} wizard <button class="b-tabs__remove-item">${closeButton}</button>`;

    return headerItem;
};

/**
 * Create tab content markup
 * @return { HTMLElement } - content markup for tab item
 * */
const createTabsContentItem = () => {
    const contentItem = document.createElement("div");

    contentItem.classList.add("b-tabs__content-item");

    return contentItem;
};

/**
 * Initializing steps plugin
 * Triggered when user clicked "+ New batch" button
 * initializing steps in new tab, also
 * initializing logic of forms in the new tab with new steps
 *
 * @param { jQuery } $stepsNodeSelector - New steps markup
 * @param { number } counter - tabs counter
 * */
const initSteps = ($stepsNodeSelector, counter) => {
    const steps = new StepsManager($stepsNodeSelector);

    $stepsNodeSelector.find(".b-steps__next").on("click", event => {
        event.preventDefault();

        const nextStep = $(event.target).attr("data-next-step");
        const currentFormSuccessful = true;

        if (currentFormSuccessful && typeof +nextStep === "number") {
            steps.activeStep.setCompleted();
            steps.activateStep(steps.steps[+nextStep], currentFormSuccessful);
        }
    });

    $stepsNodeSelector.find(".b-steps__prev").on("click", event => {
        event.preventDefault();

        const prevStep = $(event.target).attr("data-prev-step");

        if (typeof +prevStep === "number") {
            steps.activateStep(steps.steps[+prevStep], true);
        }
    });

    // Uniq id for selects
    const select2List = $stepsNodeSelector.find(".select2.no-autoinit");
    // eslint-disable-next-line func-names
    select2List.each(function() {
        const self = $(this);

        // Need change id because each new tab has markup from template with same id for select
        self.attr("id", `${self.attr("id")}--${counter}`);

        self.select2({
            minimumResultsForSearch: Infinity,
        });
    });

    // Load file
    const fileField = $stepsNodeSelector.find("input[type=file]");
    let fileUploadSuccess = false;

    fileField.on("change", event => {
        event.preventDefault();

        const file = fileField.get(0).files[0];

        if (file) {
            // TODO:
            //  There must be ajax call to the server, where file will analyzing
            //  After success call we have data analyzing from file
            //  which we show in modal window below

            fileUploadSuccess = true;
        }

        fileField
            .parent()
            .find(".b-form__field--file-name")
            .text(file.name);

        if (fileUploadSuccess) {
            // TODO: Add data about file to modal window markup

            // Show success modal window with info
            $.magnificPopup.open({
                items: {
                    src: "#batch-uploaded-file",
                    removalDelay: 200,
                    mainClass: "mfp-fade",
                    closeMarkup: closeMfpButton,
                },
            });

            // TODO:
            //  have js/components/modal.js where all about modal logic, handlers etc...
            //  and all logic must be in one place, that's why need refactoring this place
            $(".js-mfp-close").on("click", () => {
                if ($.magnificPopup.instance.isOpen) {
                    $.magnificPopup.close();
                }
            });
        }
    });

    // Toggle country codes select visibility by checkbox
    const $enableCountryCodesCheckbox = $stepsNodeSelector.find(
        "#enable-country-codes"
    );
    const $enableCountryCodesSelectGroup = $stepsNodeSelector.find(
        ".js-enable-country-codes-group"
    );

    $enableCountryCodesSelectGroup.hide();

    $enableCountryCodesCheckbox.on("change", event => {
        event.preventDefault();

        $enableCountryCodesSelectGroup.toggle("fast");
    });

    // Textarea count letters
    const $messageTextareaCounter = textareaCounter($("#message-wrapper"));

    const $datePickerInput = $stepsNodeSelector.find("#date");
    $datePickerInput.datepicker({
        // position: "left top",
        minDate: new Date(),
    });

    timepicker($);
    const $timePickerInput = $stepsNodeSelector.find("#time");
    $timePickerInput.timepicki({
        show_meridian: false,
        min_hour_value: 0,
        max_hour_value: 23,
        step_size_minutes: 1,
        overflow_minutes: true,
        increase_direction: "up",
        disable_keyboard_mobile: false,
    });

    // Need to re-init modal handler here because we need to use modals which is triggered by buttons in last step
    // Each steps block creates from html example and handlers don't propagate for any buttons, etc in new markup
    // In future probably this modals will be triggered from code and initialization method will be removed from here
    initModal();
};

$(document).ready(() => {
    let haveOpenedBatchWizard = false;
    let wizardsCount = 0;
    const dashboardNode = $("#batch-dashboard");
    const tabsNode = $("#tabs-batch-wizard");
    const stepsNode = $(".b-batch__content > .b-steps--batch");
    const tabsHeaderListNode = tabsNode.find(".b-tabs__header-list");
    const tabsContentNode = tabsNode.find(".b-tabs__content");
    let tabsManager = null;

    const $filteredForm = $("#batch-filtered-form");
    const $filteredFormSubmitHandler = $filteredForm.find(
        ".b-button[type='submit']"
    );

    const validateConstrains = {
        rules: {
            "filter-batch-name": {
                required: false,
            },
        },
        messages: {
            "filter-batch-name": {
                required: "Please provide an batch name",
            },
        },
    };

    $filteredForm.validate({
        submitHandler(form, event) {
            $filteredFormSubmitHandler.attr("disable", "disable");
            event.preventDefault();

            const errors = $("#errors ul");
            const success = $("#success");
            errors.hide();
            success.hide();

            $.ajax({
                url: "",
                data: $(form).serializeArray(),
                type: "POST",
                success: function(response) {
                    errors.empty();
                    if (response.result) {
                        success.show();
                        $filteredFormSubmitHandler.removeAttr("disable");
                        // Update table
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

    /*
     * Handler of click which is create new tab (batch wizard) with steps
     * */
    $("#open-batch-wizard").on("click", event => {
        event.preventDefault();
        wizardsCount += 1;

        // Create new tab header and content markup
        const headerItem = createTabsHeaderItem(wizardsCount);
        const contentItem = createTabsContentItem();

        // Clone steps from hidden template
        const steps = stepsNode.clone();

        // Added steps to new tab
        steps.appendTo(contentItem);

        // Added tabs header and content to tabs markup
        tabsHeaderListNode.append($(headerItem));
        tabsContentNode.append($(contentItem));

        // Init new steps
        initSteps($(steps), wizardsCount);

        const $tooltipsList = steps.find(".b-tooltip");

        // eslint-disable-next-line func-names
        $tooltipsList.each(function() {
            // eslint-disable-next-line no-new
            new TooltipManager($(this));
        });

        // Show steps
        steps.removeClass("d-none");

        /**
         * Callback for removing tab
         * @param { number } tabsCount - count of created tabs at the page.
         * */
        const removeTabCallback = tabsCount => {
            // eslint-disable-next-line no-cond-assign
            if (tabsCount === 0) {
                // Show Dashboard content
                dashboardNode.removeClass("d-none");

                // Hide tabs
                tabsNode.addClass("d-none");

                wizardsCount = 0;
                haveOpenedBatchWizard = false;
                tabsManager = null;
            }
        };

        if (haveOpenedBatchWizard) {
            // Tracked tab by TabsManager
            tabsManager.registerTab(headerItem, contentItem, wizardsCount - 1);

            // Make new tab visible
            tabsManager.activateTab(
                tabsManager.tabs[tabsManager.tabs.length - 1]
            );
        } else {
            // Tracked tab by TabsManager
            tabsManager = new TabsManager(tabsNode, removeTabCallback);

            // Hide Dashboard content
            dashboardNode.addClass("d-none");

            // Show tabs
            tabsNode.removeClass("d-none");

            haveOpenedBatchWizard = true;
        }
    });
});
