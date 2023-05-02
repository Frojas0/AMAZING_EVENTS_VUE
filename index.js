const { createApp } = Vue;
const url = 'https://mindhub-xj03.onrender.com/api/amazing';

const app = createApp({
    //Inicializo variables
    data() {
        return {
            events: [],
            categories: [],
            searchValue: '',
            checked: [],
            filteredCategories: []
        }
    },

    //Asigno valores a las variables
    created() {
        fetch(url)
            .then(answer => answer.json())
            .then(data => {
                console.log(data)
                this.events = data.events
                this.categories = [... new Set(data.events.map(event => event.category))]

            })
            .catch(err => console.log(err))
    },
    //Creo funciones a computar
    computed: {
        filter() {
            let searchFilter = this.events.filter(event => event.name.toLowerCase().includes(this.searchValue.toLowerCase()))
            let checkBoxFilter = searchFilter.filter(event => this.checked.includes(event.category) || this.checked.length == 0)
            this.filteredCategories = checkBoxFilter
        }
    }
})

app.mount('#vueApp');