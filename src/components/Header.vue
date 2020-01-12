<template>
    <div>
        <login/>
        <b-nav tabs>
            <b-nav-item disabled><b>Application</b></b-nav-item>
            <b-nav-item disabled>Token: {{ token }}</b-nav-item>
            <b-nav-item>
                <b-button v-b-modal.modal-login>Login</b-button>
            </b-nav-item>
        </b-nav>
    </div>
</template>

<script>

    import Login from "@/components/Login";
    import {mapState} from "vuex";

    export default {
        components: {Login},
        computed: mapState(['token']),
    }
</script>