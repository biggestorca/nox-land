import gulp from "gulp";

const requireDir = require("require-dir");

const paths = {
    views: {
        src: ["./src/views/index.html", "./src/views/pages/*.html"],
        dist: "./dist/",
        watch: ["./src/views/**/*.html"],
    },
    styles: {
        src: ["./src/styles/main.{scss,sass}", "./src/styles/vendor.scss"],
        dist: "./dist/styles/",
        watch: ["./src/styles/**/*.{scss,sass}"],
    },
    scripts: {
        src: "./src/js/main.js",
        dist: "./dist/js/",
        watch: ["./src/js/**/*.js"],
    },
    images: {
        src: [
            "./src/img/**/*.{jpg,jpeg,png,gif,tiff,svg}",
            "!./src/img/favicon/*.{jpg,jpeg,png,gif,tiff}",
        ],
        dist: "./dist/img/",
        watch: "./src/img/**/*.{jpg,jpeg,png,gif,svg,tiff}",
    },
    webp: {
        src: [
            "./src/img/**/*.{jpg,jpeg,png,tiff}",
            "!./src/img/favicon/*.{jpg,jpeg,png,gif,tiff}",
        ],
        dist: "./dist/img/",
        watch: [
            "./src/img/**/*.{jpg,jpeg,png,tiff}",
            "!./src/img/favicon/*.{jpg,jpeg,png,gif,tiff}",
        ],
    },
    fonts: {
        src: "./src/fonts/**/*.{ttf,woff,woff2}",
        dist: "./dist/fonts/",
        watch: "./src/fonts/**/*.{ttf,woff,woff2}",
    },
    favicons: {
        src: "./src/img/favicons/*.{jpg,jpeg,png,gif}",
        dist: "./dist/img/favicons/",
    },
    pwa: {
        src: "./src/pwa/*.{json,js}",
        dist: "./dist/",
    },
};

requireDir("./gulp-tasks/");

export { paths };

export const development = gulp.series(
    "clean",
    gulp.parallel([
        "views",
        "styles",
        "scripts",
        "images",
        "fonts",
        "favicons",
    ]),
    gulp.parallel("serve")
);

export const prod = gulp.series(
    "clean",
    gulp.series(["views", "styles", "scripts", "images", "fonts", "favicons", "pwa"])
);

export default development;
