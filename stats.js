const { createApp } = Vue;
const url = 'https://mindhub-xj03.onrender.com/api/amazing';

const app = createApp({
    //Inicializo variables
    data() {
        return {
            events: [],
            categories: [],
            upcomingCategories: [],
            pastCategories: [],
            upcomingEvents: [],
            pastEvents: [],
            table1: [],
            table2: [],
            table3: [],
        }
    },

    //Asigno valores a las variables
    created() {
        fetch(url)
            .then(answer => answer.json())
            .then(data => {
                console.log(data);
                this.events = data.events
                this.categories = [... new Set(data.events.map(event => event.category))]
                this.upcomingEvents = data.events.filter(event => event.date > data.currentDate)
                this.pastEvents = data.events.filter(event => event.date < data.currentDate)
                this.upcomingCategories = [... new Set(data.events.filter(event => event.date > data.currentDate).map(event => event.category))]
                this.pastCategories = [... new Set(data.events.filter(event => event.date < data.currentDate).map(event => event.category))]

                //table1
                let attendancePercentage = data.events.map(event => (event.assistance * 100) / event.capacity).filter(event => event > 0)
                let capacities = data.events.map(event => event.capacity)
                let maxAttendance = Math.max(...attendancePercentage)
                let minAttendance = Math.min(...attendancePercentage)
                let maxCapacity = Math.max(...capacities)
                let accT1 = []
                accT1.push((data.events[(attendancePercentage.indexOf(maxAttendance))]),
                    (data.events[(attendancePercentage.indexOf(minAttendance))]),
                    (data.events[(capacities.indexOf(maxCapacity))]))
                this.table1 = accT1

                //table2
                this.objectList(
                    'table2',
                    this.upcomingCategories,
                    this.revenues(this.upcomingEvents, this.upcomingCategories, 'estimate'),
                    this.attendance(this.upcomingEvents, this.upcomingCategories, 'estimate')
                )

                //table3
                this.objectList(
                    'table3',
                    this.pastCategories,
                    this.revenues(this.pastEvents, this.pastCategories, 'assistance'),
                    this.attendance(this.pastEvents, this.pastCategories, 'assistance')
                )
            })
            .catch(err => console.log(err))
    },
    //Aca van las funciones
    methods: {

        //Ganancia
        revenues(list, categories, properties) {
            let accObj = {};
            for (let i of categories) {
                accObj[i] = 0;
                for (let event of list) {
                    if (event.category.includes(i)) {
                        accObj[i] += (event.price * event[properties]);
                    }
                }
            }
            console.log(accObj);
            return accObj;
        },

        //Asistencia
        attendance(list, categories, properties) {
            let accObj = {};
            for (let category of categories) {
                accObj[category] = 0;
                let acc = 0;
                for (let i = 0; i < list.length; i++) {
                    if (list[i].category.includes(category)) {
                        accObj[category] += ((list[i][properties] * 100) / list[i].capacity);
                        acc++;
                    }
                }
                accObj[category] = Number((accObj[category] / acc).toFixed(2));
            }
            console.log(accObj);
            return accObj;
        },

        //Crear Lista Objetos
        objectList(table, categories, revenues, assistances) {
            for (let i = 0; i < categories.length; i++) {
                this[table].push({ name: categories[i], revenue: revenues[categories[i]], assistance: assistances[categories[i]] })
            }
            console.log(this[table]);
        }
    },
})

app.mount('#vueApp');