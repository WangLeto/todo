const VERSION = '1.6';

// 监听 service worker 的 install 事件
this.addEventListener('install', function (event) {
    // 如果监听到了 service worker 已经安装成功的话，就会调用 event.waitUntil 回调函数
    event.waitUntil(
        // 安装成功后操作 CacheStorage 缓存，使用之前需要先通过 caches.open() 打开对应缓存空间。
        caches.open(VERSION).then(function (cache) {
            // 通过 cache 缓存对象的 addAll 方法添加 precache 缓存
            return cache.addAll([
                '/todo/index.html',
                '/todo/asset/moon.png',
                '/todo/asset/favicon.ico',
                '/todo/css/bootstrap.min.uncss.css',
                '/todo/css/dark.css',
                '/todo/css/light.css',
                '/todo/css/todolist.css',
                '/todo/js/todolist.js',
            ]);
        })
    );
});

// 缓存更新
self.addEventListener('activate', function (event) {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then(function (cacheList) {
                return Promise.all(
                    cacheList.map(function (cacheName) {
                        if (cacheName !== VERSION) {
                            return caches.delete(cacheName);
                        }
                    })
                )
            })
        ])
    );
});

// 捕获请求并返回缓存数据，或重新获取数据
self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request).then(function (response) {
        // 已有缓存
        if (response) {
            return response;
        }
        let request = event.request.clone();
        // 需要自行获取
        return fetch(request).then(function (httpRes) {
            // 获取失败
            if (!httpRes || httpRes.status !== 200) {
                return httpRes;
            }
            // 请求成功，进行本地保存
            let resClone = httpRes.clone();
            caches.open(VERSION).then(function (cache) {
                cache.put(request, resClone);
            })
            return httpRes;
        })
    }));
});