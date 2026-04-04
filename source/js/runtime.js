// 网站运行时间统计
(function()
{
    // 开始时间：2025年12月22日 0:00:00
    var startTime = new Date('2025-12-22T00:00:00+08:00').getTime();

    function updateRuntime()
    {
        var now = new Date().getTime();
        var diff = now - startTime;

        // 计算天数、小时、分钟、秒
        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // 格式化显示
        var runtimeText = '本站已在随时准备跑路的状态下以极其不稳定的方式运行了 ' +
                         days + '天' + hours + '小时' + minutes + '分' + seconds + '秒';

        // 查找运行时间显示元素
        var runtimeElement = document.getElementById('site-runtime');
        if (runtimeElement)
        {
            runtimeElement.textContent = runtimeText;
        }
    }

    // 页面加载完成后立即更新一次
    if (document.readyState === 'loading')
    {
        document.addEventListener('DOMContentLoaded', function()
        {
            updateRuntime();
            // 每秒更新一次
            setInterval(updateRuntime, 1000);
        });
    }
    else
    {
        updateRuntime();
        // 每秒更新一次
        setInterval(updateRuntime, 1000);
    }
})();
