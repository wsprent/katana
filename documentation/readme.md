# Katana API proposal

_**This is draft proposal to refactor existing Katana REST API in order to anticipate open API standards, bring clarity into development processes, make it easily extended and tested with the swagger tools integration or other ones thus provide the high quality services for the developers and engineering team's tools that rely on Katana integration.**_



[Katana API preview](http://docs.katanaapi.apiary.io/) with the apiary editor tool.

The proposal build in accordance to The OpenAPI Specification (fka The Swagger Specification)
The goal of The OpenAPI Specification is to define a standard, language-agnostic interface to REST APIs which allows both humans and computers to discover and understand the capabilities of the service without access to source code, documentation, or through network traffic inspection. When properly defined via OpenAPI, a consumer can understand and interact with the remote service with a minimal amount of implementation logic. Similar to what interfaces have done for lower-level programming, OpenAPI removes the guesswork in calling the service. 

More information about open API initialive [here](https://openapis.org/) and the github project with examples [here](https://github.com/OAI/OpenAPI-Specification/tree/OpenAPI.next).

##### What's Swagger?
The information about swagger and tools can be found [here](http://swagger.io/) .
___

## Structure



The following structure represents a list of best practices and primarily guideline which I've tried to follow making the proposal. It's not the requirement - the document is the draft proposal and opens for modifications, customizations, polishing. 

___
##### Use RESTful URLs and actions.

The key principles of REST involve separating your API into logical resources. These resources are manipulated using HTTP requests where the method (GET, POST, PUT, PATCH, DELETE) has specific meaning. 

Use PUT, POST and DELETE methods  instead of the GET method to alter the state. 

```
GET 	/builds - Retrieves a list of builds
GET 	/builds/12 - Retrieves a specific build
POST 	/builders/{builder-name} - Starts new builds(creates)
PUT 	/builds/12 - Updates the build state e.g. stop/cancel etc.
```
Do not use verbs:
```
/builds/11/force
/builds/11/cancel
```

Use plural nouns:
```
/builds
/builders/{name}/builds
```
___
#### POST, PUT, PATCH should return a resource representation
    
A PUT, POST or PATCH call may make modifications to fields of the underlying resource that weren't part of the provided 	  parameters (for example: created_at or updated_at timestamps). To prevent an API consumer from having to hit the API again for an updated representation, have the API return the updated (or created) representation as part of the response.

___
#### Parameters

 1.	GET method and query parameters should not alter the state.    
    
 2. POST, PUT, PATCH - only JSON payload in request body.

 3. Result filtering, sorting & searching.
 
 	Complex result filters, sorting requirements and advanced searching can all be easily implemented as query parameters on top of the base URL    
    
 4. Limiting number of fields are returned by the API - pagination and partial response.
 
 There is a quite similar to GraphQL technic to limit API response by fields filtering. Format of the fields parameter can list either fields that user wants include or exclude.
 
 Example of partial response:
 
```
 /builds:(number,steps,properties)
 /builds:(-steps,-properties)
```

___
#### Use separate links for sub-resources

So it would be good we try to avoid returning along with the big JSON object the fields that are also array. 

Bad example of JSON response that returns **currentBuilds** array along with the list of builders:

_request_: 

```
/builds
/builders/{name}/builds
```
_response_:
```json
[{
	proj0-ABuildVerification: {
		currentBuilds: [
		{ 
        		....
        }
		],
		friendly_name: "ABuildVerification",
		name: "proj0-ABuildVerification",
    ...
    },
    {
    ...
    }]
```
    
___
#### HTTP Status Codes
The RESTful Web Service should respond to a client’s request with a suitable HTTP status response code and error payload.

* 2xx – success – everything worked fine.
* 4xx – client error – if the client did something wrong (e.g. the client sends an invalid request or he is not authorized)
* 5xx – server error – if the server did something wrong (e.g. error while trying to process the request)


_Codes used in proposal_:

- **200** – OK – Eyerything is working
- **201** – OK – New resource has been created
- **204** – OK – The resource was successfully deleted

- **304** – Not Modified – The client can use cached data

- **400**  – Bad Request – The request was invalid or cannot be served. The exact error should be explained in the error payload. e.g. „The JSON is not valid“
- **401** – Unauthorized – The request requires an user authentication
- **403** – Forbidden – The server understood the request, but is refusing it or the access is not allowed.
- **404** – Not found – There is no resource behind the URI.
- **422** – Unprocessable Entity – Should be used if the server cannot process the enitity, e.g. if an image cannot be formatted or mandatory fields are missing in the payload.

- **500** – Internal Server Error – API developers should avoid this error. If an error occurs in the global catch blog, the stracktrace should be logged and not returned as response.

___

#### JSON code style 

I propose to follow [Google JSON code style](https://google.github.io/styleguide/jsoncstyleguide.xml#Examples) in general, make documented customisations if required.

But there the following statements would be great to make more clear:

- Naming conventions: JSON field names must be camelCase. Other than capitalization of the initial letter, the two should almost always match. Neither underscores no dashes.
- do not use abbreviations in the API, except where they are extremely commonly used, such as "id", "args", or "stdin".
- Acronyms should similarly only be used when extremely commonly known. All letters in the acronym should have the same case, using the appropriate case for the situation. For example, at the beginning of a field name, the acronym should be all lowercase, such as "httpGet". If it constant, all letters should be uppercase, such as "TCP" or "UDP".
