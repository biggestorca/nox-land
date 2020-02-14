import $ from "jquery";
import "select2";
import "magnific-popup";
import "jquery-validation";

import TabsManager from "../components/tabs";
import TooltipManager from "../components/tooltip";
import initModal from "../components/modal";
import { closeButton } from "../helpers/close-svg";
import StepsManager from "../components/steps";

/**
 * Create tab header markup
 * @param { number } wizardsCount - number of created wizards
 * @return { HTMLElement } - header markup for tab item
 * */
const createTabsHeaderItem = wizardsCount => {
    const headerItem = document.createElement("li");

    headerItem.classList.add("b-tabs__header-item");
    headerItem.innerHTML = `Template ${wizardsCount} <button class="b-tabs__remove-item">${closeButton}</button>`;

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
const initTab = ($stepsNodeSelector, counter) => {
    const steps = new StepsManager($stepsNodeSelector);

    // TODO:
    //  Change one button handler to self handler for each step
    //  Add unique validation for each step
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

    const $tooltipsList = $stepsNodeSelector.find(".b-tooltip");

    // eslint-disable-next-line func-names
    $tooltipsList.each(function() {
        // eslint-disable-next-line no-new
        new TooltipManager($(this));
    });

    // Need to re-init modal handler here because we need to use modals which is triggered by buttons in last step
    // Each steps block creates from html example and handlers don't propagate for any buttons, etc in new markup
    // In future probably this modals will be triggered from code and initialization method will be removed from here
    initModal();

    // Functional for adding columns
    const addColumnTrigger = $("#add-column");
    const columnsWrapper = $("#columns-wrapper");
    const types = ["text", "number"];
    let fieldsCount = 0;

    addColumnTrigger.on("click", e => {
        e.preventDefault();

        const wrapper = document.createElement("div");
        const nameWrapper = document.createElement("div");
        const nameInput = document.createElement("input");
        const typeWrapper = document.createElement("div");
        const typeSelect = document.createElement("select");

        // Set input attrs
        $(nameInput).attr("type", "text");
        $(nameInput).attr("name", `column-name-${fieldsCount}`);
        $(nameInput).attr("id", `column-name-${fieldsCount}`);
        $(nameInput).addClass("b-form__field l-w-260px");

        $(nameWrapper).addClass("l-w-300px l-mr-20 l-pl-20");
        $(nameWrapper).append(nameInput);

        // Set select attrs
        $(typeSelect).addClass("b-form__field select2 l-w-260px");
        $(typeSelect).attr("name", `column-type-${fieldsCount}`);
        $(typeSelect).attr("id", `column-type-${fieldsCount}`);
        types.forEach(type => {
            $(typeSelect).append(`<option value="${type}">${type}</option>`);
        });
        $(typeWrapper).append(typeSelect);
        $(typeWrapper).addClass("l-pl-20");

        // Main column wrapper
        $(wrapper).addClass("d-flex l-mt-20");
        $(wrapper).attr("id", `column-${fieldsCount}`);
        $(wrapper)
            .append(nameWrapper)
            .append(typeWrapper);

        columnsWrapper.append(wrapper);

        // Init select2 for new select
        $(typeSelect).select2({
            minimumResultsForSearch: Infinity,
        });

        fieldsCount += 1;
    });
};

$(document).ready(() => {
    let haveOpenedBatchWizard = false;
    let wizardsCount = 0;
    const dashboardNode = $("#address-book-dashboard");
    const tabsNode = $("#tabs-address-book-wizard");
    const tabNode = $("#address-book-tab-example");
    const tabsHeaderListNode = tabsNode.find(".b-tabs__header-list");
    const tabsContentNode = tabsNode.find(".b-tabs__content");
    let tabsManager = null;

    const $filteredForm = $("#address-book-filtered-form");
    const $filteredFormSubmitHandler = $filteredForm.find(
        ".b-button[type='submit']"
    );

    const validateConstrains = {
        rules: {
            "filter-template-name": {
                required: false,
            },
        },
        messages: {
            "filter-template-name": {
                required: "Please provide an template name",
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
    $("#open-address-book-wizard").on("click", event => {
        event.preventDefault();
        wizardsCount += 1;

        // Create new tab header and content markup
        const headerItem = createTabsHeaderItem(wizardsCount);
        const contentItem = createTabsContentItem();

        // Clone tab from hidden template
        const tab = tabNode.clone();

        $(tab).removeAttr("id");

        // Added tab content to new tab
        tab.appendTo(contentItem);

        // Added tabs header and content to tabs markup
        tabsHeaderListNode.append($(headerItem));
        tabsContentNode.append($(contentItem));

        // Init new tab
        initTab($(tab), wizardsCount);

        // Show tab
        tab.removeClass("d-none");

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
