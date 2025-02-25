#!/usr/bin/env node

const http = require('http')

let votes = [0, 0, 0]
let candids = ["Rick", "Yo Mama", "Grumpy Cat"]

const handleRequest = (req, res) => {

  //if going to /api
  if (req.url == '/api') {
    const [path, query] = req.url.split('?')

    //if post request
    if (req.method == "POST") {
      let body = ''
      req.on('data', (data) => {
        body += data
      })
      req.on('end', () => {
        /*
        const params = Object.fromEntries(body.split('&').map(
            (param) => param.split('=')
        ))
         */
        try {
          const params = JSON.parse(body)
        }
        catch(e){
          res.writeHead(400)
          res.end('Bad. Go Away.')
        }
        console.log("trying to get num")
        opt = params.num
        console.log(opt)
        validInput = (opt >= 1 && opt <= votes.length)
        console.log("validInput? ", validInput)
        if (validInput) {
          votes[opt-1]++

          //this was the kbye function before
          res.writeHead(200, {
            "Content-Type": "text/html"
          })
          res.write("<h1>Good Job!</h1><p>You voted for ")
          res.write(candids[opt-1])
          res.write("!</p><h3>Current Standings:</h3><table>")
          for(let i=0; i<votes.length;i++){
            res.write("<tr><td>")
            res.write(candids[i])
            res.write("</td><td>\t")
            res.write(votes[i].toString())
            res.write("</td></tr>")
          }
          res.write("</table><br><br><a href='/'>Home</a>")
          res.end()
        }
        else {
          res.writeHead(401, {
            "Content-Type": "text/html"
          })
          res.write("<h1>Invalid Input!</h1><br>")
          res.write("<p>You must enter a number between 1 and ")
          res.write(votes.length.toString())
          res.write("!</p><br>")
          res.write("<a href='/'>Home</a>")
          res.end()
        }

      })
    }

    //if not a valid post request
    else {
      res.writeHead(400, {
        "Content-Type": "text/html"
      })
      res.write("<h1>Must Fill Out Form</h1><br><a href='/'>Home</a>")
      res.end()
    }
  }
  else{
    res.writeHead(404, {
      "Content-Type": "text/html"
    })
    res.write("<h1>Page not found, please try again later</h1><br><a href='/'>Home</a>")
    res.end()
  }
}

/*
const kbye = (res) => {
  res.writeHead(200, {
    "Content-Type": "application/json"
  })
  res.write(JSON.stringify(dancers))
  res.end()
}
*/

//handleRequest is the function defined at the top of this file
const server = http.createServer(handleRequest)

//listens on port 3000 for js requests
server.listen(3000)
