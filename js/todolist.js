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

const set = function (key, items) {
  let arr = items.map(e => e.text);
  let str = JSON.stringify(arr);
  localStorage.setItem(key, str);
};

const switchTheme = function (index) {
  let obj = document.getElementById('theme-css');
  obj.setAttribute('href', 'todo/css/' + THEME_STORE.items[index] + '.css');
  document.getElementById('theme-color').setAttribute('content', index == 0 ? '#42b983' : '#000000');
  localStorage.setItem(THEME_STORE.key, index);
  currentTheme = index;
};

let UID = 0;

let app = new Vue({
  el: '#app',
  data: {
    message: '',
    todo: [],
    done: [],
    currentTheme: 0,
    pressingCtrl: false,
    imageLoadFail: false
  },
  methods: {
    submit: function () {
      let message = this.message;
      this.message = '';
      if (!!message) {
        if (!message.trim()) {
          this.$refs.input.focus()
          return;
        }
        this.todo.splice(0, 0, {
          uid: UID++,
          text: message
        });
        set(TODO_KEY, this.todo);
      }
    },
    search: function () {
      let message = this.message;
      this.message = '';
      if (!!message) {
        if (!message.trim()) {
          this.$refs.input.focus()
          return;
        }
        window.location.replace("https://www.google.com/search?q=" + encodeURIComponent(message));
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
    let todo = get(TODO_KEY);
    todo.forEach(e => {
      this.todo.push({
        uid: UID++,
        text: e
      });
    });
    let done = get(DONE_KEY);
    done.forEach(e => {
      this.done.push({
        uid: UID++,
        text: e
      });
    });

    let currentTheme = localStorage.getItem(THEME_STORE.key);
    if (currentTheme === null) {
      currentTheme = 0;
    }
    this.currentTheme = currentTheme;
    switchTheme(parseInt(currentTheme));
  },
  mounted: function () {
    this.$nextTick(function () {
      this.$refs.input.focus();
    });
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('todo/sw.js', {
      scope: 'todo/'
    });
  });
}