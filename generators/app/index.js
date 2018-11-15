'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the wonderful ${chalk.red('generator-klay-dapp')} generator!`)
    );

    const prompts = [
      {
        type: 'list',
        name: 'someAnswer',
        choices: ['React'],
        message: 'Choose frontend framework for creating klaytn-based app skeleton.',
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copy(this.templatePath('src'), this.destinationPath('src'))
    this.fs.copy(this.templatePath('public'), this.destinationPath('public'))
    this.fs.copy(this.templatePath('config'), this.destinationPath('config'))
    this.fs.copy(this.templatePath('static'), this.destinationPath('static'))
    this.fs.copy(this.templatePath('migrations'), this.destinationPath('migrations'))
    this.fs.copy(this.templatePath('contracts'), this.destinationPath('contracts'))
    this.fs.copy(this.templatePath('package.json'), this.destinationPath('package.json'))
    this.fs.copy(this.templatePath('.babelrc'), this.destinationPath('.babelrc'))
    this.fs.copy(this.templatePath('.eslintrc'), this.destinationPath('.eslintrc'))
    this.fs.copy(this.templatePath('webpack.config.js'), this.destinationPath('webpack.config.js'))
    this.fs.copy(this.templatePath('webpack.prod.config.js'), this.destinationPath('webpack.prod.config.js'))
    this.fs.copy(this.templatePath('frontserver.js'), this.destinationPath('frontserver.js'))
    this.fs.copy(this.templatePath('frontserver.local.js'), this.destinationPath('frontserver.local.js'))
    this.fs.copy(this.templatePath('frontserver.real.js'), this.destinationPath('frontserver.real.js'))
    this.fs.copy(this.templatePath('deployedAddress'), this.destinationPath('deployedAddress'))
    this.fs.copy(this.templatePath('deployedABI'), this.destinationPath('deployedABI'))
    this.fs.copy(this.templatePath('truffle.js'), this.destinationPath('truffle.js'))
  }

  install() {
    this.installDependencies();
  }
};
