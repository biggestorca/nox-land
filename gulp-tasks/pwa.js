"use strict";

import { paths } from "../gulpfile.babel";
import gulp from "gulp";
import debug from "gulp-debug";

gulp.task("pwa", () => {
    return gulp.src(paths.pwa.src)
        .pipe(gulp.dest(paths.pwa.dist))
        .pipe(debug({
            "title": "PWA"
        }));
});