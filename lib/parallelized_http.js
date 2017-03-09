'use strict'
var Parallelized_Http;



const http = require('http');
const https = require('https');
const zlib = require('zlib');

Parallelized_Http = (() => {

	Parallelized_Http = () => {};


	Parallelized_Http.get = (host,path,num_split,byte_size,options = {},cb) => {
		console.log("request");

		var counter =0;
		var buffer = []
		var count = num_split;

		var http_options = {
			hostname: host,
			path : path,
			port: 443,
			method: 'GET',
			headers: {

				}
			}
			console.log(http_options)

		for( var i=0;i<num_split;i++){
			var byte_from = i==0 ? 0 : byte_size * i+ 1
			var byte_to = i-1=== num_split ? "" : byte_size  * (i+ 1)
			counter +=1;
			Parallelized_Http._requester(byte_from,byte_to,i,http_options, (body,id)=>{

				buffer[id] = Buffer.concat(body);
				counter = counter -1;
				if (counter === 0){
					Buffer.concat(buffer);
					cb(Buffer.concat(buffer));
				}
			});
		}

	}

	Parallelized_Http._requester = (byte_from,byte_to,id,http_options,cb) => {
		http_options.headers["Range"] = 'bytes=' + byte_from + '-' + byte_to;
		console.log("start")
		var req = https.request(http_options, (res) => {
			let body = [];

			res.on('data', (d) => {
				body.push(d);
			});
			res.on('end', (d) => {
				cb(body,id);
			});
			res.on('error',(e) => {
				console.error("ERROR:: " + e);
			})

		});
		req.end()
	}

	return Parallelized_Http;
})();

module.exports = Parallelized_Http;

