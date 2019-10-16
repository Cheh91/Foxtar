// в скобках присвоены все мощности программы gulp которые записаны в node modules/ gulp (пишется всегда)
var gulp = require('gulp'),
    // для конвертации из scss
    // перед тем как записать переменную, нужно установить в командной строке gulp-sass --save -dev
    // https://www.npmjs.com/package/gulp-sass    рекомендации по поводу установки
    scss = require('gulp-sass'),
    // для автоматического отображения изменений в браузере
    browserSync = require('browser-sync'),
    // сжимает файлы
    uglifyjs = require('gulp-uglifyjs'),
    // обьеденяет файлы в один
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('scss', function() {
    // находим файл который нужно перевести в css: app/scss/**/*.scss
    return gulp.src('app/scss/**/*.scss')
        // {outputStyle: 'expanded'} для того чтобы код в css был красивым
        // {outputStyle: 'compressed'} для того чтобы код в css был минифицированным
        .pipe(scss({ outputStyle: 'compressed' }))
        // зайти в документацию на сайте npm ввести название плагина npm autoprefixer и там посмотреть что добавлять
        // чтобы проверить работает или нет, нужно в style.scss что нибудь написать
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename({ suffix: '.min' }))
        // конечный путь выгрузки готового css (папку и файл css создает автоматически)
        .pipe(gulp.dest('app/css'))
        // чтобы проверять сайт на изменения но только после того как программа перевела 
        // файлы в css
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('script', function() {
    return gulp.src('app/js/**/*.js')
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }))
});

// адрес с инструкцией https://www.browsersync.io/docs/gulp
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "app"
        }
    })
});

// создать таск для slick-carousel и magnific-popup (задать путь к файлам, которые нужно сконкатинировать)
gulp.task('js', function() {
    // если два файла js то пишутся (['','']), если один то ('')
    return gulp.src(['node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
            'node_modules/slick-carousel/slick/slick.js', 'node_modules/mixitup/dist/mixitup.js'
        ])
        // провести конкатинацию этих файлов
        // дать название конечного файла в кавычках согласно инструкции https://www.npmjs.com/package/gulp-concat
        .pipe(concat('libs.min.js'))
        // сжать эти файлы
        .pipe(uglifyjs())
        // выгрузить сконкатинированные и сжатые файлы в папку
        .pipe(gulp.dest('app/js'))
});
// можно запустить данный таск через консоль чтобы посмотреть работает ли он: gulp js.
// После, в index.html задать адреса в script 


// для автоматеческого обновления в css
gulp.task('watch', function() {
    //  если в 'app/scss/**/*.scss' будут выполняться изменения то
    //  будет выполняться gulp.parallel('scss'), чтобы выполнялся 'browser-sync', 
    //  его можно дописать в конце
    gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'))
        // Чтобы таск watch следил и обновлял js
    gulp.watch('app/js/**/*.js', gulp.parallel('script'))
        // Чтобы таск watch следил и обновлял html
    gulp.watch('app/*.html', gulp.parallel('code'))
});


// для того чтобы запускалось несколько действий нужен таск по дефолту
// чтобы запустить этот таск достаточно прописать gulp
gulp.task('default', gulp.parallel('scss', 'browser-sync', 'watch'))