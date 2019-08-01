<template>
    <div id="app">
        <Header/>
        <Footer/>
    </div>
</template>

<script>
    import Header from '@/components/layouts/Header';
    import Footer from '@/components/layouts/Footer';

    export default {
        name: "App",
        components: {
            Header,
            Footer
        },
    }
</script>

<style lang="scss">
    @import "assets/scss/index";
</style>
