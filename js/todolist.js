const TODO_KEY = 'todo_storage';
const DONE_KEY = 'done_storage';
const THEME_STORE = {
  key: 'theme_storage',
  items: ['light', 'dark']
};
let currentTheme = 0;

const get = function (key) {
  let value = localStorage.getItem(key);
  if (value !== null) {
    return JSON.parse(value);
  } else {
    return [];
  }
};

const set = function (key, value) {
  let str = JSON.stringify(value);
  localStorage.setItem(key, str);
};

const switchTheme = function (index) {
  let obj = document.getElementById('theme-css');
  obj.setAttribute('href', 'todo/css/' + THEME_STORE.items[index] + '.css');
  document.getElementById('theme-color').setAttribute('content', index == 0 ? '#42b983' : '#000000');
  set(THEME_STORE.key, index);
  currentTheme = index;
}

let app = new Vue({
  el: '#app',
  data: {
    message: '',
    todo: [],
    done: [],
    currentTheme: 0
  },
  methods: {
    submit: function () {
      if (!!this.message) {
        if (!this.message.trim()) {
          this.message = '';
          this.$ref.input.$el.focus();
          return;
        }
        this.todo.splice(0, 0, this.message);
        set(TODO_KEY, this.todo);
        this.message = '';
      }
    },
    switchTheme: function () {
      this.currentTheme = parseInt(currentTheme) == 1 ? 0 : 1;
      switchTheme(this.currentTheme);
    },
    delTodo: function (index) {
      let deleted = this.todo.splice(index, 1);
      set(TODO_KEY, this.todo);
      return deleted[0];
    },
    todoDone: function (index) {
      this.done.splice(0, 0, this.delTodo(index));
      set(DONE_KEY, this.done);
    },
    delDone: function (index) {
      let deleted = this.done.splice(index, 1);
      set(DONE_KEY, this.done);
      return deleted[0];
    },
    doneTodo: function (index) {
      this.todo.push(this.delDone(index));
      set(TODO_KEY, this.todo);
    }
  },
  created: function () {
    this.todo = get(TODO_KEY);
    this.done = get(DONE_KEY);

    let currentTheme = localStorage.getItem(THEME_STORE.key);
    if (currentTheme === null) {
      currentTheme = 0;
    }
    this.currentTheme = currentTheme;
    switchTheme(parseInt(currentTheme));
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('todo/sw.js', {  
        scope: 'todo/'
      })
      .then(function (registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(function (err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}