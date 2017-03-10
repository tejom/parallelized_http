# parallelized_http

Small wrapper around http requests to use the range header to parallelize http requests.

Example:

```javascript
/* host, path, number of requests , byte size [,options] */

p_http.get("www.google.com","/",2,300,{})
	.then( (res) => {
		console.log(res);
		console.log(res.body.toString());
	})
	.catch( (err) => {
		console.error(err);
	});
```
res contains the last requests response object from node
body contains the joined body
