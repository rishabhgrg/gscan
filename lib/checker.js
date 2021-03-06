const Promise = require('bluebird');
const _ = require('lodash');
const requireDir = require('require-dir');
const readTheme = require('./read-theme');
const versions = require('./utils').versions;

const checks = requireDir('./checks');

/**
 * Check theme
 *
 * Takes a theme path, reads the theme, and checks it for issues.
 * Returns a theme object.
 * @param themePath
 * @param options
 * @returns {Object}
 */
const checker = function checkAll(themePath, options) {
    options = options || {};

    const passedVersion = _.get(options, 'checkVersion', versions.default);
    let version = passedVersion;

    if (passedVersion === 'v4') {
        version = 'canary';
    }

    return readTheme(themePath)
        .then(function (theme) {
            // set the major version to check
            theme.checkedVersion = versions[version].major;

            return Promise.reduce(_.values(checks), function (theme, check) {
                return check(theme, options, themePath);
            }, theme);
        });
};

module.exports = checker;
