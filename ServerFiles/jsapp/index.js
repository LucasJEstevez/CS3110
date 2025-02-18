#!/usr/bin/env node

const http = require('http')

const handleRequest = (req, res) => {
	res.writeHead(301, {
		Location: "https://uccs.edu"
	})
	res.write('howdy!')
	res.close()
}
const server = http.createServer(handleRequest)
server.listen(3000)
