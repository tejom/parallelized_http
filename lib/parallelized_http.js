'use strict'
var Parallelized_Http;

const http = require('http');
const https = require('https');
const zlib = require('zlib');

Parallelized_Http = (() => {

	Parallelized_Http = () => {};

	Parallelized_Http.get = (host,path,num_split,byte_size,options = {},cb) => {

		var counter =0;
		var buffer = []
		var count = num_split;

		var http_options = {
			hostname: host,
			path : path,
			port: 443,
			method: 'GET',
			headers: {}
		}

		for( var i=0;i<num_split;i++){
			var byte_from = i==0 ? 0 : byte_size * i+ 1
			var byte_to = i-1=== num_split ? "" : byte_size  * (i+ 1)
			counter +=1;
			Parallelized_Http._requester(byte_from,byte_to,i,http_options, (res,body,id)=>{

				buffer[id] = Buffer.concat(body);
				counter = counter -1;
				if(res.status !== "206"){	//check for partial content response
					cb({
						body: buffer[id],
						res: res
					});
					return;
				}
				if (counter === 0){
					Buffer.concat(buffer);
					cb({
						body: Buffer.concat(buffer),
						res: res
					});
				}
			});
		}
	}

	Parallelized_Http._requester = (byte_from,byte_to,id,http_options,cb) => {
		http_options.headers["Range"] = 'bytes=' + byte_from + '-' + byte_to;

		console.log("start")
		var req = https.request(http_options, (res) => {
			console.log(res.headers)
			let body = [];

			res.on('data', (d) => {
				body.push(d);
			});
			res.on('end', (d) => {
				console.log(body)
				cb(res,body,id);
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

