/*---------- Params ----------*/
const params = new URLSearchParams(location.search);
const id = params.get("id");

const { createApp } = Vue;
const url = 'https://mindhub-xj03.onrender.com/api/amazing';

const app = createApp({
    //Inicializo variables
    data() {
        return {
            event: [],
        }
    },

    //Asigno valores a las variables
    created() {
        fetch(url)
            .then(answer => answer.json())
            .then(data => {
                this.event = data.events.find(element => element._id == id)
            })
            .catch(err => console.log(err))
    },
})

app.mount('#vueApp');