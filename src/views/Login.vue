<template>
  <div class="uk-container uk-container-xsmall">
    <form class="uk-padding uk-grid-small uk-child-width-1-1@s" uk-grid @submit.prevent="submit">

      <div class="uk-inline uk-padding-remove-horizontal uk-margin-small">
        <span class="uk-form-icon" uk-icon="icon: user"></span>
        <input 
          id="email"
          required
          type="email"
          name="email"
          class="uk-input"
          v-model="form.email"
        >
      </div>

      <div class="uk-inline uk-padding-remove-horizontal uk-margin-small">
        <span class="uk-form-icon uk-form-icon-flip" uk-icon="icon: lock"></span>
        <input 
          id="password"
          type="password"
          name="password"
          class="uk-input"
          required
          v-model="form.password"  
        >
      </div>

      <button class="uk-button uk-button-default uk-margin-small" type="submit">Submit</button>

    </form>
  </div>
  <!-- <div class="page-container">
    <base-transition>
      <div v-if="loading" key="1" class="spinner-container">
        <base-spinner />
      </div>

      <div v-else key="2" class="row justify-content-center">
        <h1>Login</h1>
        <div v-if="error" class="alert alert-danger">{{error}}</div>
        <form action="#" @submit.prevent="submit">
          <div class="form-group row">
            <label for="email" class="col-md-4 col-form-label text-md-right">Email</label>

            <div class="col-md-6">
              <input
                id="email"
                type="email"
                class="form-control"
                name="email"
                value
                required
                autofocus
                v-model="form.email"
              />
            </div>
          </div>

          <div class="form-group row">
            <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>

            <div class="col-md-6">
              <input
                id="password"
                type="password"
                class="form-control"
                name="password"
                required
                v-model="form.password"
              />
            </div>
          </div>

          <div class="form-group row mb-0">
            <div class="col-md-8 offset-md-4">
              <button type="submit" class="btn btn-primary">Login</button>
            </div>
          </div>
        </form>
      </div>
    </base-transition>
  </div> -->
</template>

<script>
/* eslint-disable */
import firebase from "firebase"
import BaseSpinner from './../components/BaseSpinner/index'
import BaseTransition from './../components/BaseTransition/index'

export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      error: null,
      loading: false
    };
  },
  components: {
    BaseSpinner,
    BaseTransition
  },
  methods: {
    submit() {
      this.loading = true
      
      firebase
        .auth()
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(() => {
          
        })
        .catch(err => {
          this.error = err.message;
        })
        .finally(() => {
          this.loading = true
        })
    }
  }
};
</script>

<style lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: flex-start;
  align-items: center;
}
.spinner-container {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>