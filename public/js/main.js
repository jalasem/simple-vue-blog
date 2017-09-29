window.localStorage.setItem('auth', JSON.stringify({
  authenticated: false,
  username: 'demo',
  password: 'blog'
}, undefined, 2));

Vue.component('backButton',{
  template: `
    <button @click="back"><slot>Go Home</slot></button>
  `,
  methods: {
    back(){
      this.$parent.$emit('back');
    }
  }
})

Vue.component('login', {
  template: `
    <div>
      <h4>Login</h4>

      <div id="form">
        <input autofocus placeholder="username" type="text" v-model="input.username">
        <input type="password" placeholder="password" v-model="input.password">
        <p><small>Hint: use 'demo' as username and 'blog' as password</small></p>
        <button @click="login">Login</button>
      </div>
    </div>
  `,
  data() {
    return {
      input: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login(){
      this.$emit('attempt', this.input.username, this.input.password);
    }
  }
})

Vue.component('create-post', {
  template: `
    <div>
      <backButton></backButton>
      <textarea placeholder="Post Body" type="text" v-model="body"></textarea>
      <input placeholder="creator" type="text" v-model="by">
      <button @click="handleSubmit">create post</button>
    </div>
  `,
  data(){
    return {
      body: '',
      by: ''
    }
  },
  methods: {
    handleSubmit(){
      this.$emit('create', this.body, this.by);
    }
  }
})

Vue.component('edit-post', {
  props: ['the_post'],
  template: `
    <div>
      <backButton>back</backButton>
      <textarea placeholder="Post Body" type="text" v-model="content"></textarea>
      <input placeholder="creator" type="text" v-model="creator">
      <button @click="handleEdit">create post</button>
    </div>
  `,
  data(){
    return {
      content: '',
      creator: '',
      post_id: null,
      newEdit: {}
    }
  },
  mounted(){
    this.content = this.text;
    this.creator = this.by;
    this.post_id = this.id;
  },
  computed: {
    by(){
      return this.the_post.by;
    },
    text(){
      return this.the_post.text;
    },
    id(){
      return this.the_post.id
    }
  }, 
  methods: {
    handleEdit(){
      this.newEdit = {
        text: this.content,
        by: this.creator,
        id: this.post_id
      }
      this.$emit('now-edit', this.newEdit)
    }
  }
})



Vue.component('singlepost', {
  props: ['body', 'by', 'id'],
  template: `
    <div>
      <fieldset>
        <h4>{{ body }}</h4>
        <p><b>By:</b>{{ by }}</p>
        <button @click="del">Delete</button>
        <button @click="edit">Edit</button>
      </fieldset>
      <br>
    </div>
  `,
  methods: {
    del() {
      this.$emit('delPost', this.id);
    }, 
    edit() {
      this.$parent.$emit('edit-post', this.id);
    }
  }
});

Vue.component('blog-area', {
  props: ['blogposts'],
  template: `
    <div>
      <button style="margin-bottom:1rem;" @click="goCreate">Create Post</button>
      <h5 v-if="allPosts.length === 0">There are no posts here, Click 'create post' to create a post</h5>
      <singlepost @delPost="deletePost" v-for="(post, index) in allPosts" :body="post.text" :by="post.by" :id="index" :key="post.id"></singlepost>
    </div>
  `,
  data(){
    return {
      posts: []
    }
  },
  computed: {
    allPosts() {
      return this.blogposts;
    }
  },
  methods: {
    deletePost(id){
      this.$emit('del', id);
    },
    goCreate(){
      this.$emit('switch', 'create');
    }
  },
  mounted() {
    // console.log(this.$children);
  }
});


var Blog = new Vue({
  el: 'main',
  data: {
    auth: {},
    blog: {},
    currentView: '',
    postToEdit: {}
  },
  methods: {
    switchTo(to){
      this.currentView = to;
    },
    openEdit(id) {
      this.postToEdit = this.blog.posts[id];
      console.log(this.postToEdit);
      this.switchTo('edit');
    },
    tryLogin(user, pass) {
      console.log("trying to login");
      if(this.auth.username === user && this.auth.password === pass) {
        this.auth.authenticated = true;
        this.switchTo('blog');
        window.localStorage.setItem('auth', JSON.stringify(this.auth, undefined, 2));
      } else{
        console.log("incorrect password");
      }
    },
    go_home(){
      this.switchTo('blog');
    },
    delPost(id){
      if(confirm('Are you sure to delete this post?')){
        this.blog.posts.splice(id,1);window.localStorage.setItem('blog', JSON.stringify(this.blog, undefined, 2));
      }
    },
    edtPost(post_data) {
      var index = post_data.id - 1;
      this.blog.posts[index] = post_data;
      window.localStorage.setItem('blog', JSON.stringify(this.blog, undefined, 2));
      this.switchTo('blog');
    },
    createPost(body, by){
      var newId = this.blog.posts.length + 1;
      this.blog.posts.push({text:body, id: newId, by});
      window.localStorage.setItem('blog', JSON.stringify(this.blog, undefined, 2));
      this.switchTo('blog');
    }
  },
  mounted () {
    if(this.auth.authenticated){
      this.currentView = 'blog'
    } else {
      this.currentView = 'login'
    }
    this.auth = JSON.parse(window.localStorage.getItem('auth'));
    if(JSON.parse(window.localStorage.getItem('blog'))){
      this.blog = JSON.parse(window.localStorage.getItem('blog'));
    } else {
      window.localStorage.setItem('blog', JSON.stringify({
  posts: [
    {id:1,text: 'Atque soluta illum cupiditate fugit praesentium explicabo quisquam, commodi voluptatum iste dolorem aspernatur, eius eum volupta', by: 'Admin'},
    {id:2,text: 'orem ipsum dolor sit amet consectetur adipisicing elit. Atque soluta illum cupiditate fugit praesentium explicabo quisquam, commodi voluptatum iste dolorem aspernatur, eius eum volupta', by: "Heyna"}
  ]
}, undefined, 2));
      this.blog = JSON.parse(window.localStorage.getItem('blog'));
    }
  }
});

// Blog.on.$emit('refresh')


/**
 * ===// Specs //==
 * login
 * view posts
 * create post
 * edit post
 * delete post
 */