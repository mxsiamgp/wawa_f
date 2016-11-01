'use strict';

import _ from 'lodash';
import clean from 'gulp-clean';
import config from 'config';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import gulpUtil from 'gulp-util';
import htmlmin from 'gulp-htmlmin';
import preprocess from 'gulp-preprocess';
import qiniu from 'gulp-qiniu';
import runSequence from 'run-sequence';
import serve from 'gulp-serve';
import webpack from 'webpack';

const WEBPACK_ENTRY_MODULES = [
    'pc',
    'wechat'
];

gulp.task('clean', () => {
    return gulp.src('./build')
        .pipe(clean());
});

// Vue源文件不支持预处理
gulp.task('preprocess-html-css-js', () => {
    return gulp.src(_.map(['html', 'css', 'js'], (ext) => {
        return `./src/**/*.${ext}`;
    }))
        .pipe(preprocess({
            context: {
                config
            }
        }))
        .pipe(gulp.dest('./build/preprocess'));
});

gulp.task('preprocess-other', () => {
    return gulp.src(_.map(['vue', 'woff', 'woff2', 'ttf', 'eot', 'svg'], (ext) => {
        return `./src/**/*.${ext}`;
    }))
        .pipe(gulp.dest('./build/preprocess'));
});

gulp.task('minify-html', () => {
    return gulp.src(['./build/preprocess/**/*.html'])
        .pipe(gulpIf(config.get('isCompress'), htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('./build/dist'));
});

gulp.task('webpack', (cb) => {
    webpack({
        entry: _.assign({}, ..._.map(WEBPACK_ENTRY_MODULES, (mod) => {
            const e = {};
            e[mod] = `./build/preprocess/module/${mod}/js/entry.js`;
            return e;
        })),
        output: {
            path: './build/dist/module',
            filename: "[name]/js/entry.js"
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components|vendor)/,
                    loader: 'babel',
                    query: {
                        presets: ['es2015']
                    }
                },
                { test: /\.css$/, loader: 'style!css' },
                { test: /\.(woff(2)?|ttf|eot|svg)(\?.+)?$/, loader: 'base64-font-loader' },
                { test: /\.vue$/, loader: 'vue' },
                { test: /\.json$/, loader: 'json' }
            ]
        },
        plugins: _.flatten([
            new webpack.ProvidePlugin({
                'jQuery': 'jquery',
                'window.jQuery': 'jquery'
            }),
            _.cond([
                [_.matches({ 'isCompress': true }), _.constant([ new webpack.optimize.UglifyJsPlugin() ])],
                [_.stubTrue, _.constant([])]
            ])(config)
        ])
    }, (err) => {
        if(err) throw new gulpUtil.PluginError("webpack", err);
        cb();
    });
});

gulp.task('build', (cb) => {
    runSequence('preprocess-html-css-js', 'preprocess-other', 'minify-html', 'webpack', cb);
});

gulp.task('rebuild', (cb) => {
    runSequence('clean', 'build', cb);
});

gulp.task('serve', serve({
    root: './build/dist',
    port: config.get('serve.port')
}));

gulp.task('upload', () => {
    return gulp.src('./build/dist/**')
        .pipe(qiniu(config.get('upload.qiniu'), {
            concurrent: 128
        }));
});

gulp.task('rebuild-serve', (cb) => {
    runSequence('rebuild', 'serve', cb);
});

gulp.task('rebuild-upload', (cb) => {
    runSequence('rebuild', 'upload', cb);
});
