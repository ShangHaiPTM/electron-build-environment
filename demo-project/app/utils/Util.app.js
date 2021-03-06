import childProcess from 'child_process';
import Promise from 'bluebird';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import http from 'http';
import electron from 'electron';

const remote = electron.remote;
const dialog = remote.dialog;
const app = remote.app;

module.exports = {
  native: null,
  execFile(args, options) {
    return new Promise((resolve, reject) => {
      childProcess.execFile(args[0], args.slice(1), options, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  },
  exec(args, options) {
    return new Promise((resolve, reject) => {
      childProcess.exec(args, options, (error, stdout) => {
        if (error) {
          reject(new Error(`Encountered an error: ${error}`));
        } else {
          resolve(stdout);
        }
      });
    });
  },
  isWindows() {
    return process.platform === 'win32';
  },
  isLinux() {
    return process.platform === 'linux';
  },
  isNative() {
    switch (localStorage.getItem('settings.useVM')) {
      case 'true':
        this.native = false;
        break;
      case 'false':
        this.native = true;
        break;
      default:
        this.native = null;
    }
    if (this.native === null) {
      if (this.isWindows()) {
        this.native = http.get({
          url: 'http:////./pipe/docker_engine/version'
        }, (response) => {
          if (response.statusCode !== 200) {
            return false;
          }
          return true;
        });
      } else {
        try {
          // Check if file exists
          const stats = fs.statSync('/var/run/docker.sock');
          if (stats.isSocket()) {
            this.native = true;
          }
        } catch (e) {
          if (this.isLinux()) {
            this.native = true;
          } else {
            this.native = false;
          }
        }
      }
    }
    return this.native;
  },
  binsPath() {
    return this.isWindows()
      ? path.join(this.home(), 'Kitematic-bins')
      : path.join('/usr/local/bin');
  },
  binsEnding() {
    return this.isWindows() ? '.exe' : '';
  },
  dockerBinPath() {
    return path.join(this.binsPath(), `docker${this.binsEnding()}`);
  },
  dockerMachineBinPath() {
    return path.join(this.binsPath(), `docker-machine${this.binsEnding()}`);
  },
  dockerComposeBinPath() {
    return path.join(this.binsPath(), `docker-compose${this.binsEnding()}`);
  },
  escapePath(str) {
    return str.replace(/ /g, '\\ ').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  },
  home() {
    return app.getPath('home');
  },
  documents() {
    // TODO: fix me for windows 7
    return 'Documents';
  },
  CommandOrCtrl() {
    return (this.isWindows() || this.isLinux()) ? 'Ctrl' : 'Command';
  },
  removeSensitiveData(str) {
    if (!str || str.length === 0 || typeof str !== 'string') {
      return str;
    }
    return str.replace(/-----BEGIN CERTIFICATE-----.*-----END CERTIFICATE-----/mg, '<redacted>')
      .replace(/-----BEGIN RSA PRIVATE KEY-----.*-----END RSA PRIVATE KEY-----/mg, '<redacted>')
      .replace(/\/Users\/[^/]*\//mg, '/Users/<redacted>/')
      .replace(/\\Users\\[^/]*\\/mg, '\\Users\\<redacted>\\');
  },
  packagejson() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  },
  settingsjson() {
    let settingsJson = {};
    try {
      settingsJson = JSON.parse(fs.readFileSync(
        path.join(__dirname, '../settings.json'),
        'utf8'
      ));
    } catch (err) {
      // log errors
    }
    return settingsJson;
  },
  isOfficialRepo(name) {
    if (!name || !name.length) {
      return false;
    }

    // An official repo is alphanumeric characters separated by dashes or
    // underscores.
    // Examples: myrepo, my-docker-repo, my_docker_repo
    // Non-examples: mynamespace/myrepo, my%!repo
    const repoRegexp = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
    return repoRegexp.test(name);
  },
  compareVersions(v1, v2, options) {
    const lexicographical = options && options.lexicographical;
    const zeroExtend = options && options.zeroExtend;
    let v1parts = v1.split('.');
    let v2parts = v2.split('.');

    function isValidPart(x) {
      return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
      return NaN;
    }

    if (zeroExtend) {
      while (v1parts.length < v2parts.length) {
        v1parts.push('0');
      }
      while (v2parts.length < v1parts.length) {
        v2parts.push('0');
      }
    }

    if (!lexicographical) {
      v1parts = v1parts.map(Number);
      v2parts = v2parts.map(Number);
    }

    for (let i = 0; i < v1parts.length; ++i) {
      if (v2parts.length === i) {
        return 1;
      }
      if (v1parts[i] > v2parts[i]) {
        return 1;
      } else if (v1parts[i] < v2parts[i]) {
        return -1;
      }
    }

    if (v1parts.length !== v2parts.length) {
      return -1;
    }

    return 0;
  },
  randomId() {
    return crypto.randomBytes(32).toString('hex');
  },
  windowsToLinuxPath(windowsAbsPath) {
    let fullPath = windowsAbsPath.replace(':', '').split(path.sep).join('/');
    if (fullPath.charAt(0) !== '/') {
      fullPath = `/${fullPath.charAt(0).toLowerCase()}${fullPath.substring(1)}`;
    }
    return fullPath;
  },
  linuxToWindowsPath(linuxAbsPath) {
    return linuxAbsPath.replace('/c', 'C:').split('/').join('\\');
  },
  linuxTerminal() {
    if (fs.existsSync('/usr/bin/x-terminal-emulator')) {
      return ['/usr/bin/x-terminal-emulator', '-e'];
    }
    dialog.showMessageBox({
      type: 'warning',
      buttons: ['OK'],
      // eslint-disable-next-line max-len
      message: 'The symbolic link /usr/bin/x-terminal-emulator does not exist. Please read the Wiki at https://github.com/docker/kitematic/wiki/Early-Linux-Support for more information.'
    });
    return false;
  },
  webPorts: ['80', '8000', '8080', '8888', '3000', '5000', '2368', '9200', '8983']
};
