<template>
    <div class="welcome-message">
        <b-jumbotron>

            <b-button
                    variant="primary"
                    @click="register"
            >
                Register
            </b-button>
            <b-button v-b-modal.modal-login>Login</b-button>
        </b-jumbotron>

    </div>
</template>

<script>
    // import _ from 'lodash'

    export default {
        props: {
            currentQuestion: Object,
            next: Function,
            increment: Function
        },
        data: function () {
            return {
                selectedIndex: null,
                correctIndex: null,
                shuffledAnswers: [],
                answered: false
            }
        },
        computed: {},
        watch: {},
        methods: {
            login() {
            },
            register() {
            }
        }
    }
</script>

<style scoped>
</style>