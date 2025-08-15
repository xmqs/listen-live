#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');
const path = require('path');

const ffplayPath = path.join(__dirname, './ffplay/ffplay.exe');
const baseUrl = 'https://live.iill.top/';

// Platform 选项
const platforms = ['douyu', 'huya'];
let platformIndex = 0;

// 创建 readline 接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

// 第一步：选择 Platform
function renderPlatformMenu() {
    console.clear();
    console.log('使用 ↑ ↓ 选择平台，按 Enter 确认\n');

    platforms.forEach((p, i) => {
        if (i === platformIndex) {
            console.log(`> ${p}`);
        } else {
            console.log(`  ${p}`);
        }
    });
}

renderPlatformMenu();

process.stdin.on('keypress', (str, key) => {
    console.clear()
    if (key.name === 'up') {
        platformIndex = (platformIndex - 1 + platforms.length) % platforms.length;
    } else if (key.name === 'down') {
        platformIndex = (platformIndex + 1) % platforms.length;
    } else if (key.name === 'return') {
        // 用户确认 Platform 选择，进入输入阶段
        process.stdin.setRawMode(false);
        rl.question('room: ', (input) => {
            const finalUrl = `${baseUrl}/${platforms[platformIndex]}/${encodeURIComponent(input)}`;

            const ffplay = spawn(ffplayPath, [
                finalUrl,
                '-vn',
                '-nodisp'
            ], { stdio: 'ignore' });

            ffplay.on('close', (code) => {
                console.log(`直播流可能存在问题， ${code}`);
                rl.close();
                process.exit();
            });
        });
    } else if (key.ctrl && key.name === 'c') {
        rl.close();
        process.exit();
    }
});
