<template>
    <div id="app">
        <Header/>

        <b-container class="bv-example-row">
            <b-row>
                <b-col sm="6" offset="3">
                    <Welcome/>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import Header from './components/Header.vue'
    import Welcome from "@/components/Welcome";

    export default {
        name: 'app',
        components: {
            Welcome,
            Header,
        },
        data() {
            return {
                questions: [],
                index: 0,
                numCorrect: 0,
                numTotal: 0
            }
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>