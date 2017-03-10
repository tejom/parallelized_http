'use strict';
var Parallelized_Http;

const http = require('http');
const https = require('https');
const zlib = require('zlib');

Parallelized_Http = (() => {

	Parallelized_Http = () => {};

	Parallelized_Http.get = (host,path,num_split,byte_size,options = {}) => {
		return new Promise( (resolve, reject) =>{
			var counter =0;
			var buffer = [];
			var port;
			var protocol;

			if (host.startsWith("https://")) {
				port = 443;
				protocol = https;
				host = host.replace("https://","");
			} else if (host.startsWith("http://")) {
				port = 80;
				protocol = http;
				host = host.replace("http://","");
			} else {
				reject("ERROR:: No protocol specified in host [http(s)://] ");
			}

			var http_options = {
				hostname: host,
				path : path,
				port:  options['port'] ||  port,
				method: options['method'] || 'GET',
				headers: {}
			};

			var _response_handler = (response) => {
				var id = response.id;
				var body = response.body;
				var res = response.res;

				buffer[id] = Buffer.concat(body);
				counter = counter -1;
				if(res.statusCode !== 206 ){	//check for partial content response
					resolve({
						body: buffer[id],
						res: res
					});
				}
				if (counter === 0){
					resolve({
						body: Buffer.concat(buffer),
						res: res
					});
				}
			}

			for( var i=0;i<num_split;i++){
				var byte_from = i === 0 ? 0 : byte_size * i+ 1;
				var byte_to = i+1 === num_split ? "" : byte_size  * (i+ 1);
				counter +=1;
				Parallelized_Http._requester(byte_from,byte_to,i,http_options,protocol)
					.then(_response_handler)
					.catch( (err)=> {
						console.log(err);
					});
			}
		});
	};

	Parallelized_Http._requester = (byte_from,byte_to,id,http_options,protocol) => {
		return new Promise( (resolve,reject) => {
			http_options.headers["Range"] = 'bytes=' + byte_from + '-' + byte_to;

			var req = protocol.request(http_options, (res) => {
				let body = [];

				res.on('data', (d) => {
					body.push(d);
				});
				res.on('end', (d) => {
					resolve({res: res,body: body,id: id});
				});
				res.on('error',(e) => {
					console.error("ERROR:: " + e);
					reject("ERROR:: " + e);
				});

			});
			req.end();
		});
	};

	return Parallelized_Http;
})();

module.exports = Parallelized_Http;
