# parallelized_http

Small wrapper around http requests to use the range header to parallelize http requests.

Example:

```javascript
p_http.get("www.google.com","/",2,300,{}, (res) => {
	console.log(res.toString());
});
```

get()'s callback will pass a Buffer.
