#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable sort-keys */
/**
 * Wechaty - Conversational RPA SDK for Chatbot Makers.
 *  - https://github.com/wechaty/wechaty
 */
// https://stackoverflow.com/a/42817956/1123955
// https://github.com/motdotla/dotenv/issues/89#issuecomment-587753552
import 'dotenv/config.js'

import {
  Contact,
  Message,
  ScanStatus,
  WechatyBuilder,
  log,
}                  from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
import { FileBox } from 'file-box'

function onScan (qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')
    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

    qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin (user: Contact) {
  log.info('StarterBot', '%s login', user)
}

function onLogout (user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage (msg: Message) {
  log.info('StarterBot', msg.toString())

  if (msg.talker().name() === 'Pawan' && msg.listener()?.name() !== 'Pawan') {
    return
  }

  console.log('MSG ************* : ', JSON.stringify(msg))
  // console.log('From ++++++++++++++++ : ', msg.from()?.name())
  console.log('Talker ++++++++++++++++ : ', msg.talker().name())
  // console.log('contact ++++++++++++++++ : ', (await msg.toContact()).name())

  if (msg.text().toLowerCase() === 'hi') {
    await msg.say(`Hello ${msg.talker().name()}, \nWelcome to Alpha.AI\n\nTo get the chart images, type the following.\n1. Waterfall \n2. Grouped \n3. Diff`)
  }

  if (msg.text().toLowerCase() === 'ding') {
    await msg.say('dong')
  }

  // if (msg.text().toLowerCase().includes('waterfall')) {
  //   await msg.say('dong')
  // }

  if (msg.text().toLowerCase() === 'image') {
    //  await fetch(
    //   'https://echarts-backend-beta.vercel.app/charts/data', {
    //     method:'POST',
    //     body: JSON.stringify(payload),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     // 'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //   })
    const imageURL = 'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg'
    await msg.say('Processing Image, Please wait for a moment...')

    const imageData = FileBox.fromUrl(imageURL)
    // const data = await fetch(
    //   'https://echarts-backend-beta.vercel.app/charts/generate/negative')
    // // console.log("imageData ******************* : ",imageData);
    // log.info('log message 88888888**************88', data)

    // await msg.say('imageURL')
    // console.log('imageData ******************* : ', imageData)

    await msg.say(imageData)
  } else if (msg.text().toLowerCase() === 'diff') {

    log.info('chart 1 ************** ', msg.toString())
    console.log('chart 1 +++++++++++++++++++++++++++++++++++++ : ', msg.toString())

    const imageURL = 'https://echarts-backend-beta.vercel.app/charts/generate/negative.jpg'
    await msg.say('Processing Image, Please wait for a moment...')

    const imageData = FileBox.fromUrl(imageURL)

    await msg.say(imageData)
  } else if (msg.text().toLowerCase() === 'waterfall') {

    const imageURL = 'https://echarts-backend-beta.vercel.app/charts/generate/waterfall.jpg'
    await msg.say('Processing Image, Please wait for a moment...')

    const imageData = FileBox.fromUrl(imageURL)

    await msg.say(imageData)
  } else if (msg.text().toLowerCase() === 'grouped') {
    // await fetch(
    //   'https://echarts-backend-beta.vercel.app/charts/data', {
    //     method:'POST',
    //     body: JSON.stringify(payload),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     // 'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //   })
    const imageURL = 'https://echarts-backend-beta.vercel.app/charts/generate/grouped.jpg'
    await msg.say('Processing Image, Please wait for a moment...')

    const imageData = FileBox.fromUrl(imageURL)
    await msg.say(imageData)
  }

}

const bot = WechatyBuilder.build({
  name: 'ding-dong-bot',
  /**
   * You can specific `puppet` and `puppetOptions` here with hard coding:
   *
  puppet: 'wechaty-puppet-wechat',
  puppetOptions: {
    uos: true,
  },
   */
  /**
   * How to set Wechaty Puppet Provider:
   *
   *  1. Specify a `puppet` option when instantiating Wechaty. (like `{ puppet: 'wechaty-puppet-whatsapp' }`, see below)
   *  1. Set the `WECHATY_PUPPET` environment variable to the puppet NPM module name. (like `wechaty-puppet-whatsapp`)
   *
   * You can use the following providers locally:
   *  - wechaty-puppet-wechat (web protocol, no token required)
   *  - wechaty-puppet-whatsapp (web protocol, no token required)
   *  - wechaty-puppet-padlocal (pad protocol, token required)
   *  - etc. see: <https://wechaty.js.org/docs/puppet-providers/>
   */
  // puppet: 'wechaty-puppet-whatsapp'

  /**
   * You can use wechaty puppet provider 'wechaty-puppet-service'
   *   which can connect to remote Wechaty Puppet Services
   *   for using more powerful protocol.
   * Learn more about services (and TOKEN) from https://wechaty.js.org/docs/puppet-services/
   */
  // puppet: 'wechaty-puppet-service'
  // puppetOptions: {
  //   token: 'xxx',
  // }
})

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))
