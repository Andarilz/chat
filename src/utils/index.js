import axios from "axios";

export const getUserFetchData = async (id) => { //делаем запрос к бд для получения данных

    await axios.get(`https://chat-14c5a-default-rtdb.europe-west1.firebasedatabase.app/users.json`)
        .then(res => {
            const results = res.data || []

            if (results) {
                const keysOfMessages = Object.keys(results) //получаем ключи объектов с сообщениями

                const mess = keysOfMessages.map(res => results[res]) //перебираем данные для удобства, формируя массив данных из объекта с ключами


                mess.map((el, i) => {
                    if (el.uid === id) {
                        this.setState({
                            userCounter: i
                        })
                    }
                })

                const usersCorrectKey = keysOfMessages[this.state.userCounter]

                if (usersCorrectKey) {
                    this.setState({
                        usersCorrectKey //id в firebase
                    })

                    if (usersCorrectKey) {
                        this.setState({
                            userCorrectData: results[usersCorrectKey],
                            usersCorrectKey //id в firebase
                        })

                        if (this.state.userCorrectData) {
                            this.setState({
                                avatar: this.state.userCorrectData.avatar,
                                name: this.state.userCorrectData.name,
                                uid: this.state.userCorrectData.uid,
                                colors: this.state.userCorrectData.colors
                            })

                            if (this.state.userCorrectData.starred) {
                                this.setState({
                                    starred: this.state.userCorrectData.starred
                                })
                            }

                        }
                    }
                }
            }
        })
}