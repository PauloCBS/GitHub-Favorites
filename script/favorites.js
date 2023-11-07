export class GithubUser {
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint).then(data =>data.json())
        .then(
            ({login, name, public_repos, followers} )=> ({
            
            login,
            name,
            public_repos,
            followers

        }))
    }
}



export class Favorites {
    constructor(root){
        this.root = document.querySelector(root)
        this.load()

        GithubUser.search('PauloCBS').then(user => console.log(user))
    }

    load(){
       this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }
        /*this.entries =  [{
            login:'PauloCBS',
            name:"Paulo Silva",
            public_repos:'55',
            followers:'1'
        },
        {
            login: 'maykbrito',
            name: 'Mayk Brito',
            public_repos: '76',
            followers: '9589'
        },
        {
            login: 'diego3g',
            name: 'Diego Fernandes',
            public_repos: '48',
            followers: '22503'
        },  
    ] }*/
    
    async add(username){
     const user = await GithubUser.search(username)
    }
    
    delete(user){
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
       
        this.entries = filteredEntries
        this.update()
    }
}



export class FavoritesView extends Favorites{
    constructor(root){
    super(root)

    this.tbody = this.root.querySelector('table tbody')
    this.update()   
    this.onadd() 
     
    }

    onadd(){
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const input = this.root.querySelector('.search input').value
        
           this.add(input)
        }
         
    }



    update(){
        this.removeAllTr()    
        

        this.entries.forEach(user => {
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            row.querySelector('.remove').onclick = () => {
               const isOkay = confirm('Are you sure you want to remove this favorite ?')

               if(isOkay){
                    this.delete(user)
               }
            }


            this.tbody.append(row)

         
        })


    }




    createRow(){

        const tr = document.createElement('tr') 

        tr.innerHTML =`
        <td class="user">
            <img src="https://github.com/PauloCBS.png" alt="imagem de Paulo Silva">
            <a href="https://github.com/PauloCBS">
            <p>Paulo Silva</p>
            <span>PauloCBS</span>
            </a>
        </td>
        <td class="repositories">
            55
        </td>
        <td class="followers">
            1
        </td>
        <td>
            <button class="remove">&times;</button>
        </td>`

        
        return tr

        
    }

    removeAllTr() {


        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        });
    } 
    
}