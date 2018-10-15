const TODO_KEY = 'todo_storage';
const DONE_KEY = 'done_storage';

const get = function (key) {
  let value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  } else {
    return [];
  }
};

const set = function (key, value) {
  let str = JSON.stringify(value);
  localStorage.setItem(key, str);
};

let app = new Vue({
  el: '#app',
  data: {
    message: '',
    todo: [],
    done: []
  },
  methods: {
    submit: function () {
      if (!!this.message) {
        this.todo.splice(0, 0, this.message);
        set(TODO_KEY, this.todo);
        this.message = '';
      }
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
  }
});