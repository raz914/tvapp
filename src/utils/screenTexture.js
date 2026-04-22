import * as THREE from 'three';

import { WEBPAGE_MESH_NAME } from '../constants/screen';

function drawRoundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawStatCard(context, x, y, width, height, title, value, color) {
  drawRoundedRect(context, x, y, width, height, 18);
  context.fillStyle = '#1d232b';
  context.fill();

  context.fillStyle = color;
  context.fillRect(x + 24, y + 24, 56, 8);

  context.fillStyle = '#a8b3c2';
  context.font = '20px Arial, sans-serif';
  context.fillText(title, x + 24, y + 62);

  context.fillStyle = '#f6f4ec';
  context.font = 'bold 38px Arial, sans-serif';
  context.fillText(value, x + 24, y + 110);
}

function drawTopBar(context, title) {
  context.fillStyle = '#10141a';
  context.fillRect(0, 0, 768, 74);

  context.fillStyle = '#d6f36b';
  context.font = 'bold 24px Arial, sans-serif';
  context.fillText('RETRO.TV', 28, 45);

  context.fillStyle = '#f6f4ec';
  context.font = 'bold 30px Arial, sans-serif';
  context.fillText(title, 242, 46);

  context.fillStyle = '#27303b';
  drawRoundedRect(context, 628, 18, 112, 36, 18);
  context.fill();
  context.fillStyle = '#d6f36b';
  context.font = '18px Arial, sans-serif';
  context.fillText('ONLINE', 650, 42);
}

function drawGreeting(context) {
  context.fillStyle = '#d6f36b';
  context.font = 'bold 42px Arial, sans-serif';
  context.fillText('hello Lawaris peeps', 36, 186);
}

function drawDashboardPage(context) {
  drawTopBar(context, 'System Dashboard');

  context.fillStyle = '#151a21';
  context.fillRect(0, 74, 768, 438);
  drawGreeting(context);

  drawStatCard(context, 28, 226, 214, 122, 'Signal', '98%', '#d6f36b');
  drawStatCard(context, 278, 226, 214, 122, 'Load', '42%', '#75d5ff');
  drawStatCard(context, 528, 226, 214, 122, 'Temp', '31C', '#ffbd66');

  context.fillStyle = '#222a35';
  drawRoundedRect(context, 28, 378, 462, 94, 18);
  context.fill();
  context.fillStyle = '#f6f4ec';
  context.font = 'bold 22px Arial, sans-serif';
  context.fillText('Traffic', 54, 414);

  const bars = [22, 38, 30, 52, 43, 66, 59, 75, 48, 63];
  bars.forEach((bar, index) => {
    context.fillStyle = index % 2 === 0 ? '#d6f36b' : '#75d5ff';
    context.fillRect(62 + index * 39, 456 - bar, 22, bar);
  });

  context.fillStyle = '#222a35';
  drawRoundedRect(context, 528, 378, 214, 94, 18);
  context.fill();
  context.fillStyle = '#f6f4ec';
  context.font = 'bold 22px Arial, sans-serif';
  context.fillText('Status', 554, 414);
  context.fillStyle = '#d6f36b';
  context.font = '18px Arial, sans-serif';
  context.fillText('All channels clear', 554, 448);
  context.fillStyle = '#a8b3c2';
  context.font = '15px Arial, sans-serif';
  context.fillText(WEBPAGE_MESH_NAME, 554, 468);
}

function drawMediaPage(context) {
  drawTopBar(context, 'Media Library');

  context.fillStyle = '#10131a';
  context.fillRect(0, 74, 768, 438);
  drawGreeting(context);

  const items = [
    ['Synthwave Set', '#d6f36b'],
    ['Night Drive', '#75d5ff'],
    ['CRT Calibration', '#ff7aa8'],
  ];

  items.forEach(([title, color], index) => {
    const x = 36 + index * 244;
    drawRoundedRect(context, x, 218, 204, 198, 18);
    context.fillStyle = '#232b36';
    context.fill();
    context.fillStyle = color;
    context.fillRect(x + 24, 246, 156, 82);
    context.fillStyle = '#10131a';
    context.beginPath();
    context.moveTo(x + 92, 268);
    context.lineTo(x + 92, 306);
    context.lineTo(x + 128, 287);
    context.closePath();
    context.fill();
    context.fillStyle = '#f6f4ec';
    context.font = 'bold 22px Arial, sans-serif';
    context.fillText(title, x + 24, 364, 156);
    context.fillStyle = '#a8b3c2';
    context.font = '18px Arial, sans-serif';
    context.fillText('Ready to play', x + 24, 394);
  });

  context.fillStyle = '#d6f36b';
  drawRoundedRect(context, 222, 440, 324, 44, 22);
  context.fill();
  context.fillStyle = '#10131a';
  context.font = 'bold 22px Arial, sans-serif';
  context.fillText('PLAY SELECTED', 294, 469);
}

function drawSettingsPage(context) {
  drawTopBar(context, 'Display Settings');

  context.fillStyle = '#181d24';
  context.fillRect(0, 74, 768, 438);
  drawGreeting(context);

  const rows = [
    ['Brightness', 0.78],
    ['Contrast', 0.64],
    ['Saturation', 0.52],
    ['Scanline Blend', 0.36],
  ];

  rows.forEach(([label, value], index) => {
    const y = 234 + index * 52;
    context.fillStyle = '#f6f4ec';
    context.font = 'bold 22px Arial, sans-serif';
    context.fillText(label, 74, y);
    context.fillStyle = '#333d4a';
    drawRoundedRect(context, 292, y - 26, 380, 22, 11);
    context.fill();
    context.fillStyle = '#d6f36b';
    drawRoundedRect(context, 292, y - 26, 380 * value, 22, 11);
    context.fill();
  });

  context.fillStyle = '#222a35';
  drawRoundedRect(context, 74, 436, 620, 48, 14);
  context.fill();
  context.fillStyle = '#a8b3c2';
  context.font = '20px Arial, sans-serif';
  context.fillText('Screen UI is generated with Three.js CanvasTexture', 104, 468);
}

export function drawTestWebAppTexture(canvas, page) {
  const context = canvas.getContext('2d');

  context.clearRect(0, 0, canvas.width, canvas.height);

  if (page === 'media') {
    drawMediaPage(context);
    return;
  }

  if (page === 'settings') {
    drawSettingsPage(context);
    return;
  }

  drawDashboardPage(context);
}

export function applyTextureTransform(texture, transform) {
  texture.center.set(0.5, 0.5);
  texture.rotation = THREE.MathUtils.degToRad(transform.rotation);
  texture.repeat.set(transform.repeatX, transform.repeatY);
  texture.offset.set(transform.offsetX, transform.offsetY);
  texture.needsUpdate = true;
}
