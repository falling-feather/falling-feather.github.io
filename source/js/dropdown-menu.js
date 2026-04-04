// 下拉菜单功能
(function()
{
    'use strict';

    // 下拉菜单配置
    const dropdownConfig = {
        'tools': {
            name: '妙妙工具',
            items: [
                { name: '知识科普', link: 'https://falling-feather.github.io/Logic-Physicochemical-Laboratory' }
            ]
        },
        'features': {
            name: '有趣功能',
            items: [
                { name: '卫戍协议', link: 'https://falling-feather.github.io/Stronghold-Protocol/' },
                { name: '反诈游戏', link: 'https://falling-feather.github.io/fanzhagame/' },
                { name: '魔术计算器', link: 'https://falling-feather.github.io/Magic-Calculator-for-the-2026-Spring-Festival-Gala/' }
            ]
        }
    };

    // 等待DOM加载完成
    function initDropdownMenus()
    {
        // 多次尝试，确保导航栏已渲染
        let attempts = 0;
        const maxAttempts = 15;

        function tryInit()
        {
            attempts++;

            // 查找导航栏菜单容器 - 使用更精确的选择器
            let navbarMenu = document.querySelector('#navbarSupportedContent .navbar-nav') ||
                           document.querySelector('.navbar-collapse .navbar-nav') ||
                           document.querySelector('.navbar-nav') ||
                           document.querySelector('.navbar-menu') ||
                           document.querySelector('nav ul') ||
                           document.querySelector('#navbarSupportedContent ul');

            if (!navbarMenu)
            {
                if (attempts < maxAttempts)
                {
                    setTimeout(tryInit, 150);
                    return;
                }
                else
                {
                    console.warn('[Dropdown Menu] 导航栏菜单未找到，尝试次数:', attempts);
                    return;
                }
            }

            // 为每个配置的下拉菜单创建HTML结构
            Object.keys(dropdownConfig).forEach(function(key)
            {
                const config = dropdownConfig[key];

                // 查找对应的菜单项
                let targetItem = null;
                const allNavItems = Array.from(navbarMenu.querySelectorAll('li.nav-item'));

                // 通过文本内容匹配
                allNavItems.forEach(function(item)
                {
                    const link = item.querySelector('a');
                    if (link)
                    {
                        const span = link.querySelector('span');
                        const text = span ? span.textContent.trim() : link.textContent.trim();
                        if (text === config.name)
                        {
                            targetItem = item;
                        }
                    }
                });

                if (!targetItem)
                {
                    console.warn('[Dropdown Menu] 未找到菜单项:', config.name);
                    return;
                }

                // 添加dropdown类
                targetItem.classList.add('dropdown');

                // 检查是否已经创建了下拉菜单
                const existingMenu = targetItem.querySelector('.dropdown-menu');
                if (existingMenu)
                {
                    // 如果已存在，先移除旧的
                    existingMenu.remove();
                }

                // 创建下拉菜单
                const dropdownMenu = document.createElement('ul');
                dropdownMenu.className = 'dropdown-menu';
                dropdownMenu.setAttribute('role', 'menu');

                config.items.forEach(function(item)
                {
                    const li = document.createElement('li');
                    li.setAttribute('role', 'menuitem');
                    const a = document.createElement('a');
                    a.href = item.link;
                    a.textContent = item.name;
                    a.className = 'dropdown-item';
                    // 只有外部链接才在新窗口打开
                    if (item.link.startsWith('http'))
                    {
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                    }
                    else
                    {
                        a.target = '_self';
                    }
                    li.appendChild(a);
                    dropdownMenu.appendChild(li);
                });

                targetItem.appendChild(dropdownMenu);
            });

            // 初始化下拉菜单交互
            const dropdownItems = document.querySelectorAll('.dropdown');

            dropdownItems.forEach(function(item)
            {
                const menuLink = item.querySelector('a');
                const dropdownMenu = item.querySelector('.dropdown-menu');

                if (!menuLink || !dropdownMenu) return;

                let hideTimeout = null;

                // 显示下拉菜单
                function showMenu()
                {
                    if (hideTimeout)
                    {
                        clearTimeout(hideTimeout);
                        hideTimeout = null;
                    }
                    dropdownMenu.style.display = 'block';
                    item.classList.add('active');
                }

                // 隐藏下拉菜单（带延迟，让用户有时间移动鼠标）
                function hideMenu()
                {
                    hideTimeout = setTimeout(function()
                    {
                        dropdownMenu.style.display = 'none';
                        item.classList.remove('active');
                    }, 150);
                }

                // 取消隐藏
                function cancelHide()
                {
                    if (hideTimeout)
                    {
                        clearTimeout(hideTimeout);
                        hideTimeout = null;
                    }
                }

                // 菜单项鼠标进入
                item.addEventListener('mouseenter', showMenu);

                // 菜单项鼠标离开
                item.addEventListener('mouseleave', hideMenu);

                // 下拉菜单鼠标进入
                dropdownMenu.addEventListener('mouseenter', cancelHide);
                dropdownMenu.addEventListener('mouseenter', showMenu);

                // 下拉菜单鼠标离开
                dropdownMenu.addEventListener('mouseleave', hideMenu);

                // 点击菜单项时阻止默认行为
                menuLink.addEventListener('click', function(e)
                {
                    if (menuLink.getAttribute('href') === 'javascript:void(0)')
                    {
                        e.preventDefault();
                    }
                });
            });
        }

        // 开始尝试初始化
        tryInit();
    }

    // DOM加载完成后初始化
    if (document.readyState === 'loading')
    {
        document.addEventListener('DOMContentLoaded', initDropdownMenus);
    }
    else
    {
        // DOM已经加载完成
        setTimeout(initDropdownMenus, 100);
    }

    // 也监听页面完全加载后再次尝试（处理动态加载的情况）
    window.addEventListener('load', function()
    {
        setTimeout(initDropdownMenus, 300);
    });
})();
