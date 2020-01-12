<template>
    <div>
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
                            @change="checkFormValidity"
                            required
                    />
                    <b-form-input
                            id="password-input"
                            v-model="password"
                            :state="passwordState"
                            @change="checkFormValidity"
                            required
                    />
                </b-form-group>
            </form>
        </b-modal>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "Login",
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
                    await this.$store.dispatch('login',
                        {email: this.email, password: this.password})
                        .catch(() => {
                            this.loginError = true;
                            this.emailState = false;
                            this.passwordState = false;
                        });
                    if (this.loginError) {
                        this.getLoginErrorMessage();
                        this.loginError = false;
                        return;
                    }
                }
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