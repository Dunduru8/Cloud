var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var useref = require("gulp-useref");
var gulpif = require("gulp-if");
var uglify = require("gulp-uglify"); //минимизирует JS файлы
var minifyCss = require("gulp-minify-css"); //минимизирует css файлы

var src = {
    scss: "src/scss/**/*.+(scss|sass)",  //шаблон для для отслеживания scss и sass в папках и подпапках 
    html: "src/*.html",        
}
gulp.task("scss", function(){
    return gulp.src(src.scss)  // считывание данных из файла
    .pipe(sass())    //команда пайп передает данные из одного одработчика в другой, в данном случае в плагин sass 
    .pipe(gulp.dest("src/css")) //указывается куда сохранять обработанный файл
    .pipe(browserSync.reload({ stream: true}));
});

gulp.task("browserSync", function(){
    browserSync({
        server: {
            baseDir: "src",  //папка в которой располагается корневая директория
        },
    });
});

gulp.task("createWatchers", function(){
    gulp.watch(src.scss, gulp.series("scss")); //следит за измененеиями в файлах стилей
    gulp.watch(src.html, browserSync.reload);  
});

gulp.task("watch", gulp.parallel("browserSync", "createWatchers"));

gulp.task('html', function () {
    return gulp.src(src.html)
        .pipe(useref())
        .pipe(gulpif("*.js", uglify()))
        .pipe(gulpif("*.css", minifyCss()))
        .pipe(gulp.dest("dist"));
});



