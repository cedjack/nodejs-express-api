const express = require('express')
const app = express()
const host = 'localhost'
const port = 8000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// middleware

app.use((req, res, next) => {
    res.html = async (html) => {
        res.set('Content-Type', 'text/html').send(html);
    }
    next();
});

app.use((req, res, next) => {
    res.error = async (code, message) => {
        let json = {
            "errorCode": code,
            "errorMessage": message
        }
        res.statusCode = code
        res.send(json);
    }
    next();
});

// data 

const contacts = [
    {
        id: 1,
        firstname: 'Pierre',
        lastname: 'KIROUL'
    },
    {
        id: 2,
        firstname: 'Jean',
        lastname: 'BON'
    },
    {
        id: 3,
        firstname: 'Christelle',
        lastname: 'LOVWANANOZER'
    }
]

// api

app.get('/api/', async (req, res) => {
    // res.json(contacts)
    code_html = `
        <h1>Documentation</1>
        <ul>
            <li>
                <b>GET /api/contacts</b> : Retourne la liste des contacts.
            </li>
            <li>
                <b>GET /api/contacts/:id</b> : Retourne le contact dont l'identifiant est id.
            </li>
            <li>
                <b>POST /api/contacts</b> : Crée un nouveau contact (données en body/json).
            </li>
            <li>
                <b>PUT /api/contacts/:id</b> : Met à jour un contact existant dont l'identifiant est id (données en body/json).
            </li>        
            <li>
                <b>DELETE /api/contacts/:id</b> : Supprimer un contact existant dont l'identifiant est id.
            </li>        
        </ul>
        <br>data:
        <br>${JSON.stringify(contacts)}
    `
    res.html(code_html)
})

app.get('/api/contacts', async (req, res) => {
    res.json(contacts)
})

app.get('/api/contacts/:id', async (req, res) => {
    let existingContact = contacts.find(contact => contact.id === parseInt(req.params.id))
    if (!existingContact) res.error(404, `Contact ${req.params.id} no found`)
    await res.json(existingContact)
})

app.post('/api/contacts', async (req, res) => {
    let newContact = req.body
    if (!newContact) res.error(404, `bad content`)
    newContact.id = contacts.length + 1
    contacts.push(newContact)
    await res.json(newContact)
})

app.put('/api/contacts/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    if (isNaN(id)) res.json(`bad parameter`)
    let existingContact = contacts.find(contact => contact.id === id)
    if (!existingContact) res.error(404, `Contact ${req.params.id} no found`)
    let updateContact = req.body;
    if (!updateContact) res.error(404, `bad content`)
    delete updateContact.id;
    Object.assign(existingContact, updateContact)
    await res.json(existingContact);
})


app.delete('/api/contacts/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    if (isNaN(id)) throw 'Bad paremeter.';
    let existingContact = contacts.find(contact => contact.id === id);
    if (!existingContact) throw `Contact ${id} not found.`;
    let index = contacts.indexOf(existingContact);
    contacts.splice(index, 1);
    await res.json(existingContact);
})

app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`)
})