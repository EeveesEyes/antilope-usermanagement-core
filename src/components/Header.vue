<template>
    <div>
        <b-nav tabs>
            <b-nav-item disabled><b>Application</b></b-nav-item>
            <b-nav-item disabled>Token: {{ token }}</b-nav-item>
            <b-nav-item>
                <b-button v-b-modal.modal-login>Login</b-button>
            </b-nav-item>
        </b-nav>
        <b-modal id="modal-login"
                 ref="modal"
                 title="Login"
                 @show="resetModal"
                 @hidden="resetModal"

                 @ok="handleOk">
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                        :state="emailState && passwordState && !loginError"
                        label="Enter your Credentials"
                        label-for="credentials-input"
                        :invalid-feedback="loginErrorMessage"
                >
                    <b-form-input
                            id="email-input"
                            v-model="email"
                            :state="emailState"
                            :class="{'login-error': loginError }"
                            @change="checkFormValidity"
                            required
                    />
                    <b-form-input
                            id="password-input"
                            v-model="password"
                            :state="passwordState"
                            :class="{'login-error': loginError }"
                            @change="checkFormValidity"
                            required
                    />
                </b-form-group>
            </form>
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
                emailState: null,
                passwordState: null,
                loginError: false,
                loginErrorMessage: ''
            }
        },
        computed: mapState(['token']),
        methods: {
            checkFormValidity() {
                const valid = this.$refs.form.checkValidity();
                this.emailState = valid;
                this.passwordState = valid;
                // eslint-disable-next-line no-console
                console.log('states', this.emailState, this.passwordState);

                return valid;
            },
            resetModal() {
                this.email = '';
                this.password = '';
                this.emailState = null;
                this.passwordState = null;
            },
            handleOk(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault();
                // Trigger submit handler
                this.handleSubmit()
            },
            async handleSubmit() {
                // Exit when the form isn't valid
                if (!this.checkFormValidity()) {
                    this.getLoginErrorMessage();
                    return
                } else {
                    // eslint-disable-next-line no-console
                    console.log('credentials', {email: this.email, password: this.password});
                    await this.$store.dispatch('login',
                        {email: this.email, password: this.password})
                        .catch(() => {
                            this.loginError = true;
                            this.emailState = false;
                            this.passwordState = false;
                        });
                    // eslint-disable-next-line no-console
                    console.log('login error', this.loginError);
                    if (this.loginError) {
                        this.getLoginErrorMessage();
                        this.loginError = false;
                        return;
                    }
                }
                // eslint-disable-next-line no-console
                console.log('error', this.loginError);
                // Hide the modal manually
                this.$nextTick(() => {
                    this.$refs.modal.hide()
                })
            },
            getLoginErrorMessage() {
                this.loginErrorMessage = this.loginError ? 'Invalid Email or Password' : 'Email and Password are required';
            }
        }
    }
</script>

<style scoped>
    .login-error {
        border-color: red;
    }
</style>