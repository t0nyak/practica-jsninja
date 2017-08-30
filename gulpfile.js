var gulp = require("gulp"); // importamos la librería gulp
var sass = require("gulp-sass");
var notify = require("gulp-notify");
var browserSync = require("browser-sync").create();
var gulpImport = require("gulp-html-import");
var tap = require("gulp-tap");
var browserify = require("browserify");
var buffer = require("gulp-buffer");
var sourcemaps = require("gulp-sourcemaps");
var htmlmin = require("gulp-htmlmin");
var uglify = require("gulp-uglify");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var responsive = require("gulp-responsive");
var imagemin = require("gulp-imagemin");

// definimos la tarea por defecto
gulp.task("default", ["html", "imgs", "sass", "js", "imgs"], function(){

    // iniciamos el servidor de desarrollo
    browserSync.init({ proxy: "http://127.0.0.1:3101/", browser: "google-chrome" });

    // observa cambios en los archivos SASS, y entonces ejecuta la tarea 'sass'
    gulp.watch(["src/scss/*.scss", "src/scss/**/*.scss"], ["sass"]);

    // observa cambios en los archivos HTML y entonces recarga el navegador
    gulp.watch(["src/*.html", "src/**/*.html"], ["html"]);

    // observa cambios en los archivos gráficos y entonces recarga el navegador
    gulp.watch(["src/imgs/*.jpg", "src/imgs/*.jpeg", "src/imgs/*.png", "src/imgs/*.gif"], ["imgs"]);
    
    // observa cambios en los archivos JS y entonces compila el JS de nuevo
    gulp.watch(["src/js/*.js", "src/js/**/*.js"], ["js"]);
});

// compilar sass
gulp.task("sass", function(){
    gulp.src("src/scss/style.scss") // cargamos el archivo style.scss
        .pipe(sass().on("error", function(error){ // lo compilamos con gulp-sass
            return notify().write(error); // si ocurre un error, mostramos una notificación
        }))
         .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("dist/")) // guardamos el resultado en la carpeta css
        .pipe(browserSync.stream()) // recargue el CSS del navegador
        .pipe(notify("SASS Compilado 🤘")) // muestra notifiación en pantalla
});

// copiar e importar html
gulp.task("html", function(){
    gulp.src("src/*.html")
        .pipe(gulpImport("src/components/"))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("dist/"))
        .pipe(browserSync.stream())
        .pipe(notify("HTML importado"));
});

// compilar y generar un único javascript
gulp.task("js", function () {
    gulp.src("src/js/main.js")
        .pipe(tap(function (file) { // tap nos permite ejecutar una función por cada fichero seleccionado en gulp.src()
            // reemplazamos el contenido del fichero por lo que nos devuelve browserify pasándole el fichero
            file.contents = browserify(file.path, {debug: true}) // creamos una instancia de browserify en base al archivo
                            .transform("babelify", {presets: ["es2015"]}) // traduce el código de ES6 a ES5
                            .bundle() // compilamos el archivo
                            .on("error", function (err) { // en caso de error mostramos notification
                                return notify().write(err);
                            });
        }))
        .pipe(buffer()) // convertimos a buffer para que funcione el siguiente pipe
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("dist/")) // lo guardamos en la carpeta dist
        .pipe(browserSync.stream()) // recargamos el navegador
        .pipe(notify("JS Compilado"));
});

// tarea que optimiza y crea las imágenes responsive
gulp.task("imgs", function(){
    gulp.src("src/imgs/*")
        .pipe(responsive({ // generamos las versiones responsive
            'article*': [
                { width: 400, rename: { suffix: "-400px"}},
                { width: 750, rename: { suffix: "-750px"}},
                { width: '100%' }
            ],
            'avatar*': [
                { width: 100, rename: { suffix: "-100px"}},
                { width: '100%' }
            ]
        }))
        .pipe(imagemin()) // optimizamos el peso de las imágenes
        .pipe(gulp.dest("dist/imgs/"))
});