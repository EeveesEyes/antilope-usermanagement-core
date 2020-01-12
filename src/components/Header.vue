<template>
    <div>
        <b-nav tabs>
            <b-nav-item disabled><b>Application</b></b-nav-item>
            <b-nav-item disabled>Token: {{ token }}</b-nav-item>
            <b-nav-item>
                <b-button v-b-modal.modal-1>Login</b-button>
            </b-nav-item>
        </b-nav>
        <b-modal id="modal-1">

            <label>Email:
                <input v-model="email" placeholder="Email"
                       :class="{'login-error': loginError }">
            </label>
            <label>Password:
                <input v-model="password" placeholder="Password"
                       :class="{'login-error': loginError }">
            </label>
            <b-button variant="primary"
                      @click='login'>Login
            </b-button>
        </b-modal>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        data() {
            return {
                email: 'stephan.testmann@test.de',
                password: 'indspowü13DF2',
                loginError: false,
            }
        },
        computed: mapState(['token']),
        methods: {
            login() {
                this.$store.dispatch('login', {email: this.email, password: this.password})
                    .catch(() => {
                        this.loginError = true
                    });
            }
        }
    }
</script>

<style scoped>
    .login-error {
        background: red;
    }
</style>