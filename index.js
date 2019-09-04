#!/usr/bin/env node

const program = require('commander');
const download = require('download-git-repo')
const handlebars = require('handlebars')
const inquirer = require('inquirer')
const fs = require('fs')
const ora = require('ora')
const chalk = require('chalk')

const templates = {
  'agent-tpl': {
    url: 'https://github.com/KaiWang2048/hm-agent-tpl',
    downloadUrl: 'KaiWang2048/hm-agent-tpl#master',
    description: '代理商后台管理系统模板'
  }
}
program
  .version('0.1.0')
program
  .command('init <template> <project>')
  .description('初始化模板')
  .action(function (templateName, templateProject) {
    const spinner = ora('downloding.....').start()
    const {
      downloadUrl
    } = templates[templateName]

    download(downloadUrl, templateProject, (err) => {
      if (err) {
        spinner.fail()
        return console.log('下载失败')
      }
      spinner.succeed()
      inquirer.prompt([{
          type: 'input',
          name: 'name',
          message: '请输入项目名称'
        },
        {
          type: 'input',
          name: 'description',
          message: '请输入项目简介'
        },
        {
          type: 'input',
          name: 'author',
          message: '请输入作者名称'
        }
      ]).then(answer => {
        const packageContent = fs.readFileSync(`${templateProject}/package.json`, 'utf8')
        const packageResult = handlebars.compile(packageContent)(answer)
        fs.writeFileSync(`${templateProject}/package.json`, packageResult)
        console.log(chalk.yellow('初始化成功'))
      })
    })
  })

program
  .command('list')
  .action(function (env) {
    for (key in templates) {
      console.log(`
      ${key} ${templates[key].description}`)
    }
  });

program.parse(process.argv);
