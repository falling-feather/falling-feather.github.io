---
title: 欢迎你们
date: 2025-12-23 00:00:00
permalink: /2025/12/22/welcome-you/
description: 这是我的小小博客，欢迎大家来玩喵。
gitalk_id: welcome-you-2025-12-23
tags:
  - 欢迎
categories:
  - 生活
banner_img: /img/bg4.jpg
banner_img_height: 100
banner_mask_alpha: 0.3
---

<style>
.welcome-container {
  text-align: center;
  padding: 60px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.welcome-title {
  font-size: 3.5em;
  font-weight: bold;
  margin-bottom: 40px;
  color: #fff;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  animation: fadeInDown 1s ease-out;
}

.welcome-content {
  font-size: 1.8em;
  line-height: 2;
  color: #fff;
  text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.5);
  margin-bottom: 30px;
  animation: fadeInUp 1.2s ease-out;
}

.welcome-heart {
  font-size: 2em;
  color: #ff6b9d;
  display: inline-block;
  animation: heartbeat 1.5s ease-in-out infinite;
  margin: 0 10px;
}

.welcome-encourage {
  font-size: 1.6em;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
  margin-top: 40px;
  animation: fadeInUp 1.5s ease-out;
  letter-spacing: 2px;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 2.5em;
  }
  
  .welcome-content {
    font-size: 1.4em;
  }
  
  .welcome-encourage {
    font-size: 1.3em;
  }
}
</style>

<div class="welcome-container">
  <h1 class="welcome-title">欢迎你们</h1>
  
  <p class="welcome-content">
    这是我的小小博客，欢迎大家来玩喵。
  </p>
  
  <p class="welcome-content">
    我喜欢你们<span class="welcome-heart">❤️</span>
  </p>
  
  <p class="welcome-encourage">
    期末加油！
  </p>
</div>

