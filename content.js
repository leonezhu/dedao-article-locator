

(function() {
    'use strict';

    // 检查当前页面是否为文章详情页
    function isArticlePage() {
        return window.location.href.includes('/course/article?id=');
    }

    function scrollToActiveArticle() {
        let sidebar = document.querySelector(".course-schedule .ps.ps--active-y");
        if (!sidebar) return false;

        let activeItem = document.querySelector(".course-schedule li.active");
        if (activeItem) {
            // 先滚动到目标元素
            activeItem.scrollIntoView({ block: "center" });
            // 额外向下滚动一些距离确保完全可见
            setTimeout(() => {
                sidebar.scrollTop += 100;
            }, 100);
            console.log("找到 activeItem，停止滚动");
            return true;
        }
        return false;
    }

    function autoScrollSidebar() {
        // 如果不是文章页面，直接返回
        if (!isArticlePage()) {
            console.log('不是文章页面，停止执行');
            return;
        }

        let retryCount = 0;
        const maxRetries = 10;

        function tryScroll() {
            let sidebar = document.querySelector(".course-schedule .ps.ps--active-y");
            if (!sidebar) {
                if (retryCount < maxRetries) {
                    retryCount++;
                    console.log(`未找到侧边栏，${retryCount}秒后重试...`);
                    setTimeout(tryScroll, 1000);
                    return;
                }
                console.log("无法找到侧边栏，停止尝试");
                return;
            }

            let scrollStep = 600;
            let maxScrollAttempts = 300;
            let attempts = 0;

            let scrollInterval = setInterval(() => {
                if (scrollToActiveArticle()) {
                    clearInterval(scrollInterval);
                } else if (attempts >= maxScrollAttempts) {
                    console.log("达到最大滚动次数，停止");
                    clearInterval(scrollInterval);
                } else {
                    sidebar.scrollTop += scrollStep;
                    console.log(`滚动尝试 ${attempts + 1}`);
                    attempts++;
                }
            }, 300);
        }

        tryScroll();
    }

    window.addEventListener("load", function() {
        // 仅在文章页面执行
        if (isArticlePage()) {
            setTimeout(autoScrollSidebar, 1500);
        }
    });
})();
