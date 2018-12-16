

gulp.task('build', function () {
    return browserify({entries: './src/index.js', debug: true})
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['build'], function () {
    gulp.watch('./src/*.js', ['build']);
});

gulp.task('default', ['watch']);
