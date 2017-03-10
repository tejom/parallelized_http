# parallelized_http

Small wrapper around http requests to use the range header to parallelize http requests.

Example:

```javascript
p_http.get("www.google.com","/",2,300,{}, (res) => {
	console.log(res.res.statusCode)
	console.log(res.body.toString());
});

```

get()'s callback will pass an object {res,body}.
res contains the last requests response object from node
body contains the joined body
