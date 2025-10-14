var gulp = require('gulp'),
  server = require('gulp-server-livereload'),
  del = require('del'); // Ensure del is installed as ^5.0.0

// Define your output directory
const outputDir = 'dist';

// Task to clean the output directory
// This task returns a promise, which Gulp 3.x can handle to know when it's complete.
gulp.task('clean', function() {
  console.log('Cleaning ' + outputDir + ' directory...');
  return del([outputDir]);
});

// Task to copy all static assets to the output directory
gulp.task('copy-assets', function() {
  console.log('Copying assets to ' + outputDir + ' directory...');
  return gulp.src([
      './data/**/*',
      './images/**/*',
      './styles/**/*',
      './scripts/**/*',
      './views/**/*', // <--- ADDED THIS LINE TO INCLUDE THE 'views' DIRECTORY
      './index.html',
      './favicon.ico',
      // Add any other static files you need to deploy
      // './LICENSE',
      // './README.md' // Be careful with README.md if it's large or not meant for web
    ], { base: '.' }) // 'base: .' preserves the directory structure
    .pipe(gulp.dest(outputDir));
});

// The new 'build' task: cleans the old build, then copies assets
// In Gulp 3.x, if you have multiple tasks that need to run sequentially,
// you list the first task as a dependency, and then call the next task
// within the callback function, ensuring completion.
gulp.task('build', ['clean'], function() {
  // After 'clean' is done, start 'copy-assets'.
  // We return the stream from 'copy-assets' so Gulp knows when 'build' is complete.
  console.log('Starting build process: clean -> copy-assets');
  return gulp.start('copy-assets');
});


// Your existing 'serve' task for local development
gulp.task('serve', function() {
  console.log('Starting local development server...');
  gulp.src('.') // Serves from the project root for local development
    .pipe(server({
      livereload: true,
      open: true,
      filter: function (filename, cb) {
        // Corrected: use 'filename' not 'filePath'
        cb( !(/.git|node_modules/.test(filename)) );
      }
    }));
});

// The default task for local development (still starts the server)
gulp.task('default', ['serve']);
