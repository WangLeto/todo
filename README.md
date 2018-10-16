# Todo list

Try it on [this page](https://wangleto.github.io/todo/).

## About

> 兴趣使然。  
I make this page for fun.  

- To switch css file dynamically, I use a `<base href="/">` tag in the head, which leads to some mess when running the page in local, I suggest add ".." before "/" to solve it.  

- Additionally, Microsoft Edge seems not to support a local file page use `localStorage` API, so change to use Chrome or Firefox.

- I use [uncss](https://uncss-online.com/) to shrink bootstrap's size, however, some class dynamically binded by vue cannot be detected, so remember to add theme back to `bootstrap.min.uncss.css`.
